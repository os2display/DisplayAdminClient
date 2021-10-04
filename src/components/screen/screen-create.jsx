import { React, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import set from "lodash.set";
import { usePostV1ScreensMutation } from "../../redux/api/api.generated";
import ScreenForm from "./screen-form";

/**
 * The screen create component.
 *
 * @returns {object} The screen create page.
 */
function ScreenCreate() {
  const { t } = useTranslation("common");
  const [groupsToAdd, setGroupsToAdd] = useState([]);
  const headerText = t("edit-screen.create-new-screen");
  const history = useHistory();
  const [formStateObject, setFormStateObject] = useState({
    modifiedBy: "@TODO",
    createdBy: "@TODO",
    dimensions: { height: 0, width: 0 },
  });

  const [
    PostV1Screen,
    { isLoading: isSaving, error: saveError, isSuccess: isSaveSuccess },
  ] = usePostV1ScreensMutation();

  /**
   * When the screen is saved, the group(s) will be saved.
   * When saved, it redirects to edit screen.
   */
  useEffect(() => {
    if (isSaveSuccess && data) {
      if (groupsToAdd.length > 0) {
        // remove first element for saving
        const toAdd = groupsToAdd.splice(0, 1).shift();
        const toAddId = idFromUrl(toAdd);
        // todo save screen group connection
      } else {
        history.push(`/slide/edit/${idFromUrl(data["@id"])}`);
      }
    }
  }, [isSaveSuccess]);

  /**
   * Set state on change in input field
   *
   * @param {object} props - The props.
   * @param {object} props.target - Event target.
   */
  function handleInput({ target }) {
    const localFormStateObject = { ...formStateObject };
    set(localFormStateObject, target.id, target.value);
    setFormStateObject(localFormStateObject);
  }

  /**
   * Set groups to save state
   */
  function handleSaveGroups() {
    const { inScreenGroups } = formStateObject;
    if (inScreenGroups) {
      setGroupsToAdd(inScreenGroups);
    }
  }

  /**
   * Handles submit.
   */
  function handleSubmit() {
    formStateObject.created = new Date().toISOString();
    formStateObject.modified = new Date().toISOString();
    formStateObject.dimensions.width = parseInt(
      formStateObject.dimensions.width
    );
    formStateObject.dimensions.height = parseInt(
      formStateObject.dimensions.height
    );
    const saveData = { screenScreenInput: JSON.stringify(formStateObject) };
    PostV1Screen(saveData);
    handleSaveGroups();
  }

  return (
    <ScreenForm
      screen={formStateObject}
      headerText={headerText}
      handleInput={handleInput}
      handleSubmit={handleSubmit}
      isLoading={false}
      isSaveSuccess={isSaveSuccess}
      isSaving={isSaving}
      errors={saveError || false}
    />
  );
}

export default ScreenCreate;
