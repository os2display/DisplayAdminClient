import { React, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { Spinner } from "react-bootstrap";
import { useDispatch } from "react-redux";
import set from "lodash.set";
import {
  api,
  useGetV2FeedSourcesQuery,
} from "../../../redux/api/api.generated.ts";
import MultiSelectComponent from "../../util/forms/multiselect-dropdown/multi-dropdown";
import idFromUrl from "../../util/helpers/id-from-url";
import ContentForm from "./content-form";
import MultiselectFromEndpoint from "./multiselect-from-endpoint";
import PosterSelector from "./poster-selector";

/**
 * Feed selector.
 *
 * @param {object} props - The props.
 * @param {object} props.value - The feed value.
 * @param {Function} props.onChange - On change callback.
 * @param {object} props.formElement - The form element data.
 * @returns {object} - The FeedSelector component.
 */
function FeedSelector({
  onChange,
  value = {
    feedSource: "",
  },
  formElement = {},
}) {
  const dispatch = useDispatch();
  const { t } = useTranslation("common");
  const [feedSourceOptions, setFeedSourceOptions] = useState([]);
  const [feedSourceData, setFeedSourceData] = useState();

  const {
    data: feedSourcesData,
    error: feedSourcesLoadingError,
    isLoading: feedSourcesLoading,
  } = useGetV2FeedSourcesQuery({
    page: 1,
    supportedFeedOutputType: formElement.supportedFeedOutputType,
  });

  useEffect(() => {
    if (!value.feedSource && feedSourceOptions?.length === 1) {
      // If there's only one feed source option select it.
      const feedSource = feedSourceOptions[0]["@id"];
      const configuration = value?.configuration ?? {};
      const newValue = { ...value, feedSource, configuration };
      onChange(newValue);
    }
  }, [feedSourceOptions]);

  useEffect(() => {
    if (feedSourcesData) {
      setFeedSourceOptions(
        feedSourcesData["hydra:member"].map((source) => {
          return {
            title: source.title,
            value: source["@id"],
            key: source["@id"],
            id: source["@id"],
          };
        })
      );
    }
  }, [feedSourcesData]);

  const getSelected = (v) => {
    return feedSourceOptions.filter((option) => option.value === v);
  };

  useEffect(() => {
    if (value?.feedSource) {
      dispatch(
        api.endpoints.getV2FeedSourcesById.initiate({
          id: idFromUrl(value.feedSource),
        })
      )
        .then((response) => {
          setFeedSourceData(response.data);
        })
        .catch(() => {
          // @TODO: handle error
        });
    }
  }, [value?.feedSource]);

  const feedSourceChange = ({ target }) => {
    const feedSource = target.value[0].value ?? null;
    const configuration = value?.configuration ?? {};
    const newValue = { ...value, feedSource, configuration };
    onChange(newValue);
  };

  const configurationChange = ({ target }) => {
    const configuration = { ...value.configuration };
    set(configuration, target.id, target.value);
    const newValue = { ...value, configuration };
    onChange(newValue);
  };

  const getValueFromConfiguration = (name) => {
    if (
      value?.configuration &&
      Object.prototype.hasOwnProperty.call(value.configuration, name)
    ) {
      return value.configuration[name];
    }
    return null;
  };

  const getFormElement = (element) => {
    if (element?.input === "multiselect-from-endpoint") {
      return (
        <MultiselectFromEndpoint
          key={element.key}
          name={element.name}
          onChange={(target) => configurationChange(target)}
          value={getValueFromConfiguration(element.name)}
          label={element.label}
          optionsEndpoint={element.endpoint}
          disableSearch={element.disableSearch ?? false}
          singleSelect={element.singleSelect ?? false}
          helpText={element.helpText ?? null}
        />
      );
    }
    if (element?.input === "poster-selector") {
      return (
        <PosterSelector
          key={element.key}
          feedSource={feedSourceData}
          configurationChange={configurationChange}
          getValueFromConfiguration={getValueFromConfiguration}
        />
      );
    }

    return (
      <ContentForm
        key={element.key}
        data={element}
        onChange={configurationChange}
        name={element.name}
        formStateObject={value?.configuration ?? {}}
        onFileChange={() => {}}
      />
    );
  };

  return (
    <>
      {feedSourcesLoadingError && <div>Error</div>}
      {feedSourcesLoading && <Spinner animation="border" />}

      {feedSourcesData && feedSourceOptions?.length > 0 && (
        <MultiSelectComponent
          options={feedSourceOptions}
          selected={getSelected(value?.feedSource)}
          name="feedSource"
          labelledBy="Select"
          singleSelect
          overrideStrings={{
            allItemsAreSelected: t("feed-selector.all-selected"),
            clearSelected: t("feed-selector.clear-selection"),
            selectAll: t("feed-selector.selected-all"),
            selectSomeItems: t("feed-selector.select-some-options"),
          }}
          handleSelection={feedSourceChange}
          filterCallback={() => {}}
          label={t("feed-selector.select-feed-source")}
        />
      )}

      {feedSourceData?.admin &&
        feedSourceData.admin.map((element) => getFormElement(element))}
    </>
  );
}

FeedSelector.propTypes = {
  value: PropTypes.shape({
    feedSource: PropTypes.string,
    configuration: PropTypes.shape({}),
  }),
  onChange: PropTypes.func.isRequired,
  formElement: PropTypes.shape({
    singleSelect: PropTypes.bool,
    supportedFeedOutputType: PropTypes.string,
  }),
};

export default FeedSelector;
