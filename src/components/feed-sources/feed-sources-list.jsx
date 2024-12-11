import { React, useState, useEffect, useContext } from "react";
import { useTranslation } from "react-i18next";
import ContentHeader from "../util/content-header/content-header";
import {
  useGetV2FeedSourcesQuery,
  useDeleteV2FeedSourcesByIdMutation,
  useGetV2FeedSourcesByIdSlidesQuery,
} from "../../redux/api/api.generated.ts";
import ListContext from "../../context/list-context";
import ContentBody from "../util/content-body/content-body";
import List from "../util/list/list";
import { FeedSourceColumns } from "./feed-sources-columns";
import {
  displayError,
  displaySuccess,
} from "../util/list/toast-component/display-toast";
import idFromUrl from "../util/helpers/id-from-url";
import UserContext from "../../context/user-context";
import useModal from "../../context/modal-context/modal-context-hook";

/**
 * The feed sources list component.
 *
 * @returns {object} The Feed sources list
 */
function FeedSourcesList() {
  const { t } = useTranslation("common", { keyPrefix: "feed-sources-list" });
  const context = useContext(UserContext);
  const { selected, setSelected } = useModal();

  const [listData, setListData] = useState();
  const [isDeleting, setIsDeleting] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState(
    t("loading-messages.loading-feed-sources")
  );

  // Delete call
  const [
    DeleteV2FeedSources,
    { isSuccess: isDeleteSuccess, error: isDeleteError },
  ] = useDeleteV2FeedSourcesByIdMutation(); // Insert feed source delete api;

  const {
    searchText: { get: searchText },
    page: { get: page },
    createdBy: { get: createdBy },
  } = useContext(ListContext);

  const {
    data,
    error: feedSourcesGetError,
    isLoading,
    refetch,
  } = useGetV2FeedSourcesQuery({
    page,
    order: { createdAt: "desc" },
    title: searchText,
    createdBy,
  });

  /** Deletes multiple feed sources. */
  useEffect(() => {
    if (isDeleting && selected.length > 0) {
      if (isDeleteSuccess) {
        displaySuccess(t("success-messages.feed-source-delete"));
      }
      const feedSourceToDelete = selected[0];
      setSelected(selected.slice(1));
      const feedSourceToDeleteId = idFromUrl(feedSourceToDelete.id);
      DeleteV2FeedSources({ id: feedSourceToDeleteId });
    }
  }, [isDeleting, isDeleteSuccess]);

  // Display success messages
  useEffect(() => {
    if (isDeleteSuccess && selected.length === 0) {
      displaySuccess(t("success-messages.feed-source-delete"));
      refetch();
      setIsDeleting(false);
    }
  }, [isDeleteSuccess]);

  // If the tenant is changed, data should be refetched
  useEffect(() => {
    if (context.selectedTenant.get) {
      refetch();
    }
  }, [context.selectedTenant.get]);

  useEffect(() => {
    refetch();
  }, [searchText, page, createdBy]);

  // Display error on unsuccessful deletion
  useEffect(() => {
    if (isDeleteError) {
      setIsDeleting(false);
      displayError(t("error-messages.feed-source-delete-error"), isDeleteError);
    }
  }, [isDeleteError]);

  const handleDelete = () => {
    setIsDeleting(true);
    setLoadingMessage(t("loading-messages.deleting-feed-source"));
  };

  // The columns for the table.
  const columns = FeedSourceColumns({
    handleDelete,
    apiCall: useGetV2FeedSourcesByIdSlidesQuery,
    infoModalRedirect: "/slide/edit",
    infoModalTitle: t(`info-modal.slides`),
  });

  useEffect(() => {
    if (data) {
      setListData(data);
    }
  }, [data]);

  // Error with retrieving list of feed sources
  useEffect(() => {
    if (feedSourcesGetError) {
      displayError(
        t("error-messages.feed-sources-load-error"),
        feedSourcesGetError
      );
    }
  }, [feedSourcesGetError]);

  return (
    <div className="p-3">
      <ContentHeader
        title={t("header")}
        newBtnTitle={t("create-new-feed-source")}
        newBtnLink="/feed-sources/create"
      />
      {data && data["hydra:member"] && (
        <ContentBody>
          <>
            {listData && (
              <List
                columns={columns}
                totalItems={listData["hydra:totalItems"]}
                data={listData["hydra:member"]}
                isLoading={isLoading || isDeleting}
                loadingMessage={loadingMessage}
              />
            )}
          </>
        </ContentBody>
      )}
    </div>
  );
}

export default FeedSourcesList;
