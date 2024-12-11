import { React, useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import useModal from "../../context/modal-context/modal-context-hook";
import UserContext from "../../context/user-context";
import ContentHeader from "../util/content-header/content-header";
import ListContext from "../../context/list-context";
import List from "../util/list/list";
import idFromUrl from "../util/helpers/id-from-url";
import ContentBody from "../util/content-body/content-body";
import { PlaylistColumns } from "./playlists-columns";
import {
  displayError,
  displaySuccess,
} from "../util/list/toast-component/display-toast";
import {
  useDeleteV2PlaylistsByIdMutation,
  useGetV2PlaylistsByIdSlidesQuery,
  useGetV2PlaylistsQuery,
} from "../../redux/api/api.generated.ts";

/**
 * The shared list component.
 *
 * @param {object} props Props.
 * @param {string} props.location Either playlist or campaign.
 * @returns {object} The shared list, shared by playlists and campaigns.
 */
function PlaylistCampaignList({ location }) {
  const { t } = useTranslation("common", {
    keyPrefix: "playlist-campaign-list",
  });
  const { selected, setSelected } = useModal();
  const context = useContext(UserContext);

  const {
    searchText: { get: searchText },
    page: { get: page },
    createdBy: { get: createdBy },
    isPublished: { get: isPublished },
  } = useContext(ListContext);

  // Local state
  const [isDeleting, setIsDeleting] = useState(false);
  const [listData, setListData] = useState();
  const [loadingMessage, setLoadingMessage] = useState(
    t(`${location}.loading-messages.loading`)
  );

  // Delete call
  const [
    DeleteV2Playlists,
    { isSuccess: isDeleteSuccess, error: isDeleteError },
  ] = useDeleteV2PlaylistsByIdMutation();

  // Get method
  const {
    data,
    error: playlistsGetError,
    isLoading,
    refetch,
  } = useGetV2PlaylistsQuery({
    page,
    order: { createdAt: "desc" },
    title: searchText,
    published: isPublished,
    isCampaign: location === "campaign",
    createdBy,
    sharedWithMe: false,
  });

  useEffect(() => {
    if (data) {
      setListData(data);
    }
  }, [data]);

  // If the tenant is changed, data should be refetched
  useEffect(() => {
    if (context.selectedTenant.get) {
      refetch();
    }
  }, [context.selectedTenant.get]);

  useEffect(() => {
    refetch();
  }, [searchText, page, isPublished, createdBy]);

  /** Deletes multiple playlists. */
  useEffect(() => {
    if (isDeleting && selected.length > 0) {
      if (isDeleteSuccess) {
        displaySuccess(t(`${location}.success-messages.delete`));
      }
      const playlistToDelete = selected[0];
      setSelected(selected.slice(1));
      const playlistToDeleteId = idFromUrl(playlistToDelete.id);
      DeleteV2Playlists({ id: playlistToDeleteId });
    }
  }, [isDeleting, isDeleteSuccess]);

  // Display success messages
  useEffect(() => {
    if (isDeleteSuccess && selected.length === 0) {
      displaySuccess(t(`${location}.success-messages.delete`));
      setIsDeleting(false);
      refetch();
    }
  }, [isDeleteSuccess]);

  // Display error on unsuccessful deletion
  useEffect(() => {
    if (isDeleteError) {
      setIsDeleting(false);
      displayError(t(`${location}.error-messages.delete-error`), isDeleteError);
    }
  }, [isDeleteError]);

  /** Starts the deletion process. */
  const handleDelete = () => {
    setIsDeleting(true);
    setLoadingMessage(t(`${location}.loading-messages.deleting`));
  };

  // The columns for the table.
  const columns = PlaylistColumns({
    handleDelete,
    apiCall: useGetV2PlaylistsByIdSlidesQuery,
    infoModalRedirect: "/slide/edit",
    infoModalTitle: t(`${location}.info-modal.slides`),
    dataKey: "slide",
  });

  // Error with retrieving list of playlists
  useEffect(() => {
    if (playlistsGetError) {
      displayError(
        t(`${location}.error-messages.load-error`),
        playlistsGetError
      );
    }
  }, [playlistsGetError]);

  return (
    <div className="p-3">
      <ContentHeader
        title={t(`${location}.header`)}
        newBtnTitle={t(`${location}.create-new`)}
        newBtnLink={`/${location}/create`}
      />
      {listData && (
        <ContentBody>
          <List
            data={listData["hydra:member"]}
            columns={columns}
            handleDelete={handleDelete}
            totalItems={listData["hydra:totalItems"]}
            displayPublished
            isLoading={isLoading || isDeleting}
            loadingMessage={loadingMessage}
          />
        </ContentBody>
      )}
    </div>
  );
}

PlaylistCampaignList.propTypes = {
  location: PropTypes.string.isRequired,
};

export default PlaylistCampaignList;
