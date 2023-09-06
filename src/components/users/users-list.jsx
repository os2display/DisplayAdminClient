import { React, useEffect, useState, useContext } from "react";
import { useTranslation } from "react-i18next";
import List from "../util/list/list";
import ListContext from "../../context/list-context";
import UserContext from "../../context/user-context";
import useModal from "../../context/modal-context/modal-context-hook";
import { UserColumns } from "./user-columns";
import ContentHeader from "../util/content-header/content-header";
import ContentBody from "../util/content-body/content-body";
import idFromUrl from "../util/helpers/id-from-url";
import {
  displaySuccess,
  displayError,
} from "../util/list/toast-component/display-toast";
import {
  useGetV1ScreenGroupsQuery,
  useDeleteV1ScreenGroupsByIdMutation,
} from "../../redux/api/api.generated";

/**
 * The users list component.
 *
 * @returns {object} The users list.
 */
function UsersList() {
  const { t } = useTranslation("common", { keyPrefix: "users-list" });
  const { selected, setSelected } = useModal();
  const {
    searchText: { get: searchText },
    page: { get: page },
    createdBy: { get: createdBy },
  } = useContext(ListContext);
  const context = useContext(UserContext);

  // Local state
  const [isDeleting, setIsDeleting] = useState(false);
  const [listData, setListData] = useState();
  const [loadingMessage, setLoadingMessage] = useState(
    t("loading-messages.loading-users")
  );

  // Delete call
  // todo change delete from groups to users
  const [
    DeleteV1ScreenGroups,
    { isSuccess: isDeleteSuccess, error: isDeleteError },
  ] = useDeleteV1ScreenGroupsByIdMutation();

  // Get method
  // todo change get from groups to users
  const {
    data,
    error: usersGetError,
    isLoading,
    refetch,
  } = useGetV1ScreenGroupsQuery({
    page,
    order: { createdAt: "desc" },
    title: searchText,
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

  /** Deletes multiple users. */
  useEffect(() => {
    if (isDeleting && selected.length > 0) {
      const userToDelete = selected[0];
      setSelected(selected.slice(1));
      const userToDeleteId = idFromUrl(userToDelete.id);
      DeleteV1ScreenGroups({ id: userToDeleteId });
    }
  }, [isDeleting, isDeleteSuccess]);

  // Sets success messages in local storage, because the page is reloaded
  useEffect(() => {
    if (isDeleteSuccess && selected.length === 0) {
      displaySuccess(t("success-messages.user-delete"));
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

  // Display error on unsuccessful deletion
  useEffect(() => {
    if (isDeleteError) {
      setIsDeleting(false);
      displayError(t("error-messages.user-delete-error"), isDeleteError);
    }
  }, [isDeleteError]);

  /** Starts the deletion process. */
  const handleDelete = () => {
    setIsDeleting(true);
    setLoadingMessage(t("loading-messages.deleting-user"));
  };

  // The columns for the table.
  const columns = UserColumns({ handleDelete });

  // Error with retrieving list of users
  useEffect(() => {
    if (usersGetError) {
      displayError(t("error-messages.users-load-error"), usersGetError);
    }
  }, [usersGetError]);

  return (
    <>
      <ContentHeader
        title={t("header")}
        newBtnTitle={t("create-new-user")}
        newBtnLink="/users/create"
      />
      <ContentBody>
        <>
          {listData && (
            <List
              columns={columns}
              totalItems={listData["hydra:totalItems"]}
              data={listData["hydra:member"]}
              handleDelete={handleDelete}
              deleteSuccess={isDeleteSuccess || false}
              isLoading={isLoading || isDeleting}
              loadingMessage={loadingMessage}
            />
          )}
        </>
      </ContentBody>
    </>
  );
}

export default UsersList;
