import { React, useContext, useState } from "react";
import { Alert, Button, Col, Form, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExpand } from "@fortawesome/free-solid-svg-icons";
import ContentBody from "../util/content-body/content-body";
import FormInput from "../util/forms/form-input";
import FormInputArea from "../util/forms/form-input-area";
import SelectSlidesTable from "../util/multi-and-table/select-slides-table";
import LoadingComponent from "../util/loading-component/loading-component";
import Preview from "../preview/preview";
import idFromUrl from "../util/helpers/id-from-url";
import StickyFooter from "../util/sticky-footer";
import localStorageKeys from "../util/local-storage-keys";
import Select from "../util/forms/select";
import userContext from "../../context/user-context";

/**
 * The shared form component.
 *
 * @param {object} props - The props.
 * @param {object} props.playlist The playlist object to modify in the form.
 * @param {Function} props.handleInput Handles form input.
 * @param {Function} props.handleSubmit Handles form submit.
 * @param {string} props.headerText Headline text.
 * @param {string} props.slideId - The id of the slide.
 * @param {boolean} props.isLoading Indicator of whether the form is loading
 * @param {string} props.loadingMessage The loading message for the spinner
 * @param {boolean} props.isCampaign If it is a campaign form.
 * @param {string} props.location Either playlist or campaign.
 * @param {Array} props.children The children being passed from parent
 * @param {Function} props.handleSaveNoClose Handles form submit with close.
 * @returns {object} The form shared by campaigns and playlists.
 */
function PlaylistCampaignForm({
  handleInput,
  handleSubmit,
  handleSaveNoClose,
  headerText,
  location,
  children,
  slideId = "",
  isLoading = false,
  loadingMessage = "",
  isCampaign = false,
  playlist = null,
}) {
  const { t } = useTranslation("common", {
    keyPrefix: "playlist-campaign-form",
  });
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
  const navigate = useNavigate();
  const [publishedFromError, setPublishedFromError] = useState(false);
  const [publishedToError, setPublishedToError] = useState(false);
  const [displayPreview, setDisplayPreview] = useState(null);
  const [previewOverlayVisible, setPreviewOverlayVisible] = useState(false);

  /**
   * Check if published is set
   *
   * @param {boolean | null} noRedirect - Save without redirect.
   */
  const checkInputsHandleSubmit = (noRedirect) => {
    setPublishedToError(false);
    setPublishedFromError(false);
    let submit = true;
    if (isCampaign && !playlist.published.to) {
      setPublishedToError(true);
      submit = false;
    }
    if (isCampaign && !playlist.published.from) {
      setPublishedFromError(true);
      submit = false;
    }

    if (submit) {
      if (noRedirect === true) {
        handleSaveNoClose();
      } else {
        handleSubmit();
      }
    }
  };

  /** Toggle display preview. */
  const toggleDisplayPreview = () => {
    const newValue = !displayPreview;
    localStorage.setItem(localStorageKeys.PREVIEW, newValue);
    setDisplayPreview(newValue);
  };

  return (
    <>
      <LoadingComponent isLoading={isLoading} loadingMessage={loadingMessage} />
      <Form>
        <Row className="m-2">
          <h1 id="playlistTitle">{headerText}</h1>
          <Col>
            <ContentBody>
              <h2 className="h4">{t("title-about")}</h2>
              <FormInput
                name="title"
                type="text"
                label={t("playlist-name-label")}
                placeholder={t("playlist-name-placeholder")}
                value={playlist.title}
                onChange={handleInput}
              />
              <FormInputArea
                name="description"
                type="text"
                label={t("playlist-description-label")}
                placeholder={t("playlist-description-placeholder")}
                value={playlist.description}
                onChange={handleInput}
              />
            </ContentBody>
            <ContentBody id="slides-section">
              <h2 className="h4">{t("title-slides")}</h2>
              <SelectSlidesTable
                handleChange={handleInput}
                name="slides"
                slideId={slideId}
              />
            </ContentBody>
            {/* Playlist or campaign form */}
            {children}
            <ContentBody>
              <h3 className="h4">{t("publish-title")}</h3>
              <Row className="g-2">
                <Col md>
                  <FormInput
                    required={isCampaign}
                    name="published.from"
                    type="datetime-local"
                    label={t("publish-from-label")}
                    value={playlist.published?.from ?? ""}
                    error={publishedFromError}
                    onChange={handleInput}
                  />
                </Col>
                <Col md>
                  <FormInput
                    required={isCampaign}
                    name="published.to"
                    type="datetime-local"
                    error={publishedToError}
                    label={t("publish-to-label")}
                    value={playlist.published?.to ?? ""}
                    onChange={handleInput}
                  />
                </Col>
              </Row>
              <Row>
                <small>{t("publish-helptext")}</small>
              </Row>
            </ContentBody>
          </Col>

          {displayPreview && (
            <Col
              className="responsive-side shadow-sm p-3 mb-3 bg-body rounded me-3 sticky-top"
              style={{ top: "20px", maxWidth: "520px" }}
            >
              <h2 className="h4">{t("playlist-preview")}</h2>
              <div>
                <Alert
                  key="playlist-preview-about"
                  variant="info"
                  className="mt-3"
                >
                  {t("playlist-preview-small-about")}
                </Alert>
                <div className="preview-actions mb-3">
                  <Select
                    isRequired
                    allowNull={false}
                    onChange={({ target }) =>
                      setPreviewOrientation(target.value)
                    }
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
                <Preview
                  id={idFromUrl(playlist["@id"])}
                  mode="playlist"
                  height={previewOrientation === "horizontal" ? 270 : 480}
                  width={previewOrientation === "horizontal" ? 480 : 270}
                  simulatedHeight={
                    previewOrientation === "horizontal" ? 1080 : 1920
                  }
                  simulatedWidth={
                    previewOrientation === "horizontal" ? 1920 : 1080
                  }
                />
              </div>
              {previewOverlayVisible && (
                <div
                  onClick={() =>
                    setPreviewOverlayVisible(!previewOverlayVisible)
                  }
                  role="presentation"
                  className="preview-overlay d-flex justify-content-center align-items-center flex-column"
                >
                  <Preview
                    id={idFromUrl(playlist["@id"])}
                    mode="playlist"
                    height={previewOrientation === "horizontal" ? 540 : 960}
                    width={previewOrientation === "horizontal" ? 960 : 540}
                    simulatedHeight={
                      previewOrientation === "horizontal" ? 1080 : 1920
                    }
                    simulatedWidth={
                      previewOrientation === "horizontal" ? 1920 : 1080
                    }
                  />
                  <Alert
                    key="playlist-preview-about"
                    variant="info"
                    className="mt-3"
                  >
                    {t("playlist-preview-about")}
                  </Alert>
                </div>
              )}
            </Col>
          )}
        </Row>
        <StickyFooter>
          <Button
            variant="secondary"
            type="button"
            id="cancel_playlist"
            onClick={() => navigate(`/${location}/list`)}
            className="margin-right-button"
          >
            {t("cancel-button")}
          </Button>
          <Button
            variant="outline-primary"
            type="button"
            onClick={() => checkInputsHandleSubmit(true)}
            id="save_playlist"
            className="margin-right-button"
          >
            {t("save-button")}
          </Button>
          <Button
            variant="primary"
            type="button"
            onClick={checkInputsHandleSubmit}
            id="save_slide_and_close"
            className="margin-right-button"
          >
            {t("save-button-and-close")}
          </Button>
          {config?.previewClient && (
            <Button
              variant="success"
              type="button"
              onClick={toggleDisplayPreview}
              id="toggle_display_preview"
              className="margin-right-button"
            >
              {displayPreview ? t("hide-preview") : t("show-preview")}
            </Button>
          )}
        </StickyFooter>
      </Form>
    </>
  );
}

PlaylistCampaignForm.propTypes = {
  playlist: PropTypes.shape({
    description: PropTypes.string,
    "@id": PropTypes.string.isRequired,
    published: PropTypes.shape({
      from: PropTypes.string,
      to: PropTypes.string,
    }),
    title: PropTypes.string,
  }),
  handleInput: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleSaveNoClose: PropTypes.func.isRequired,
  headerText: PropTypes.string.isRequired,
  slideId: PropTypes.string,
  isLoading: PropTypes.bool,
  loadingMessage: PropTypes.string,
  isCampaign: PropTypes.bool,
  location: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default PlaylistCampaignForm;
