import { React, useEffect, useState, Fragment, useContext } from "react";
import { Button, Row, Col, Alert } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import Form from "react-bootstrap/Form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExpand } from "@fortawesome/free-solid-svg-icons";
import ContentBody from "../util/content-body/content-body";
import MultiSelectComponent from "../util/forms/multiselect-dropdown/multi-dropdown";
import {
  useGetV2TemplatesQuery,
  useGetV2ThemesQuery,
} from "../../redux/api/api.generated.ts";
import idFromUrl from "../util/helpers/id-from-url";
import FormInput from "../util/forms/form-input";
import ContentForm from "./content/content-form";
import LoadingComponent from "../util/loading-component/loading-component";
import RemoteComponentWrapper from "./preview/remote-component-wrapper";
import FeedSelector from "./content/feed-selector";
import SelectPlaylistsTable from "../util/multi-and-table/select-playlists-table";
import localStorageKeys from "../util/local-storage-keys";
import { displayError } from "../util/list/toast-component/display-toast";
import userContext from "../../context/user-context";
import "./slide-form.scss";
import Preview from "../preview/preview";
import StickyFooter from "../util/sticky-footer";
import Select from "../util/forms/select";

/**
 * The slide form component.
 *
 * @param {object} props - The props.
 * @param {object} props.slide The slide object to modify in the form.
 * @param {Function} props.handleInput Handles form input.
 * @param {Function} props.handleSubmit Handles form submit.
 * @param {Function} props.handleSaveNoClose Handles form submit without redirecting.
 * @param {string} props.headerText Headline text.
 * @param {Function} props.handleContent Function for handling changes to content field
 * @param {Function} props.handleMedia Handle media field
 * @param {Array} props.mediaData Object of loaded media.
 * @param {Function} props.selectTemplate Function to handle select of template.
 * @param {object} props.selectedTemplate Selected template.
 * @param {Function} props.selectTheme Function to handle select of theme.
 * @param {object} props.selectedTheme Selected theme.
 * @param {boolean} props.isLoading Indicator of whether the form is loading
 * @param {string} props.loadingMessage The loading message for the spinner
 * @returns {object} The slide form.
 */
function SlideForm({
  handleInput,
  handleContent,
  handleMedia,
  handleSubmit,
  handleSaveNoClose,
  selectTemplate,
  headerText,
  selectTheme,
  selectedTemplate = null,
  selectedTheme = [],
  isLoading = false,
  loadingMessage = "",
  slide = null,
  mediaData = null,
}) {
  const { t } = useTranslation("common", { keyPrefix: "slide-form" });
  const navigate = useNavigate();
  const { config } = useContext(userContext);

  const previewOrientationOptions = [
    {
      value: "horizontal",
      title: t("preview-orientation-landscape"),
      key: "horizontal",
    },
    {
      value: "vertical",
      title: t("preview-orientation-portrait"),
      key: "vertical",
    },
  ];
  const [previewOrientation, setPreviewOrientation] = useState(
    previewOrientationOptions[0].value
  );

  const [previewOverlayVisible, setPreviewOverlayVisible] = useState(false);
  const [templateOptions, setTemplateOptions] = useState([]);
  const [contentFormElements, setContentFormElements] = useState([]);
  const [searchTextTemplate, setSearchTextTemplate] = useState("");
  const [searchTextTheme, setSearchTextTheme] = useState("");
  const [selectedTemplates, setSelectedTemplates] = useState([]);
  const [themesOptions, setThemesOptions] = useState();
  const [displayPreview, setDisplayPreview] = useState(null);
  const [templateError, setTemplateError] = useState(false);

  // Load templates.
  const { data: templates, isLoading: loadingTemplates } =
    useGetV2TemplatesQuery({
      title: searchTextTemplate,
      itemsPerPage: 300,
    });

  // Load themes.
  const { data: themes, isLoading: loadingThemes } = useGetV2ThemesQuery({
    title: searchTextTheme,
    itemsPerPage: 300,
    order: { createdAt: "desc" },
  });

  /**
   * Check if template is set
   *
   * @param {boolean | null} noRedirect Avoid close after save.
   */
  const checkInputsHandleSubmit = (noRedirect) => {
    setTemplateError(false);
    let submit = true;
    if (!selectedTemplate) {
      setTemplateError(true);
      submit = false;
      displayError(t("remember-template-error"));
    }

    if (submit) {
      if (noRedirect === true) {
        handleSaveNoClose();
      } else {
        handleSubmit();
      }
    }
  };

  /**
   * For closing overlay on escape key.
   *
   * @param {object} props - The props.
   * @param {string} props.key - The key input.
   */
  function downHandler({ key }) {
    if (key === "Escape" && previewOverlayVisible) {
      setPreviewOverlayVisible(false);
    }
  }

  // Add event listeners for keypress
  useEffect(() => {
    window.addEventListener("keydown", downHandler);

    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener("keydown", downHandler);
    };
  }, []);

  /** Load content form elements for template */
  useEffect(() => {
    const newSelectedTemplates = [];

    if (selectedTemplate) {
      // Get content form from template resources.
      const contentFormUrl = selectedTemplate?.resources?.admin;
      fetch(contentFormUrl)
        .then((response) => response.json())
        .then((data) => {
          setContentFormElements(data);
        })
        .catch((er) => {
          displayError(t("template-error"), er);
        });

      newSelectedTemplates.push(selectedTemplate);
    }
    setSelectedTemplates(newSelectedTemplates);
  }, [selectedTemplate]);

  /** Set loaded data into form state. */
  useEffect(() => {
    if (templates) {
      const localTemplateOptions = [...templates["hydra:member"]];
      setTemplateOptions(localTemplateOptions);
    }
  }, [templates]);

  /** Set loaded data into form state. */
  useEffect(() => {
    if (themes) {
      setThemesOptions(themes["hydra:member"]);
    }
  }, [themes]);

  /** Get show from local storage */
  useEffect(() => {
    const localStorageShow = localStorage.getItem(localStorageKeys.PREVIEW);
    setDisplayPreview(localStorageShow === "true");
  }, []);

  /** Toggle display preview. */
  const toggleDisplayPreview = () => {
    const newValue = !displayPreview;
    localStorage.setItem(localStorageKeys.PREVIEW, newValue);
    setDisplayPreview(newValue);
  };

  /**
   * Fetches data for the multi component
   *
   * @param {string} filter - The filter.
   */
  const onFilterTemplate = (filter) => {
    setSearchTextTemplate(filter);
  };

  /**
   * Fetches data for the multi component
   *
   * @param {string} filter - The filter.
   */
  const onFilterTheme = (filter) => {
    setSearchTextTheme(filter);
  };

  return (
    <div>
      <LoadingComponent isLoading={isLoading} loadingMessage={loadingMessage} />
      <Form>
        <Row className="m-2">
          <h1 id="slidesTitle">{headerText}</h1>
          <Col md>
            <ContentBody>
              <FormInput
                name="title"
                type="text"
                label={t("slide-name-label")}
                helpText={t("slide-name-placeholder")}
                value={slide.title || ""}
                onChange={handleInput}
              />
            </ContentBody>
            <ContentBody id="template-section">
              {/* Template can only be change on create */}
              {!Object.prototype.hasOwnProperty.call(slide, "@id") &&
                templateOptions && (
                  <MultiSelectComponent
                    isLoading={loadingTemplates}
                    label={t("slide-template-label")}
                    helpText={t("slide-template-help-text")}
                    handleSelection={selectTemplate}
                    options={templateOptions}
                    selected={selectedTemplates}
                    error={templateError}
                    name="templateInfo"
                    filterCallback={onFilterTemplate}
                    singleSelect
                  />
                )}
              {Object.prototype.hasOwnProperty.call(slide, "@id") && (
                <>
                  <FormInput
                    name="selectedTemplate"
                    type="text"
                    disabled
                    label={t("slide-template-selected")}
                    value={
                      selectedTemplates?.length > 0
                        ? selectedTemplates[0].title
                        : ""
                    }
                    onChange={() => {}}
                  />
                </>
              )}
            </ContentBody>
            {selectedTemplate && contentFormElements && (
              <>
                <ContentBody>
                  {contentFormElements.map((formElement) => (
                    <Fragment key={formElement.key}>
                      {formElement.input === "feed" && (
                        <FeedSelector
                          name={formElement.name}
                          value={slide?.feed}
                          formElement={formElement}
                          onChange={(value) => {
                            handleInput({ target: { id: "feed", value } });
                          }}
                        />
                      )}
                      {formElement.input !== "feed" && (
                        <ContentForm
                          data={formElement}
                          onChange={handleContent}
                          onFileChange={handleMedia}
                          name={formElement.name}
                          mediaData={mediaData}
                          slide={slide}
                          formStateObject={slide.content}
                          requiredFieldCallback={() => {
                            return false;
                          }}
                        />
                      )}
                    </Fragment>
                  ))}
                </ContentBody>
              </>
            )}
            <ContentBody>
              <h2 className="h4">{t("add-slide-to-playlists")}</h2>
              <SelectPlaylistsTable
                helpText={t("add-playlists-help-text")}
                handleChange={handleInput}
                name="playlists"
                id={idFromUrl(slide["@id"])}
              />
            </ContentBody>
            {config?.touchButtonRegions && (
              <ContentBody>
                <h2 className="h4">{t("touch-region")}</h2>
                <FormInput
                  name="touchRegionButtonText"
                  type="text"
                  label={t("touch-region-button-text-label")}
                  value={slide.content.touchRegionButtonText}
                  onChange={handleContent}
                />
                <small>{t("touch-region-button-text-helptext")}</small>
              </ContentBody>
            )}
            <ContentBody>
              <h3 className="h4">{t("slide-publish-title")}</h3>
              <Row className="g-2">
                <Col md>
                  <FormInput
                    name="published.from"
                    type="datetime-local"
                    label={t("slide-from-label")}
                    value={slide.published.from ?? ""}
                    onChange={handleInput}
                  />
                </Col>
                <Col md>
                  <FormInput
                    name="published.to"
                    type="datetime-local"
                    label={t("slide-to-label")}
                    value={slide.published.to ?? ""}
                    onChange={handleInput}
                  />
                </Col>
              </Row>
              <Row>
                <small>{t("publish-helptext")}</small>
              </Row>
            </ContentBody>
            {themesOptions && (
              <ContentBody id="theme-section">
                <h3 className="h4">{t("theme")}</h3>
                <MultiSelectComponent
                  isLoading={loadingThemes}
                  label={t("slide-theme-label")}
                  helpText={t("slide-theme-help-text")}
                  handleSelection={selectTheme}
                  options={themesOptions}
                  selected={selectedTheme}
                  name="theme"
                  filterCallback={onFilterTheme}
                  singleSelect
                />
              </ContentBody>
            )}
          </Col>
          {displayPreview && (
            <Col
              className="responsive-side shadow-sm p-3 mb-3 bg-body rounded me-3 sticky-top"
              style={{ top: "20px", maxWidth: "520px" }}
            >
              <h2 className="h4">{t("slide-preview")}</h2>

              <div className="preview-actions mb-3">
                <Select
                  isRequired
                  allowNull={false}
                  onChange={({ target }) => setPreviewOrientation(target.value)}
                  required
                  name="preview-orientation"
                  options={previewOrientationOptions}
                  className="m-0"
                  value={previewOrientation}
                />

                <Button
                  variant="outline-secondary"
                  type="button"
                  id="preview_slide"
                  onClick={() =>
                    setPreviewOverlayVisible(!previewOverlayVisible)
                  }
                >
                  <FontAwesomeIcon icon={faExpand} className="me-3" />
                  {t("preview-in-full-screen")}
                </Button>
              </div>

              {selectedTemplate?.resources?.component && (
                <>
                  {previewOrientation === "horizontal" && (
                    <div style={{ width: "100%" }}>
                      <RemoteComponentWrapper
                        key="live-preview-horizontal"
                        url={selectedTemplate?.resources?.component}
                        slide={slide}
                        mediaData={mediaData}
                        showPreview={displayPreview}
                        themeData={
                          selectedTheme?.length > 0 ? selectedTheme[0] : {}
                        }
                        orientation={previewOrientation}
                      />
                    </div>
                  )}
                  {previewOrientation === "vertical" && (
                    <div style={{ width: "56.25%" }}>
                      <RemoteComponentWrapper
                        key="live-preview-vertical"
                        url={selectedTemplate?.resources?.component}
                        slide={slide}
                        mediaData={mediaData}
                        showPreview={displayPreview}
                        themeData={
                          selectedTheme?.length > 0 ? selectedTheme[0] : {}
                        }
                        orientation={previewOrientation}
                      />
                    </div>
                  )}
                </>
              )}
              {previewOverlayVisible && (
                <>
                  {config?.previewClient && (
                    <div
                      onClick={() =>
                        setPreviewOverlayVisible(!previewOverlayVisible)
                      }
                      role="presentation"
                      className="preview-overlay d-flex justify-content-center align-items-center flex-column"
                    >
                      <Alert
                        key="slide-preview-about"
                        variant="info"
                        className="mt-3"
                      >
                        {t("slide-preview-about")}
                      </Alert>

                      <Preview
                        id={idFromUrl(slide["@id"])}
                        mode="slide"
                        height={previewOrientation === "horizontal" ? 540 : 960}
                        width={previewOrientation === "horizontal" ? 960 : 540}
                        simulatedHeight={
                          previewOrientation === "horizontal" ? 1080 : 1920
                        }
                        simulatedWidth={
                          previewOrientation === "horizontal" ? 1920 : 1080
                        }
                      />
                    </div>
                  )}
                  {!config?.previewClient && (
                    <div
                      onClick={() =>
                        setPreviewOverlayVisible(!previewOverlayVisible)
                      }
                      role="presentation"
                      className="preview-overlay"
                    >
                      {selectedTemplate?.resources?.component && (
                        <RemoteComponentWrapper
                          url={selectedTemplate?.resources?.component}
                          adjustFontSize={false}
                          slide={slide}
                          mediaData={mediaData}
                          themeData={
                            selectedTheme?.length > 0 ? selectedTheme[0] : 0
                          }
                          showPreview
                          closeButton
                          closeCallback={() => setPreviewOverlayVisible(false)}
                        />
                      )}
                    </div>
                  )}
                </>
              )}
            </Col>
          )}
        </Row>
        <StickyFooter>
          <Button
            variant="secondary"
            type="button"
            id="cancel_slide"
            onClick={() => navigate("/slide/list")}
            className="margin-right-button"
          >
            {t("cancel-button")}
          </Button>
          <Button
            variant="outline-primary"
            type="button"
            onClick={() => checkInputsHandleSubmit(true)}
            id="save_slide"
            className="margin-right-button"
          >
            {t("save-button")}
          </Button>
          <Button
            variant="primary"
            type="button"
            id="save_slide_an_close"
            className="margin-right-button"
            onClick={checkInputsHandleSubmit}
          >
            {t("save-button-and-close")}
          </Button>
          <Button
            variant="success"
            type="button"
            onClick={toggleDisplayPreview}
            id="toggle_display_preview"
            className="margin-right-button"
          >
            {displayPreview ? t("hide-preview") : t("show-preview")}
          </Button>
        </StickyFooter>
      </Form>
    </div>
  );
}

SlideForm.propTypes = {
  slide: PropTypes.shape({
    title: PropTypes.string,
    content: PropTypes.shape({ touchRegionButtonText: PropTypes.string }),
    feed: PropTypes.shape({
      feedSource: PropTypes.string,
      configuration: PropTypes.shape({}),
    }),
    published: PropTypes.shape({
      from: PropTypes.string,
      to: PropTypes.string,
    }),
    "@id": PropTypes.string,
  }),
  handleInput: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleSaveNoClose: PropTypes.func.isRequired,
  headerText: PropTypes.string.isRequired,
  selectTheme: PropTypes.func.isRequired,
  selectedTheme: PropTypes.arrayOf(
    PropTypes.shape({ "@id": PropTypes.string.isRequired })
  ),
  selectTemplate: PropTypes.func.isRequired,
  selectedTemplate: PropTypes.shape({
    "@id": PropTypes.string,
    resources: PropTypes.shape({
      admin: PropTypes.string.isRequired,
      component: PropTypes.string.isRequired,
    }).isRequired,
  }),
  isLoading: PropTypes.bool,
  loadingMessage: PropTypes.string,
  handleContent: PropTypes.func.isRequired,
  handleMedia: PropTypes.func.isRequired,
  mediaData: PropTypes.shape({
    "@id": PropTypes.string,
  }),
};

export default SlideForm;
