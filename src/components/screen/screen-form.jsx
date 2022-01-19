import { React, useEffect, useState } from "react";
import { Button, Form, Col, Row, Spinner } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";
import ContentBody from "../util/content-body/content-body";
import ContentFooter from "../util/content-footer/content-footer";
import FormInput from "../util/forms/form-input";
import FormInputArea from "../util/forms/form-input-area";
import SelectGroupsTable from "../util/multi-and-table/select-groups-table";
import GridGenerationAndSelect from "./grid-generation-and-select";
import MultiSelectComponent from "../util/forms/multiselect-dropdown/multi-dropdown";
import idFromUrl from "../util/helpers/id-from-url";
import { useGetV1LayoutsQuery } from "../../redux/api/api.generated";
import "./screen-form.scss";

/**
 * The screen form component.
 *
 * @param {object} props The props.
 * @param {object} props.screen Screen The screen object to modify in the form.
 * @param {Function} props.handleInput HandleInput Handles form input.
 * @param {Function} props.handleSubmit HandleSubmit Handles form submit.
 * @param {string} props.headerText HeaderText Headline text.
 * @param {string} props.groupId The group id.
 * @param {boolean} props.isLoading Indicator of whether the form is loading
 * @param {string} props.loadingMessage The loading message for the spinner
 * @returns {object} The screen form.
 */
function ScreenForm({
  screen,
  handleInput,
  handleSubmit,
  headerText,
  groupId,
  isLoading,
  loadingMessage,
}) {
  const { t } = useTranslation("common");
  const history = useHistory();
  const [selectedLayout, setSelectedLayout] = useState();
  const [layoutOptions, setLayoutOptions] = useState();
  const { data: layouts } = useGetV1LayoutsQuery({
    page: 1,
    itemsPerPage: 20,
  });

  useEffect(() => {
    if (layouts) {
      setLayoutOptions(layouts["hydra:member"]);
    }
  }, [layouts]);

  useEffect(() => {
    if (layoutOptions) {
      const localSelectedLayout = layoutOptions.find(
        (layout) => layout["@id"] === screen.layout
      );
      if (localSelectedLayout) {
        setSelectedLayout(localSelectedLayout);
      }
    }
  }, [screen.layout, layoutOptions]);

  /**
   * Adds group to list of groups.
   *
   * @param {object} props - The props.
   * @param {object} props.target - The target.
   */
  function handleAdd({ target }) {
    const { value, id } = target;
    setSelectedLayout(value);
    handleInput({
      target: { id, value: value.map((item) => item["@id"]).shift() },
    });
  }

  return (
    <>
      {isLoading && (
        <div className="spinner-overlay">
          <Spinner animation="border" className="loading-spinner" />
          {loadingMessage && <h2>{loadingMessage}</h2>}
        </div>
      )}
      <Form>
        <h1 id="screenTitle">{headerText}</h1>
        <ContentBody>
          <h2 className="h4">{t("screen-form.screen-about")}</h2>
          <FormInput
            name="title"
            type="text"
            label={t("screen-form.screen-name-label")}
            invalidText={t("screen-form.screen-name-validation")}
            helpText={t("screen-form.screen-name-placeholder")}
            value={screen.title}
            onChange={handleInput}
          />
          <FormInputArea
            name="description"
            type="text"
            label={t("screen-form.screen-description-label")}
            helpText={t("screen-form.screen-description-placeholder")}
            value={screen.description}
            onChange={handleInput}
          />
        </ContentBody>
        <ContentBody>
          <h2 className="h4">{t("screen-form.screen-groups")}</h2>
          <SelectGroupsTable
            handleChange={handleInput}
            name="inScreenGroups"
            groupId={groupId}
          />
        </ContentBody>
        <ContentBody>
          <h2 className="h4">{t("screen-form.screen-location")}</h2>
          <FormInput
            name="location"
            type="text"
            required
            label={t("screen-form.screen-location-label")}
            helpText={t("screen-form.screen-location-placeholder")}
            value={screen.location}
            onChange={handleInput}
          />
        </ContentBody>
        <ContentBody>
          <h2 className="h4">{t("screen-form.screen-settings")}</h2>
          <FormInput
            name="size"
            type="text"
            label={t("screen-form.screen-size-of-screen-label")}
            helpText={t("screen-form.screen-size-of-screen-placeholder")}
            value={screen.size}
            onChange={handleInput}
          />
          <Row className="g-2">
            <Col md>
              <FormInput
                name="dimensions.height"
                type="number"
                label={t("screen-form.screen-resolution-height")}
                placeholder={t(
                  "screen-form.screen-resolution-of-screen-height-placeholder"
                )}
                value={screen.dimensions.height}
                onChange={handleInput}
              />
            </Col>
            <FontAwesomeIcon className="resolution-plus-icon" icon={faTimes} />
            <Col md>
              <FormInput
                name="dimensions.width"
                type="number"
                label={t("screen-form.screen-resolution-width")}
                placeholder={t(
                  "screen-form.screen-resolution-of-screen-width-placeholder"
                )}
                value={screen.dimensions.width}
                onChange={handleInput}
              />
            </Col>
          </Row>
        </ContentBody>
        <ContentBody id="layout-section">
          <h2 className="h4">{t("screen-form.screen-layout")}</h2>
          <div className="row">
            {layoutOptions && (
              <div className="col-md-8">
                <MultiSelectComponent
                  label={t("screen-form.screen-layout-label")}
                  noSelectedString={t("screen-form.nothing-selected")}
                  handleSelection={handleAdd}
                  options={layoutOptions}
                  helpText={t("screen-form.search-to-se-possible-selections")}
                  selected={selectedLayout ? [selectedLayout] : []}
                  name="layout"
                  singleSelect
                />
              </div>
            )}
            {selectedLayout?.grid && (
              <GridGenerationAndSelect
                screenId={idFromUrl(screen["@id"])}
                grid={selectedLayout?.grid}
                vertical={screen.dimensions.height > screen.dimensions.width}
                regions={selectedLayout.regions}
                handleInput={handleInput}
                selectedData={screen.layout}
              />
            )}
          </div>
        </ContentBody>
        <ContentFooter>
          <Button
            variant="secondary"
            type="button"
            id="cancel_screen"
            onClick={() => history.push("/screen/list/")}
            size="lg"
            className="me-3"
          >
            {t("screen-form.cancel-button")}
          </Button>
          <Button
            variant="primary"
            type="button"
            id="save_screen"
            size="lg"
            onClick={handleSubmit}
          >
            {t("screen-form.save-button")}
          </Button>
        </ContentFooter>
      </Form>
    </>
  );
}

ScreenForm.defaultProps = {
  groupId: "",
  isLoading: false,
  loadingMessage: "",
};

ScreenForm.propTypes = {
  screen: PropTypes.objectOf(PropTypes.any).isRequired,
  handleInput: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  headerText: PropTypes.string.isRequired,
  groupId: PropTypes.string,
  isLoading: PropTypes.bool,
  loadingMessage: PropTypes.string,
};

export default ScreenForm;
