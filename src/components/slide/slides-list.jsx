import { React, useState, useEffect, useContext } from "react";
import { useTranslation } from "react-i18next";
import List from "../util/list/list";
import idFromUrl from "../util/helpers/id-from-url";
import UserContext from "../../context/user-context";
import ListContext from "../../context/list-context";
import ContentHeader from "../util/content-header/content-header";
import ContentBody from "../util/content-body/content-body";
import useModal from "../../context/modal-context/modal-context-hook";
import { SlideColumns } from "./slides-columns";
import {
  displayError,
  displaySuccess,
} from "../util/list/toast-component/display-toast";
import {
  useGetV2SlidesQuery,
  useDeleteV2SlidesByIdMutation,
  useGetV2PlaylistsByIdQuery,
} from "../../redux/api/api.generated.ts";

/**
 * The slides list component.
 *
 * @returns {object} The slides list
 */
function SlidesList() {
  const { t } = useTranslation("common", { keyPrefix: "slides-list" });
  const context = useContext(UserContext);
  const { selected, setSelected } = useModal();

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
    t("loading-messages.loading-slides")
  );

  // Delete call
  const [DeleteV2Slides, { isSuccess: isDeleteSuccess, error: isDeleteError }] =
    useDeleteV2SlidesByIdMutation();

  // Get method
  const {
    data,
    error: slidesGetError,
    isLoading,
    refetch,
  } = useGetV2SlidesQuery({
    page,
    order: { createdAt: "desc" },
    title: searchText,
    published: isPublished,
    createdBy,
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

  /** Deletes multiple slides. */
  useEffect(() => {
    if (isDeleting && selected.length > 0) {
      const slideToDelete = selected[0];
      setSelected(selected.slice(1));
      const slideToDeleteId = idFromUrl(slideToDelete.id);
      DeleteV2Slides({ id: slideToDeleteId });
    }
  }, [isDeleting, isDeleteSuccess]);

  // Display success messages
  useEffect(() => {
    if (isDeleteSuccess && selected.length === 0) {
      displaySuccess(t("success-messages.slide-delete"));
      refetch();
      setIsDeleting(false);
    }
  }, [isDeleteSuccess]);

  // Display error on unsuccessful deletion
  useEffect(() => {
    if (isDeleteError) {
      setIsDeleting(false);
      displayError(t("error-messages.slide-delete-error"), isDeleteError);
    }
  }, [isDeleteError]);

  /** Starts the deletion process. */
  const handleDelete = () => {
    setIsDeleting(true);
    setLoadingMessage(t("loading-messages.deleting-slide"));
  };

  // The columns for the table.
  const columns = SlideColumns({
    handleDelete,
    apiCall: useGetV2PlaylistsByIdQuery,
    infoModalRedirect: "/playlist/edit",
    infoModalTitle: t("info-modal.slide-on-playlists"),
  });

  // Error with retrieving list of slides
  useEffect(() => {
    if (slidesGetError) {
      displayError(t("error-messages.slides-load-error"), slidesGetError);
    }
  }, [slidesGetError]);

  return (
    <div className="p-3">
      <ContentHeader
        title={t("header")}
        newBtnTitle={t("create-new-slide")}
        newBtnLink="/slide/create"
      />
      {listData && (
        <ContentBody>
          <List
            columns={columns}
            totalItems={listData["hydra:totalItems"]}
            data={listData["hydra:member"]}
            handleDelete={handleDelete}
            displayPublished
            isLoading={isLoading || isDeleting}
            loadingMessage={loadingMessage}
          />
        </ContentBody>
      )}
    </div>
  );
}

export default SlidesList;
