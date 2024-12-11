import { React, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { usePostV2ScreenGroupsMutation } from "../../redux/api/api.generated.ts";
import GroupForm from "./group-form";
import {
  displaySuccess,
  displayError,
} from "../util/list/toast-component/display-toast";

/**
 * The group edit component.
 *
 * @returns {object} The group edit page.
 */
function GroupCreate() {
  const { t } = useTranslation("common", { keyPrefix: "group-create" });
  const navigate = useNavigate();
  const headerText = t("create-new-group-header");
  const [formStateObject, setFormStateObject] = useState({
    title: "",
    description: "",
    createdBy: "",
    modifiedBy: "",
  });

  const [
    PostV2ScreenGroups,
    { error: saveError, isLoading: isSaving, isSuccess: isSaveSuccess },
  ] = usePostV2ScreenGroupsMutation();

  /** Handle submitting is done. */
  useEffect(() => {
    if (isSaveSuccess) {
      displaySuccess(t("success-messages.saved-group"));
      navigate("/group/list");
    }
  }, [isSaveSuccess]);

  /** If the group is saved with error, display the error message */
  useEffect(() => {
    if (saveError) {
      displayError(t("error-messages.save-group-error"), saveError);
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
    const saveData = {
      title: formStateObject.title,
      description: formStateObject.description,
      modifiedBy: formStateObject.modifiedBy,
      createdBy: formStateObject.createdBy,
    };

    PostV2ScreenGroups({
      screenGroupScreenGroupInput: JSON.stringify(saveData),
    });
  };

  return (
    <div className="p-3">
      <GroupForm
        group={formStateObject}
        headerText={headerText}
        handleInput={handleInput}
        handleSubmit={handleSubmit}
        isLoading={isSaving}
        loadingMessage={t("loading-messages.saving-group")}
      />
    </div>
  );
}

export default GroupCreate;
