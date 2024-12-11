import { React } from "react";
import { Button, Row, Col } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import Form from "react-bootstrap/Form";
import LoadingComponent from "../util/loading-component/loading-component";
import FormInputArea from "../util/forms/form-input-area";
import FormSelect from "../util/forms/select";
import ContentBody from "../util/content-body/content-body";
import FormInput from "../util/forms/form-input";
import CalendarApiFeedType from "./templates/calendar-api-feed-type";
import NotifiedFeedType from "./templates/notified-feed-type";
import EventDatabaseApiFeedType from "./templates/event-database-feed-type";
import StickyFooter from "../util/sticky-footer";

/**
 * The feed-source form component.
 *
 * @param {object} props - The props.
 * @param {object} props.feedSource The feed-source object to modify in the form.
 * @param {Function} props.handleInput Handles form input.
 * @param {Function} props.handleSubmit Handles form submit.
 * @param {Function} props.handleSaveNoClose Handles form submit with close.
 * @param {string} props.headerText Headline text.
 * @param {boolean} [props.isLoading] Indicator of whether the form is loading.
 *   Default is `false`
 * @param {string} [props.loadingMessage] The loading message for the spinner.
 *   Default is `""`
 * @param {object} props.feedSourceTypeOptions The options for feed source types
 * @param {string} props.mode The mode
 * @param {Function} props.onFeedTypeChange Callback on feed type change.
 * @param {Function} props.handleSecretInput Callback on secret input change.
 * @returns {object} The feed-source form.
 */
function FeedSourceForm({
  handleInput,
  handleSubmit,
  handleSaveNoClose,
  headerText,
  isLoading = false,
  loadingMessage = "",
  feedSource = null,
  feedSourceTypeOptions = null,
  onFeedTypeChange = () => {},
  handleSecretInput = () => {},
  mode = null,
}) {
  const { t } = useTranslation("common", { keyPrefix: "feed-source-form" });
  const navigate = useNavigate();

  return (
    <>
      <Form>
        <LoadingComponent
          isLoading={isLoading}
          loadingMessage={loadingMessage}
        />
        <Row className="m-2">
          <h1 id="feed-sourceTitle">{headerText}</h1>
          <Col>
            <ContentBody>
              <FormInput
                name="title"
                formGroupClasses="mb-2"
                type="text"
                label={t("feed-source-name-label")}
                value={feedSource.title}
                onChange={handleInput}
              />
              <FormInputArea
                name="description"
                formGroupClasses="mb-2"
                type="text"
                label={t("feed-source-description-label")}
                value={feedSource.description}
                onChange={handleInput}
              />
              <FormSelect
                name="feedType"
                formGroupClasses="mb-2"
                label={t("feed-source-feed-type-label")}
                value={feedSource.feedType}
                onChange={onFeedTypeChange}
                disabled={mode === "PUT"}
                options={feedSourceTypeOptions}
              />

              {feedSource?.feedType === "App\\Feed\\CalendarApiFeedType" && (
                <CalendarApiFeedType
                  handleInput={handleSecretInput}
                  formStateObject={feedSource.secrets}
                  mode={mode}
                  feedSourceId={feedSource["@id"]}
                />
              )}
              {feedSource?.feedType ===
                "App\\Feed\\EventDatabaseApiFeedType" && (
                <EventDatabaseApiFeedType
                  handleInput={handleSecretInput}
                  formStateObject={feedSource.secrets}
                  mode={mode}
                />
              )}
              {feedSource?.feedType === "App\\Feed\\NotifiedFeedType" && (
                <NotifiedFeedType
                  handleInput={handleSecretInput}
                  formStateObject={feedSource.secrets}
                  mode={mode}
                />
              )}
            </ContentBody>
          </Col>
        </Row>
        <StickyFooter>
          <Button
            variant="secondary"
            type="button"
            id="cancel"
            onClick={() => navigate("/feed-sources/list")}
            className="margin-right-button"
          >
            {t("cancel-button")}
          </Button>
          <Button
            variant="outline-primary"
            type="button"
            id="save-without-close"
            onClick={handleSaveNoClose}
            className="margin-right-button"
          >
            {t("save-without-close-button")}
          </Button>
          <Button
            variant="primary"
            type="button"
            onClick={handleSubmit}
            id="save"
          >
            {t("save-button")}
          </Button>
        </StickyFooter>
      </Form>
    </>
  );
}

FeedSourceForm.propTypes = {
  feedSource: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    feedType: PropTypes.string,
    supportedFeedOutputType: PropTypes.string,
  }),
  handleInput: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleSaveNoClose: PropTypes.func.isRequired,
  handleSecretInput: PropTypes.func.isRequired,
  onFeedTypeChange: PropTypes.func.isRequired,
  headerText: PropTypes.string.isRequired,
  isLoading: PropTypes.bool,
  loadingMessage: PropTypes.string,
  feedSourceTypeOptions: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      title: PropTypes.string,
      key: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      template: PropTypes.element,
    })
  ).isRequired,
  mode: PropTypes.string,
};

export default FeedSourceForm;
