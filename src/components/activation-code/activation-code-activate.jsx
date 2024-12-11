import { React, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import { Button } from "react-bootstrap";
import { usePostV2UserActivationCodesActivateMutation } from "../../redux/api/api.generated.ts";
import {
  displaySuccess,
  displayError,
} from "../util/list/toast-component/display-toast";
import LoadingComponent from "../util/loading-component/loading-component";
import ContentBody from "../util/content-body/content-body";
import FormInput from "../util/forms/form-input";
import ContentFooter from "../util/content-footer/content-footer";

/**
 * The activation code activate page.
 *
 * @returns {object} The activation code activate page.
 */
function ActivationCodeActivate() {
  const { t } = useTranslation("common", {
    keyPrefix: "activation-code-create",
  });
  const navigate = useNavigate();
  const [formStateObject, setFormStateObject] = useState({
    activationCode: "",
  });

  const [
    PostV2UserActivationCodeActivate,
    { error: saveError, isLoading: isSaving, isSuccess: isSaveSuccess },
  ] = usePostV2UserActivationCodesActivateMutation();

  /** Handle submitting is done. */
  useEffect(() => {
    if (isSaveSuccess) {
      displaySuccess(t("success-messages.saved-activation-code"));
      navigate("/activation/list");
    }
  }, [isSaveSuccess]);

  /** If the user is saved with error, display the error message */
  useEffect(() => {
    if (saveError) {
      displayError(t("error-messages.save-activation-code-error"), saveError);
    }
  }, [saveError]);

  /**
   * Set state on change in input field
   *
   * @param {object} props The props.
   * @param {object} props.target Event target.
   */
  const handleInput = ({ target }) => {
    const localFormStateObject = { ...formStateObject };
    localFormStateObject[target.id] = target.value;
    setFormStateObject(localFormStateObject);
  };

  /** Handles submit. */
  const handleSubmit = () => {
    PostV2UserActivationCodeActivate({
      userActivationCodeActivationCode: JSON.stringify(formStateObject),
    });
  };

  return (
    <div className="p-3">
      <LoadingComponent
        isLoading={isSaving}
        loadingMessage={t("loading-messages.saving-activation-code")}
      />
      <Form>
        <h1 id="h1ActivationCode">{t("header")}</h1>
        <ContentBody>
          <FormInput
            title="activation-code"
            type="text"
            label={t("activation-code-label")}
            placeholder={t("activation-code-placeholder")}
            value={formStateObject.activationCode}
            onChange={handleInput}
            name="activationCode"
            required
          />
        </ContentBody>
        <ContentFooter>
          <Button
            variant="primary"
            type="button"
            onClick={handleSubmit}
            id="submit_activate"
            size="lg"
            className="col"
          >
            {t("save-button")}
          </Button>
        </ContentFooter>
      </Form>
    </div>
  );
}

export default ActivationCodeActivate;
