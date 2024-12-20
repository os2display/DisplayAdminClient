import { React, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import MultiSelectComponent from "../../util/forms/multiselect-dropdown/multi-dropdown";
import localStorageKeys from "../../util/local-storage-keys";
import { displayError } from "../../util/list/toast-component/display-toast";

/**
 * Multiselect with options supplied by endpoint.
 *
 * @param {object} props - The props.
 * @param {string} props.name - The name of the field.
 * @param {string | null} props.label - The label for the field.
 * @param {object} props.value - The value.
 * @param {Function} props.onChange - On change callback.
 * @param {string} props.optionsEndpoint - Endpoint from which to fetch the options.
 * @param {boolean} props.singleSelect - Allow only to select one option.
 * @param {boolean} props.disableSearch - Disable search. Defaults to true.
 * @param {string | null} props.helpText - Help text.
 * @returns {object} - The FeedSelector component.
 */
function MultiselectFromEndpoint({
  name,
  onChange,
  optionsEndpoint,
  label = null,
  value = [],
  disableSearch = true,
  singleSelect = false,
  helpText = null,
}) {
  const { t } = useTranslation("common");
  const [options, setOptions] = useState(null);

  useEffect(() => {
    if (optionsEndpoint) {
      const apiToken = localStorage.getItem(localStorageKeys.API_TOKEN);

      const headers = {
        authorization: `Bearer ${apiToken ?? ""}`,
      };

      // Attach tenant key .
      const tenantKey = JSON.parse(
        localStorage.getItem(localStorageKeys.SELECTED_TENANT)
      );

      if (tenantKey) {
        headers["Authorization-Tenant-Key"] = tenantKey.tenantKey;
      }

      fetch(optionsEndpoint, {
        headers,
      })
        .then((response) => response.json())
        .then((data) => {
          setOptions(
            data.map((element) => {
              return {
                "@id": element.value,
                value: element.value,
                key: element.value,
                title: element.title,
              };
            })
          );
        })
        .catch(() =>
          displayError(t("multiselect-from-endpoint.error-fetching"))
        );
    }
  }, [optionsEndpoint]);

  const getSelected = (selected) => {
    if (selected instanceof Array) {
      return options.filter((option) => selected.includes(option.value));
    }
    return [];
  };

  return (
    <>
      {options && (
        <MultiSelectComponent
          options={options}
          selected={getSelected(value)}
          name={name}
          disableSearch={disableSearch}
          singleSelect={singleSelect}
          labelledBy="Select"
          overrideStrings={{
            allItemsAreSelected: t("multiselect.all-selected"),
            clearSelected: t("multiselect.clear-selection"),
            selectAll: t("multiselect.selected-all"),
            selectSomeItems: t("multiselect.select-some-options"),
          }}
          handleSelection={({ target }) => {
            const newSelections = target.value.map((element) => element.value);
            onChange({ target: { id: target.id, value: newSelections } });
          }}
          filterCallback={() => {}}
          label={label ?? t("multiselect.select")}
          helpText={helpText}
        />
      )}
    </>
  );
}

MultiselectFromEndpoint.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  value: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func.isRequired,
  optionsEndpoint: PropTypes.string.isRequired,
  singleSelect: PropTypes.bool,
  disableSearch: PropTypes.bool,
  helpText: PropTypes.string,
};

export default MultiselectFromEndpoint;
