import { React, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
import set from "lodash.set";
import PropTypes from "prop-types";
import dayjs from "dayjs";
import { useDispatch } from "react-redux";
import idFromUrl from "../util/helpers/id-from-url";
import PlaylistCampaignForm from "./playlist-campaign-form";
import PlaylistForm from "./playlist-form";
import CampaignForm from "./campaign-form";
import {
  displaySuccess,
  displayError,
} from "../util/list/toast-component/display-toast";
import {
  api,
  usePutV2PlaylistsByIdMutation,
  usePostV2PlaylistsMutation,
} from "../../redux/api/api.generated.ts";

/**
 * The shared manager component.
 *
 * @param {object} props The props.
 * @param {object} props.initialState Initial playlist state.
 * @param {string} props.saveMethod POST or PUT.
 * @param {string | null} props.id Playlist id.
 * @param {boolean} props.isLoading Is the slide state loading?
 * @param {object} props.loadingError Loading error.
 * @param {string} props.slideId Slide id
 * @param {string} props.location Either playlist or campaign.
 * @returns {object} The shared manager, shared by campaign and playlists.
 */
function PlaylistCampaignManager({
  saveMethod,
  location,
  id = null,
  isLoading = false,
  loadingError = null,
  initialState = null,
  slideId = "",
}) {
  const dispatch = useDispatch();
  const { t } = useTranslation("common", {
    keyPrefix: "playlist-campaign-manager",
  });
  const navigate = useNavigate();
  const { search } = useLocation();
  const sharedParams = new URLSearchParams(search).get("shared");
  const headerText =
    saveMethod === "PUT"
      ? t(`${location}.edit-header`)
      : t(`${location}.create-header`);
  const [formStateObject, setFormStateObject] = useState();
  const [loadingMessage, setLoadingMessage] = useState("");
  const [highlightSharedSection, setHighlightSharedSection] = useState(false);
  const [savingRelations, setSavingRelations] = useState(false);
  const [saveWithoutClose, setSaveWithoutClose] = useState(false);
  const isCampaign = location === "campaign";

  const [
    PutV2Playlists,
    {
      isLoading: savingPlaylists,
      error: saveErrorPut,
      isSuccess: isSaveSuccessPut,
    },
  ] = usePutV2PlaylistsByIdMutation();

  const [
    PostV2Playlist,
    { data, error: saveErrorPost, isSuccess: isSaveSuccessPost },
  ] = usePostV2PlaylistsMutation();

  /** Set loaded data into form state. */
  useEffect(() => {
    if (initialState) {
      const localFormStateObject = JSON.parse(JSON.stringify(initialState));
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

  useEffect(() => {
    // If redirected from create shared playlist
    if (sharedParams === "true") {
      // Remove shared search param
      setHighlightSharedSection(true);
      const params = new URLSearchParams(search);
      params.delete("shared");
      navigate({
        search: params.toString(),
      });
    }
  }, [sharedParams]);

  const bindScreens = (playlistId, selectedScreens) => {
    return new Promise((resolve, reject) => {
      if (selectedScreens === null || !isCampaign) {
        // If not campaign, do not bind screens.
        resolve();
        return;
      }

      setLoadingMessage(t(`${location}.loading-messages.saving-screens`));

      dispatch(
        api.endpoints.putV2ScreensByIdCampaigns.initiate({
          id: playlistId,
          body: JSON.stringify(selectedScreens),
        })
      )
        .then((response) => {
          if (response.error) {
            displayError(
              t(`${location}.error-messages.save-screens-error`),
              response.error
            );
            reject(response.error);
          } else {
            displaySuccess(t(`${location}.success-messages.saved-screens`));
            resolve();
          }
        })
        .catch((e) => {
          displayError(t(`${location}.error-messages.save-screens-error`), e);
          reject(e);
        });
    });
  };

  const bindScreenGroups = (playlistId, selectedScreenGroups) => {
    return new Promise((resolve, reject) => {
      if (selectedScreenGroups === null || !isCampaign) {
        // If not campaign, do not bind screen groups.
        resolve();
        return;
      }

      setLoadingMessage(t(`${location}.loading-messages.saving-groups`));

      dispatch(
        api.endpoints.putV2ScreenGroupsByIdCampaigns.initiate({
          id: playlistId,
          body: JSON.stringify(selectedScreenGroups),
        })
      )
        .then((response) => {
          if (response.error) {
            displayError(
              t(`${location}.error-messages.save-group-error`),
              response.error
            );
            reject(response.error);
          } else {
            displaySuccess(t(`${location}.success-messages.saved-groups`));
            resolve();
          }
        })
        .catch((e) => {
          displayError(t(`${location}.error-messages.save-group-error`), e);
          reject(e);
        });
    });
  };

  const bindSlides = (playlistId, selectedSlides) => {
    return new Promise((resolve, reject) => {
      if (selectedSlides === null) {
        resolve();
        return;
      }

      setLoadingMessage(t(`${location}.loading-messages.saving-slides`));

      dispatch(
        api.endpoints.putV2PlaylistsByIdSlides.initiate({
          id: playlistId,
          body: JSON.stringify(selectedSlides),
        })
      )
        .then((response) => {
          if (response.error) {
            displayError(
              t(`${location}.error-messages.save-slides-error`),
              response.error
            );
            reject(response.error);
          } else {
            displaySuccess(t(`${location}.success-messages.saved-slides`));
            resolve();
          }
        })
        .catch((e) => {
          displayError(t(`${location}.error-messages.save-slides-error`), e);
          reject(e);
        });
    });
  };

  // When playlist has been saved, bind relations.
  useEffect(() => {
    if (isSaveSuccessPut === true || isSaveSuccessPost === true) {
      setSavingRelations(true);

      const playlistId = id || idFromUrl(data["@id"]);

      const { slides, groups, screens } = formStateObject;

      const selectedSlides = Array.isArray(slides)
        ? slides.map((slide, index) => {
            return { slide: idFromUrl(slide), weight: index };
          })
        : null;

      const selectedScreens = Array.isArray(screens)
        ? screens.map((screen) => {
            return { screen: idFromUrl(screen) };
          })
        : null;

      const selectedGroups = Array.isArray(groups)
        ? groups.map((group) => {
            return { screengroup: idFromUrl(group) };
          })
        : null;

      // Chain bind relations calls.
      // Make sure we redirect to list on errors, or after all relations have been bound.
      bindScreens(playlistId, selectedScreens)
        .then(() => bindScreenGroups(playlistId, selectedGroups))
        .then(() => bindSlides(playlistId, selectedSlides))
        .then(() => displaySuccess(t(`${location}.success-messages.saved`)))
        .finally(() => {
          if (saveWithoutClose) {
            setSaveWithoutClose(false);

            if (isSaveSuccessPost) {
              navigate(`/${location}/edit/${idFromUrl(data["@id"])}`);
            }
          } else {
            navigate(`/${location}/list`);
          }

          setSavingRelations(false);
        });
    }
  }, [isSaveSuccessPut, isSaveSuccessPost]);

  /** Slides are not saved successfully, display a message */
  useEffect(() => {
    if (loadingError) {
      displayError(t(`${location}.error-messages.load-error`), loadingError);
    }
  }, [loadingError]);

  /** If the slide is saved with error, display the error message */
  useEffect(() => {
    if (saveErrorPut || saveErrorPost) {
      const saveError = saveErrorPut || saveErrorPost;
      displayError(t(`${location}.error-messages.save-error`), saveError);
    }
  }, [saveErrorPut, saveErrorPost]);

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

  /** Handles submit. */
  const handleSubmit = () => {
    setLoadingMessage(t(`${location}.loading-messages.saving-playlist`));

    // Set published.
    const from = formStateObject.published.from
      ? new Date(formStateObject.published.from).toISOString()
      : null;
    const to = formStateObject.published.to
      ? new Date(formStateObject.published.to).toISOString()
      : null;

    const saveTenants = formStateObject.tenants
      ? formStateObject.tenants.map((tenant) => {
          return idFromUrl(tenant["@id"]);
        })
      : [];

    const saveData = {
      title: formStateObject.title,
      isCampaign,
      description: formStateObject.description,
      modifiedBy: formStateObject.modifiedBy,
      createdBy: formStateObject.createdBy,
      tenants: saveTenants,
      schedules: formStateObject.schedules.map((schedule) => {
        return {
          rrule: schedule.rrule,
          duration: schedule.duration,
        };
      }),
      published: {
        from,
        to,
      },
    };

    setLoadingMessage(t(`${location}.loading-messages.saving`));

    if (saveMethod === "POST") {
      PostV2Playlist({
        playlistPlaylistInput: JSON.stringify(saveData),
      });
    } else if (saveMethod === "PUT") {
      PutV2Playlists({
        id,
        playlistPlaylistInput: JSON.stringify(saveData),
      });
    }
  };

  const handleSaveNoClose = () => {
    setSaveWithoutClose(true);
    handleSubmit();
  };

  return (
    <>
      {formStateObject && (
        <PlaylistCampaignForm
          location={location}
          playlist={formStateObject}
          headerText={`${headerText}: ${formStateObject?.title}`}
          isLoading={savingPlaylists || savingRelations || isLoading}
          loadingMessage={loadingMessage}
          handleInput={handleInput}
          handleSubmit={handleSubmit}
          handleSaveNoClose={handleSaveNoClose}
          slideId={slideId}
          isCampaign={location === "campaign"}
        >
          {location === "campaign" && (
            <CampaignForm
              handleInput={handleInput}
              campaign={formStateObject}
            />
          )}
          {location === "playlist" && (
            <PlaylistForm
              highlightSharedSection={highlightSharedSection}
              handleInput={handleInput}
              playlist={formStateObject}
            />
          )}
        </PlaylistCampaignForm>
      )}
    </>
  );
}

PlaylistCampaignManager.propTypes = {
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
  slideId: PropTypes.string,
  location: PropTypes.string.isRequired,
};

export default PlaylistCampaignManager;
