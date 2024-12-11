import { React } from "react";
import { Button, FormLabel, Row, Col } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import Form from "react-bootstrap/Form";
import LoadingComponent from "../util/loading-component/loading-component";
import FormInputArea from "../util/forms/form-input-area";
import ContentBody from "../util/content-body/content-body";
import FormInput from "../util/forms/form-input";
import ImageUploader from "../util/image-uploader/image-uploader";
import StickyFooter from "../util/sticky-footer";

/**
 * The theme form component.
 *
 * @param {object} props - The props.
 * @param {object} props.theme The theme object to modify in the form.
 * @param {Function} props.handleInput Handles form input.
 * @param {Function} props.handleSubmit Handles form submit.
 * @param {Function} props.handleSaveNoClose Handles form submit without close.
 * @param {string} props.headerText Headline text.
 * @param {boolean} props.isLoading Indicator of whether the form is loading
 * @param {string} props.loadingMessage The loading message for the spinner
 * @returns {object} The theme form.
 */
function ThemeForm({
  handleInput,
  handleSubmit,
  handleSaveNoClose,
  headerText,
  isLoading = false,
  loadingMessage = "",
  theme = null,
}) {
  const { t } = useTranslation("common", { keyPrefix: "theme-form" });
  const navigate = useNavigate();

  return (
    <div>
      <LoadingComponent isLoading={isLoading} loadingMessage={loadingMessage} />
      <Form>
        <Row className="m-2">
          <h1 id="themeTitle">{headerText}</h1>
          <Col>
            <ContentBody>
              <FormInput
                name="title"
                type="text"
                label={t("theme-name-label")}
                value={theme.title}
                onChange={handleInput}
              />
              <FormInputArea
                name="description"
                type="text"
                label={t("theme-description-label")}
                value={theme.description}
                onChange={handleInput}
              />
            </ContentBody>
            <ContentBody>
              <h2 className="h4">{t("css-header")}</h2>
              <FormInputArea
                name="cssStyles"
                type="text"
                label={t("theme-css-label")}
                value={theme.cssStyles}
                onChange={handleInput}
              />
              <FormLabel htmlFor="logo" className="mt-5">
                {t("logo-title")}
              </FormLabel>
              <ImageUploader
                multipleImages={false}
                handleImageUpload={handleInput}
                inputImage={theme.logo ?? null}
                name="logo"
                showLibraryButton
              />
            </ContentBody>
          </Col>
        </Row>

        <StickyFooter>
          <Button
            variant="secondary"
            type="button"
            id="cancel_theme"
            onClick={() => navigate("/themes/list")}
            className="margin-right-button"
          >
            {t("cancel-button")}
          </Button>
          <Button
            variant="outline-primary"
            type="button"
            id="save_without_close"
            onClick={handleSaveNoClose}
            className="margin-right-button"
          >
            {t("save-without-close-button")}
          </Button>
          <Button
            variant="primary"
            type="button"
            onClick={handleSubmit}
            id="save_theme"
          >
            {t("save-button")}
          </Button>
        </StickyFooter>
      </Form>
    </div>
  );
}

ThemeForm.propTypes = {
  theme: PropTypes.shape({
    cssStyles: PropTypes.string,
    logo: PropTypes.shape({}),
    description: PropTypes.string,
    title: PropTypes.string,
  }),
  handleInput: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleSaveNoClose: PropTypes.func.isRequired,
  headerText: PropTypes.string.isRequired,
  isLoading: PropTypes.bool,
  loadingMessage: PropTypes.string,
};

export default ThemeForm;
