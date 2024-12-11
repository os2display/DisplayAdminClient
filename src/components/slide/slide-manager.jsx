import { React, useEffect, useState, useContext } from "react";
import { useTranslation } from "react-i18next";
import get from "lodash.get";
import set from "lodash.set";
import { ulid } from "ulid";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import UserContext from "../../context/user-context";
import {
  api,
  usePostMediaCollectionMutation,
  usePostV2SlidesMutation,
  usePutV2SlidesByIdPlaylistsMutation,
  usePutV2SlidesByIdMutation,
} from "../../redux/api/api.generated.ts";
import SlideForm from "./slide-form";
import {
  displaySuccess,
  displayError,
} from "../util/list/toast-component/display-toast";
import idFromUrl from "../util/helpers/id-from-url";
import localStorageKeys from "../util/local-storage-keys";

/**
 * The slide manager component.
 *
 * @param {object} props The props.
 * @param {object} props.initialState Initial slide state.
 * @param {string} props.saveMethod POST or PUT.
 * @param {string | null} props.id Slide id.
 * @param {boolean} props.isLoading Is the slide state loading?
 * @param {object} props.loadingError Loading error.
 * @returns {object} The slide form.
 */
function SlideManager({
  saveMethod,
  id = null,
  isLoading = false,
  loadingError = null,
  initialState = null,
}) {
  // Hooks
  const { t } = useTranslation("common", { keyPrefix: "slide-manager" });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Context
  const context = useContext(UserContext);

  // State
  const [headerText] = useState(
    saveMethod === "PUT" ? t("edit-slide-header") : t("create-slide-header")
  );
  const [getTheme, setGetTheme] = useState(true);
  const [getTemplate, setGetTemplate] = useState(true);
  const [mediaFields, setMediaFields] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [playlistsToAdd, setPlaylistsToAdd] = useState([]);
  const [submittingMedia, setSubmittingMedia] = useState([]);
  const [mediaData, setMediaData] = useState({});
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [selectedTheme, setSelectedTheme] = useState();
  const [saveWithoutClose, setSaveWithoutClose] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState(
    t("loading-messages.loading-slide")
  );

  // Initialize to empty slide object.
  const [formStateObject, setFormStateObject] = useState(null);

  const [PutV2Slides, { error: saveErrorPut, isSuccess: isSaveSuccessPut }] =
    usePutV2SlidesByIdMutation();

  // Handler for creating slide.
  const [
    PostV2Slides,
    { data: postData, error: saveErrorPost, isSuccess: isSaveSuccessPost },
  ] = usePostV2SlidesMutation();

  const [
    PostV2MediaCollection,
    {
      data: savedMediaData,
      isSuccess: isSaveMediaSuccess,
      error: saveMediaError,
    },
  ] = usePostMediaCollectionMutation();

  const [
    PutV2SlidesByIdPlaylists,
    {
      isLoading: savingPlaylists,
      error: saveErrorPlaylists,
      isSuccess: isSaveSuccessPlaylists,
    },
  ] = usePutV2SlidesByIdPlaylistsMutation();

  // Slides are saved successfully, display a message
  useEffect(() => {
    if (isSaveMediaSuccess) {
      displaySuccess(t("success-messages.saved-media"));
    }
  }, [isSaveMediaSuccess]);

  // Groups are saved successfully, display a message
  useEffect(() => {
    if (isSaveSuccessPlaylists) {
      displaySuccess(t(`success-messages.saved-playlist`));
    }
  }, [isSaveSuccessPlaylists]);

  // Slides are not saved successfully, display a message
  useEffect(() => {
    if (saveMediaError) {
      setSubmitting(false);
      displayError(t("error-messages.save-media-error"), saveMediaError);
    }
  }, [saveMediaError]);

  // Playlists are not saved successfully, display a message
  useEffect(() => {
    if (saveErrorPlaylists) {
      displayError(t(`error-messages.save-playlist-error`), saveErrorPlaylists);
    }
  }, [saveErrorPlaylists]);

  /** If the slide is saved, display the success message */
  useEffect(() => {
    if (isSaveSuccessPost || isSaveSuccessPut) {
      displaySuccess(t("success-messages.saved-slide"));
    }
  }, [isSaveSuccessPost || isSaveSuccessPut]);

  /** If the slide is saved with error, display the error message */
  useEffect(() => {
    if (saveErrorPut || saveErrorPost) {
      const saveError = saveErrorPut || saveErrorPost;
      displayError(t("error-messages.save-slide-error"), saveError);
    }
  }, [saveErrorPut, saveErrorPost]);

  /** If the slide is not loaded, display the error message */
  useEffect(() => {
    if (loadingError) {
      displayError(t("error-messages.load-slide-error"), loadingError);
    }
  }, [loadingError]);

  /**
   * Set state on change in input field
   *
   * @param {object} props - The props.
   * @param {object} props.target - Event target.
   */
  const handleInput = ({ target }) => {
    const localFormStateObject = { ...formStateObject };
    set(localFormStateObject, target.id, target.value);
    setFormStateObject(localFormStateObject);
  };

  /**
   * Select template.
   *
   * @param {object} props - The props.
   * @param {object} props.target - The target.
   */
  const selectTemplate = ({ target }) => {
    const { value, id: targetId } = target;
    let template = null;

    if (value.length > 0) {
      template = value.shift();
    }

    setSelectedTemplate(template);
    handleInput({
      target: { id: targetId, value: { "@id": template["@id"] } },
    });
  };

  /**
   * Select theme.
   *
   * @param {object} props - The props.
   * @param {object} props.target - The target.
   */
  const selectTheme = ({ target }) => {
    const { value, id: targetId } = target;
    let themeId = "";
    if (value.length > 0) {
      themeId = value[0]["@id"];
    }
    setSelectedTheme(value);
    handleInput({
      target: { id: targetId, value: themeId },
    });
  };

  /**
   * Update content field for id/value.
   *
   * @param {object} props - The props.
   * @param {object} props.target - The target.
   */
  const handleContent = ({ target }) => {
    // Convert numbers
    const value =
      target.type === "number" ? target.valueAsNumber : target.value;
    const localFormStateObject = { ...formStateObject };
    set(localFormStateObject.content, target.id, value);
    setFormStateObject(localFormStateObject);
  };

  useEffect(() => {
    // Load template if set, getTemplate because if not, it runs on every time formstateobject is changed
    if (
      formStateObject?.templateInfo &&
      Object.prototype.hasOwnProperty.call(
        formStateObject.templateInfo,
        "@id"
      ) &&
      getTemplate
    ) {
      dispatch(
        api.endpoints.getV2TemplatesById.initiate({
          id: idFromUrl(formStateObject.templateInfo["@id"]),
        })
      )
        .then((result) => {
          const template = result.data;
          setGetTemplate(false);
          setSelectedTemplate(template);
        })
        .catch((err) => {
          displayError(t("error-messages.load-slide-template-error"), err);
        });
    }

    // Load theme if set, getTheme because if not, it runs on every time formstateobject is changed
    if (formStateObject?.theme && getTheme) {
      dispatch(
        api.endpoints.getV2ThemesById.initiate({
          id: idFromUrl(formStateObject.theme),
        })
      )
        .then((result) => {
          // To only get the theme once.
          setGetTheme(false);

          // If the theme exists, it will be used.
          if (result.data) {
            const theme = result.data;
            setSelectedTheme([theme]);
          } else {
            // Or else the local storage contained an old value, and the theme is reset.
            formStateObject.theme = "";
          }
        })
        .catch((err) => {
          displayError(t("error-messages.load-slide-theme-error"), err);
        });
    }
  }, [formStateObject]);

  /** Set loaded data into form state. */
  useEffect(() => {
    if (initialState) {
      const localFormStateObject = JSON.parse(JSON.stringify(initialState));

      if (initialState?.feed && initialState?.feed["@id"]) {
        dispatch(
          api.endpoints.getV2FeedsByIdData.initiate({
            id: idFromUrl(initialState.feed["@id"]),
          })
        ).then((response) => {
          setFormStateObject({
            ...localFormStateObject,
            feedData: response.data,
          });
        });
      }

      // Make sure content is an object.
      if (localFormStateObject.content instanceof Array) {
        localFormStateObject.content = {};
      }

      // Upload media already added to the slide.
      const promises = [];

      localFormStateObject.media.forEach((media) => {
        promises.push(
          dispatch(
            api.endpoints.getv2MediaById.initiate({ id: idFromUrl(media) })
          )
        );
      });

      Promise.all(promises).then((results) => {
        const newMediaData = { ...mediaData };

        results.forEach((result) => {
          if (result.data) {
            newMediaData[result.data["@id"]] = { ...result.data };
          }
        });

        setMediaData(newMediaData);
      });

      // Set published to format accepted by bootstrap date component
      if (localFormStateObject.published.from) {
        localFormStateObject.published.from = dayjs(
          localFormStateObject.published.from
        ).format("YYYY-MM-DDTHH:mm");
      }
      if (localFormStateObject.published.to) {
        localFormStateObject.published.to = dayjs(
          localFormStateObject.published.to
        ).format("YYYY-MM-DDTHH:mm");
      }

      setFormStateObject(localFormStateObject);
    }
  }, [initialState]);

  /**
   * Handle change to a media.
   *
   * @param {string} fieldName The field name.
   */
  const handleMedia = ({ target }) => {
    const fieldValue = target.value;
    const fieldId = target.id;
    const localFormStateObject = { ...formStateObject };
    const localMediaData = { ...mediaData };
    // Set field as a field to look into for new references.
    setMediaFields([...new Set([...mediaFields, fieldId])]);

    const newField = [];

    if (Array.isArray(fieldValue) && fieldValue.length === 0) {
      localFormStateObject.media = [];
    }
    // Handle each entry in field.
    if (Array.isArray(fieldValue)) {
      fieldValue.forEach((entry) => {
        // New file.
        if (entry.file && entry.file instanceof File) {
          // It is an already added temp file.
          if (entry.tempId) {
            newField.push(entry.tempId);
            set(localMediaData, entry.tempId, entry);
          }
          // It is a new temp file.
          else {
            if (!Array.isArray(localFormStateObject.content[fieldId])) {
              set(localFormStateObject.content, fieldId, []);
            }

            // Create a tempId for the media.
            const tempId =
              entry.tempId ?? `TEMP--${ulid(new Date().getTime())}`;

            newField.push(tempId);

            const newEntry = { ...entry };
            newEntry.tempId = tempId;
            set(localMediaData, tempId, newEntry);
          }
        }
        // Previously selected file.
        else if (typeof entry === "string") {
          newField.push(entry);
        }
        // Previously uploaded file.
        else {
          newField.push(entry["@id"]);

          if (
            !Object.prototype.hasOwnProperty.call(localMediaData, entry["@id"])
          ) {
            set(localMediaData, entry["@id"], entry);

            localFormStateObject.media.push(entry["@id"]);
          }
        }
      });
    }

    set(localFormStateObject.content, fieldId, newField);
    set(localFormStateObject, "media", [
      ...new Set([...localFormStateObject.media]),
    ]);

    setFormStateObject(localFormStateObject);
    setMediaData(localMediaData);
  };

  /** Handles submit. */
  const handleSubmit = () => {
    const newSubmittingMedia = [];

    // Setup submittingMedia list.
    mediaFields.forEach((fieldName) => {
      const fieldData = get(formStateObject.content, fieldName);

      if (fieldData) {
        if (Array.isArray(fieldData)) {
          fieldData.forEach((mediaId) => {
            const entry = mediaData[mediaId];

            if (entry?.file && entry.file instanceof File) {
              newSubmittingMedia.push({ fieldName, entry, tempId: mediaId });
            }
          });
        }
      }
    });

    // Trigger submitting hooks.
    setSubmitting(true);
    setSubmittingMedia(newSubmittingMedia);
    setLoadingMessage(t("loading-messages.saving-media"));
  };

  const handleSaveNoClose = () => {
    setSaveWithoutClose(true);
    handleSubmit();
  };

  /** When the group is saved, the slide will be saved. */
  useEffect(() => {
    if (
      (isSaveSuccessPost || isSaveSuccessPut) &&
      playlistsToAdd &&
      formStateObject.playlists
    ) {
      setLoadingMessage(t("loading-messages.saving-playlists"));
      PutV2SlidesByIdPlaylists({
        id: id || idFromUrl(postData["@id"]),
        body: JSON.stringify(playlistsToAdd),
      });
    }
  }, [isSaveSuccessPut, isSaveSuccessPost]);

  /** Sets groups to playlists. */
  function handleSavePlaylists() {
    const { playlists } = formStateObject;

    setPlaylistsToAdd(
      playlists.map((playlist) => {
        return { playlist: idFromUrl(playlist) };
      })
    );
  }

  /** Handle submitting. */
  useEffect(() => {
    if (submitting) {
      if (submittingMedia.length > 0) {
        const media = submittingMedia[0];
        const { entry } = media;

        // Submit media.
        const formData = new FormData();
        formData.append("file", entry.file);
        formData.append("title", entry.title);
        formData.append("description", entry.description);
        formData.append("license", entry.license);
        // @TODO: Should these be optional in the API?
        formData.append("modifiedBy", "");
        formData.append("createdBy", "");

        PostV2MediaCollection({ body: formData });
      } else {
        // All media have been submitted. Submit slide.

        // Set published.
        const from = formStateObject.published.from
          ? new Date(formStateObject.published.from).toISOString()
          : null;
        const to = formStateObject.published.to
          ? new Date(formStateObject.published.to).toISOString()
          : null;

        // Sets theme in localstorage, to load it on create new slide
        if (formStateObject.theme) {
          const { tenantKey } = context.selectedTenant.get;
          let previouslySavedTheme = localStorage.getItem(
            localStorageKeys.THEME
          );
          if (previouslySavedTheme) {
            previouslySavedTheme = JSON.parse(previouslySavedTheme);
            previouslySavedTheme[tenantKey] = formStateObject.theme;
            localStorage.setItem(
              localStorageKeys.THEME,
              JSON.stringify(previouslySavedTheme)
            );
          } else {
            const themeToSave = {};
            themeToSave[tenantKey] = formStateObject.theme;
            localStorage.setItem(
              localStorageKeys.THEME,
              JSON.stringify(themeToSave)
            );
          }
        }
        // Construct data for submitting.
        const saveData = {
          slideSlideInput: JSON.stringify({
            title: formStateObject.title,
            theme: formStateObject.theme ?? "",
            description: formStateObject.description,
            templateInfo: formStateObject.templateInfo,
            duration: formStateObject.duration || null,
            content: formStateObject.content,
            media: formStateObject.media,
            feed: formStateObject.feed,
            published: {
              from,
              to,
            },
          }),
        };

        if (saveMethod === "POST") {
          setLoadingMessage(t("loading-messages.saving-slide"));
          PostV2Slides(saveData);
        } else if (saveMethod === "PUT") {
          setLoadingMessage(t("loading-messages.saving-slide"));
          const putData = { ...saveData, id };

          PutV2Slides(putData);
        } else {
          throw new Error("Unsupported save method");
        }

        if (Array.isArray(formStateObject.playlists)) {
          handleSavePlaylists();
        }
      }
    }
  }, [submittingMedia.length, submitting]);

  /** Submitted media is successful. */
  useEffect(() => {
    if (submitting) {
      if (isSaveMediaSuccess) {
        const newSubmittingMedia = [...submittingMedia];
        const submittedMedia = newSubmittingMedia.shift();

        const newFormStateObject = { ...formStateObject };
        newFormStateObject.media.push(savedMediaData["@id"]);

        // Replace TEMP-- id with real id.
        set(
          newFormStateObject.content,
          submittedMedia.fieldName,
          get(newFormStateObject.content, submittedMedia.fieldName).map(
            (mediaId) =>
              mediaId === submittedMedia.tempId
                ? savedMediaData["@id"]
                : mediaId
          )
        );

        const newMediaData = { ...mediaData };
        newMediaData[savedMediaData["@id"]] = savedMediaData;
        setMediaData(newMediaData);

        // Save new list.
        setSubmittingMedia(newSubmittingMedia);
      }
    }
  }, [isSaveMediaSuccess]);

  /** Handle submitting is done. */
  useEffect(() => {
    if (isSaveSuccessPost || isSaveSuccessPut) {
      setSubmitting(false);

      if (saveWithoutClose) {
        setSaveWithoutClose(false);

        if (isSaveSuccessPost) {
          navigate(`/slide/edit/${idFromUrl(postData["@id"])}`);
        }
      } else {
        navigate("/slide/list");
      }
    }
  }, [isSaveSuccessPut, isSaveSuccessPost]);

  return (
    <>
      {formStateObject && (
        <SlideForm
          slide={formStateObject}
          headerText={`${headerText}: ${formStateObject?.title}`}
          handleInput={handleInput}
          handleContent={handleContent}
          handleMedia={handleMedia}
          handleSubmit={handleSubmit}
          handleSaveNoClose={handleSaveNoClose}
          selectTemplate={selectTemplate}
          selectedTemplate={selectedTemplate}
          mediaData={mediaData}
          isLoading={submitting || isLoading || savingPlaylists}
          loadingMessage={loadingMessage}
          selectTheme={selectTheme}
          selectedTheme={selectedTheme}
        />
      )}
    </>
  );
}

SlideManager.propTypes = {
  initialState: PropTypes.shape({
    feed: PropTypes.shape({
      "@id": PropTypes.string,
    }),
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

export default SlideManager;
