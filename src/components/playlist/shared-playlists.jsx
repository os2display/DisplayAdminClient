import { React, useState, useEffect, useContext } from "react";
import { useTranslation } from "react-i18next";
import UserContext from "../../context/user-context";
import ContentHeader from "../util/content-header/content-header";
import List from "../util/list/list";
import ListContext from "../../context/list-context";
import ContentBody from "../util/content-body/content-body";
import { displayError } from "../util/list/toast-component/display-toast";
import getSharedPlaylistColumns from "./shared-playlists-column";
import { useGetV2PlaylistsQuery } from "../../redux/api/api.generated.ts";

/**
 * The list component for shared playlists.
 *
 * @returns {object} The playlist containing shared playlists.
 */
function SharedPlaylists() {
  const { t } = useTranslation("common", { keyPrefix: "shared-playlists" });

  // Context
  const context = useContext(UserContext);
  const {
    searchText: { get: searchText },
    page: { get: page },
    isPublished: { get: isPublished },
  } = useContext(ListContext);

  // Local state
  const [listData, setListData] = useState();

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
    isCampaign: false,
    sharedWithMe: true,
  });

  useEffect(() => {
    if (data) {
      setListData(data);
    }
  }, [data]);

  useEffect(() => {
    refetch();
  }, [searchText, page, isPublished]);

  // If the tenant is changed, data should be refetched
  useEffect(() => {
    if (context.selectedTenant.get) {
      refetch();
    }
  }, [context.selectedTenant.get]);

  // The columns for the table.
  const columns = getSharedPlaylistColumns();

  // Error with retrieving list of playlists
  useEffect(() => {
    if (playlistsGetError) {
      displayError(t("error-messages.load-error"), playlistsGetError);
    }
  }, [playlistsGetError]);

  return (
    <div className="p-3">
      <ContentHeader
        title={t("header")}
        newBtnTitle={t("create-new")}
        newBtnLink="/playlist/create?shared=true"
      />
      {listData && (
        <ContentBody>
          <List
            displayPublished
            columns={columns}
            showCreatedByFilter={false}
            totalItems={listData["hydra:totalItems"]}
            data={listData["hydra:member"]}
            isLoading={isLoading}
            loadingMessage={t("loading")}
          />
        </ContentBody>
      )}
    </div>
  );
}

export default SharedPlaylists;
