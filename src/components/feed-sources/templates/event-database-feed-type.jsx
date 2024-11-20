import { React } from "react";
import PropTypes from "prop-types";
import FormInput from "../../util/forms/form-input";
import { useTranslation } from "react-i18next";

const EventDatabaseApiTemplate = ({
  handleInput,
  formStateObject,
  mode,
}) => {
  const { t } = useTranslation("common", { keyPrefix: "feed-source-manager.dynamic-fields.event-database-api-feed-type" });
  return (
    <>
      <FormInput
        name="host"
        type="text"
        label={t("host")}
        onChange={handleInput}
        placeholder={
          mode === "PUT"
            ? t("redacted-value-input-placeholder")
            : ""
        }
        value={formStateObject?.host}
      />
    </>
  );
};

EventDatabaseApiTemplate.propTypes = {
  handleInput: PropTypes.func,
  formStateObject: PropTypes.shape({
    secrets: PropTypes.shape({
      host: PropTypes.string,
    }),
  }),
  mode: PropTypes.string,
};

export default EventDatabaseApiTemplate;
