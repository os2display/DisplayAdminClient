import { React, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import ThemeForm from "./theme-form";
import {
  usePostV2ThemesMutation,
  usePutV2ThemesByIdMutation,
  usePostMediaCollectionMutation,
} from "../../redux/api/api.generated.ts";
import {
  displaySuccess,
  displayError,
} from "../util/list/toast-component/display-toast";
import idFromUrl from "../util/helpers/id-from-url";

/**
 * The theme manager component.
 *
 * @param {object} props The props.
 * @param {object} props.initialState Initial theme state.
 * @param {string} props.saveMethod POST or PUT.
 * @param {string | null} props.id Theme id.
 * @param {boolean} props.isLoading Is the theme state loading?
 * @param {object} props.loadingError Loading error.
 * @returns {object} The theme form.
 */
function ThemeManager({
  saveMethod,
  id = null,
  isLoading = false,
  loadingError = null,
  initialState = null,
}) {
  // Hooks
  const { t } = useTranslation("common", { keyPrefix: "theme-manager" });
  const navigate = useNavigate();

  // State
  const [headerText] = useState(
    saveMethod === "PUT" ? t("edit-theme") : t("create-new-theme")
  );

  const [loadingMessage, setLoadingMessage] = useState(
    t("loading-messages.loading-theme")
  );
  const [saveWithoutClose, setSaveWithoutClose] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [formStateObject, setFormStateObject] = useState({
    title: "",
    description: "",
    modifiedBy: "",
    createdBy: "",
    css: "",
  });

  const [
    postV2Themes,
    { error: saveErrorPost, isSuccess: isSaveSuccessPost, data },
  ] = usePostV2ThemesMutation();

  const [
    PutV2ThemesById,
    { error: saveErrorPut, isSuccess: isSaveSuccessPut },
  ] = usePutV2ThemesByIdMutation();

  const [
    PostV2MediaCollection,
    {
      data: savedMediaData,
      isSuccess: isSaveMediaSuccess,
      error: saveMediaError,
    },
  ] = usePostMediaCollectionMutation();

  /** Set loaded data into form state. */
  useEffect(() => {
    setFormStateObject(initialState);
  }, [initialState]);

  /**
   * Get logo for savedata
   *
   * @returns {object} The logo.
   */
  function getLogo() {
    if (savedMediaData) {
      return savedMediaData["@id"];
    }
    if (
      Array.isArray(formStateObject.logo) &&
      formStateObject.logo.length > 0
    ) {
      return formStateObject.logo[0]["@id"];
    }
    if (formStateObject.logo) {
      return formStateObject.logo["@id"];
    }
    return null;
  }

  /** Save theme. */
  function saveTheme() {
    setLoadingMessage(t("loading-messages.saving-theme"));
    const logo = getLogo();
    const saveData = {
      title: formStateObject.title,
      description: formStateObject.description,
      modifiedBy: formStateObject.modifiedBy,
      createdBy: formStateObject.createdBy,
      css: formStateObject.cssStyles,
    };
    if (logo) {
      saveData.logo = logo;
    }
    if (saveMethod === "POST") {
      postV2Themes({ themeThemeInput: JSON.stringify(saveData) });
    } else if (saveMethod === "PUT") {
      PutV2ThemesById({ themeThemeInput: JSON.stringify(saveData), id });
    }
  }

  /**
   * Set state on change in input field
   *
   * @param {object} props - The props.
   * @param {object} props.target - Event target.
   */
  const handleInput = ({ target }) => {
    const localFormStateObject = { ...formStateObject };
    localFormStateObject[target.id] = target.value;
    setFormStateObject(localFormStateObject);
  };

  /** If the theme is not loaded, display the error message */
  useEffect(() => {
    if (loadingError) {
      displayError(t("error-messages.load-theme-error", { id }), loadingError);
    }
  }, [loadingError]);

  // Media are not saved successfully, display a message
  useEffect(() => {
    if (saveMediaError) {
      setSubmitting(false);
      displayError(t("error-messages.save-media-error"), saveMediaError);
    }
  }, [saveMediaError]);

  // Media is saved successfully, display a message
  useEffect(() => {
    if (isSaveMediaSuccess && savedMediaData) {
      setSubmitting(false);
      displaySuccess(t("success-messages.saved-media"));
      saveTheme();
    }
  }, [isSaveMediaSuccess]);

  /** @param {object} media The media object to save */
  function saveMedia(media) {
    // Submit media.
    const formData = new FormData();
    formData.append("file", media.file);
    formData.append("title", media.title);
    formData.append("description", media.description);
    formData.append("license", media.license);
    // @TODO: Should these be optional in the API?
    formData.append("modifiedBy", "");
    formData.append("createdBy", "");

    PostV2MediaCollection({ body: formData });
  }

  /** When the media is saved, the theme will be saved. */
  useEffect(() => {
    if (isSaveSuccessPost || isSaveSuccessPut) {
      setSubmitting(false);
      displaySuccess(t("success-messages.saved-theme"));

      if (saveWithoutClose) {
        setSaveWithoutClose(false);

        if (isSaveSuccessPost) {
          navigate(`/themes/edit/${idFromUrl(data["@id"])}`);
        }
      } else {
        navigate(`/themes/list`);
      }
    }
  }, [isSaveSuccessPut, isSaveSuccessPost]);

  /** Handles submit. */
  const handleSubmit = () => {
    setSubmitting(true);
    if (formStateObject.logo?.length > 0 && formStateObject.logo[0].url) {
      setLoadingMessage(t("loading-messages.saving-media"));
      saveMedia(formStateObject.logo[0]);
    } else {
      saveTheme();
    }
  };

  const handleSaveNoClose = () => {
    setSaveWithoutClose(true);
    handleSubmit();
  };

  /** If the theme is saved with error, display the error message */
  useEffect(() => {
    if (saveErrorPut || saveErrorPost) {
      const saveError = saveErrorPut || saveErrorPost;
      setSubmitting(false);
      displayError(t("error-messages.save-theme-error"), saveError);
    }
  }, [saveErrorPut, saveErrorPost]);

  return (
    <>
      {formStateObject && (
        <ThemeForm
          theme={formStateObject}
          headerText={`${headerText}: ${formStateObject?.title}`}
          handleInput={handleInput}
          handleSubmit={handleSubmit}
          handleSaveNoClose={handleSaveNoClose}
          isLoading={isLoading || submitting}
          loadingMessage={loadingMessage}
        />
      )}
    </>
  );
}

ThemeManager.propTypes = {
  initialState: PropTypes.shape({
    logo: PropTypes.shape({}),
  }),
  saveMethod: PropTypes.string.isRequired,
  id: PropTypes.string,
  isLoading: PropTypes.bool,
  loadingError: PropTypes.shape({
    data: PropTypes.shape({
      status: PropTypes.number,
    }),
  }),
};

export default ThemeManager;
