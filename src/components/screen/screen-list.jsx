import { React, useEffect, useState, useContext } from "react";
import { useTranslation } from "react-i18next";
import UserContext from "../../context/user-context";
import List from "../util/list/list";
import { ScreenColumns } from "./util/screen-columns";
import ContentHeader from "../util/content-header/content-header";
import ContentBody from "../util/content-body/content-body";
import idFromUrl from "../util/helpers/id-from-url";
import ListContext from "../../context/list-context";
import useModal from "../../context/modal-context/modal-context-hook";
import {
  useGetV2ScreensQuery,
  useDeleteV2ScreensByIdMutation,
  useGetV2ScreensByIdScreenGroupsQuery,
} from "../../redux/api/api.generated.ts";
import {
  displaySuccess,
  displayError,
} from "../util/list/toast-component/display-toast";
import "./screen-list.scss";

/**
 * The screen list component.
 *
 * @returns {object} The screen list.
 */
function ScreenList() {
  const { t } = useTranslation("common", { keyPrefix: "screen-list" });
  const context = useContext(UserContext);
  const {
    searchText: { get: searchText },
    page: { get: page },
    createdBy: { get: createdBy },
  } = useContext(ListContext);
  const { selected, setSelected } = useModal();

  // Local state
  const [isDeleting, setIsDeleting] = useState(false);
  const [listData, setListData] = useState();
  const [loadingMessage, setLoadingMessage] = useState(
    t("loading-messages.loading-screens")
  );

  // Delete call
  const [
    DeleteV2Screens,
    { isSuccess: isDeleteSuccess, error: isDeleteError },
  ] = useDeleteV2ScreensByIdMutation();

  // Get method
  const {
    data,
    error: screensGetError,
    isLoading,
    refetch,
  } = useGetV2ScreensQuery({
    page,
    order: { title: "asc" },
    search: searchText,
    createdBy,
  });

  useEffect(() => {
    if (data) {
      setListData(data);
    }
  }, [data]);

  useEffect(() => {
    refetch();
  }, [searchText, page, createdBy]);

  // If the tenant is changed, data should be refetched
  useEffect(() => {
    if (context.selectedTenant.get) {
      refetch();
    }
  }, [context.selectedTenant.get]);

  /** Deletes multiple screens. */
  useEffect(() => {
    if (isDeleting && selected.length > 0) {
      const screenToDelete = selected[0];
      setSelected(selected.slice(1));
      const screenToDeleteId = idFromUrl(screenToDelete.id);
      DeleteV2Screens({ id: screenToDeleteId });
    }
  }, [isDeleting, isDeleteSuccess]);

  // Display success messages
  useEffect(() => {
    if (isDeleteSuccess && selected.length === 0) {
      displaySuccess(t("success-messages.screen-delete"));
      setIsDeleting(false);
      refetch();
    }
  }, [isDeleteSuccess]);

  // Display error on unsuccessful deletion
  useEffect(() => {
    if (isDeleteError) {
      setIsDeleting(false);
      displayError(t("error-messages.screen-delete-error"), isDeleteError);
    }
  }, [isDeleteError]);

  /** Starts the deletion process. */
  const handleDelete = () => {
    setIsDeleting(true);
    setLoadingMessage(t("loading-messages.deleting-screen"));
  };

  // The columns for the table.
  const columns = ScreenColumns({
    handleDelete,
    apiCall: useGetV2ScreensByIdScreenGroupsQuery,
    infoModalRedirect: "/group/edit",
    infoModalTitle: t("info-modal.screen-in-groups"),
  });

  // Error with retrieving list of screen
  useEffect(() => {
    if (screensGetError) {
      displayError(t("error-messages.screens-load-error"), screensGetError);
    }
  }, [screensGetError]);

  return (
    <div className="p-3">
      <ContentHeader
        title={t("header")}
        newBtnTitle={t("create-new-screen")}
        newBtnLink="/screen/create"
      />
      <ContentBody>
        <>
          {listData && (
            <List
              columns={columns}
              totalItems={listData["hydra:totalItems"]}
              data={listData["hydra:member"]}
              calendarViewPossible
              handleDelete={handleDelete}
              isLoading={isLoading || isDeleting}
              loadingMessage={loadingMessage}
            />
          )}
        </>
      </ContentBody>
    </div>
  );
}

export default ScreenList;
