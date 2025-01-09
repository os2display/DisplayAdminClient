import { React, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { Alert } from "react-bootstrap";
import MultiselectFromEndpoint from "../../slide/content/multiselect-from-endpoint";
import ConfigLoader from "../../../config-loader";
import FormInput from "../../util/forms/form-input";

const ColiboFeedType = ({
  feedSourceId,
  handleInput,
  formStateObject,
  mode,
}) => {
  const { t } = useTranslation("common", {
    keyPrefix: "colibo-feed-type",
  });

  const [optionsEndpoint, setOptionsEndpoint] = useState(null);

  useEffect(() => {
    if (feedSourceId && feedSourceId !== "") {
      ConfigLoader.loadConfig().then((config) => {
        let endpoint = config.api;
        endpoint = endpoint.replace(/\/$/, "");
        endpoint += feedSourceId;
        endpoint += "/config/recipients";

        setOptionsEndpoint(endpoint);
      });
    }
  }, [feedSourceId]);

  return (
    <>
      {!feedSourceId && (
        <Alert className="mt-4" variant="warning">
          {t("save-before-recipients-can-be-set")}
        </Alert>
      )}

      <FormInput
        name="api_base_uri"
        type="text"
        label={t("api-base-uri")}
        className="mb-2"
        onChange={handleInput}
        placeholder={
          mode === "PUT" ? t("redacted-value-input-placeholder") : ""
        }
        value={formStateObject?.api_base_uri}
      />

      <FormInput
        name="client_id"
        type="text"
        className="mb-2"
        label={t("client-id")}
        onChange={handleInput}
        placeholder={
          mode === "PUT" ? t("redacted-value-input-placeholder") : ""
        }
        value={formStateObject?.client_id}
      />

      <FormInput
        name="client_secret"
        type="text"
        label={t("client-secret")}
        onChange={handleInput}
        placeholder={
          mode === "PUT" ? t("redacted-value-input-placeholder") : ""
        }
        value={formStateObject?.client_secret}
      />

      <Alert className="mt-4" variant="info">
        {t("values-info")}
      </Alert>

      {optionsEndpoint && (
        <MultiselectFromEndpoint
          onChange={handleInput}
          name="allowed_recipients"
          disableSearch={false}
          label={t("allowed-recipients")}
          value={formStateObject.allowed_recipients ?? []}
          optionsEndpoint={optionsEndpoint}
          helpText={t("allowed-recipients-help")}
        />
      )}
    </>
  );
};

ColiboFeedType.propTypes = {
  handleInput: PropTypes.func,
  formStateObject: PropTypes.shape({
    api_base_uri: PropTypes.string,
    client_id: PropTypes.string,
    client_secret: PropTypes.string,
    allowed_recipients: PropTypes.arrayOf(PropTypes.string),
  }),
  feedSourceId: PropTypes.string,
  mode: PropTypes.string,
};

export default ColiboFeedType;
