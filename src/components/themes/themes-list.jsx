import { React, useState, useEffect, useContext } from "react";
import { useTranslation } from "react-i18next";
import List from "../util/list/list";
import idFromUrl from "../util/helpers/id-from-url";
import useModal from "../../context/modal-context/modal-context-hook";
import UserContext from "../../context/user-context";
import ContentHeader from "../util/content-header/content-header";
import ListContext from "../../context/list-context";
import ContentBody from "../util/content-body/content-body";
import getThemesColumns from "./themes-columns";
import {
  displayError,
  displaySuccess,
} from "../util/list/toast-component/display-toast";
import {
  useGetV2ThemesQuery,
  useDeleteV2ThemesByIdMutation,
} from "../../redux/api/api.generated.ts";

/**
 * The themes list component.
 *
 * @returns {object} The themes list
 */
function ThemesList() {
  const { t } = useTranslation("common", { keyPrefix: "themes-list" });
  const context = useContext(UserContext);
  const { selected, setSelected } = useModal();

  // Local state
  const [isDeleting, setIsDeleting] = useState(false);
  const [listData, setListData] = useState();
  const [loadingMessage, setLoadingMessage] = useState(
    t("loading-messages.loading-themes")
  );

  const {
    searchText: { get: searchText },
    page: { get: page },
    createdBy: { get: createdBy },
  } = useContext(ListContext);

  // Delete call
  const [DeleteV2Themes, { isSuccess: isDeleteSuccess, error: isDeleteError }] =
    useDeleteV2ThemesByIdMutation();

  const {
    data,
    error: themesGetError,
    isLoading,
    refetch,
  } = useGetV2ThemesQuery({
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

  /** Deletes multiple themes. */
  useEffect(() => {
    if (isDeleting && selected.length > 0) {
      if (isDeleteSuccess) {
        displaySuccess(t("success-messages.theme-delete"));
      }
      const themeToDelete = selected[0];
      setSelected(selected.slice(1));
      const themeToDeleteId = idFromUrl(themeToDelete.id);
      DeleteV2Themes({ id: themeToDeleteId });
    }
  }, [isDeleting, isDeleteSuccess]);

  // Display success messages
  useEffect(() => {
    if (isDeleteSuccess && selected.length === 0) {
      displaySuccess(t("success-messages.theme-delete"));
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
      displayError(t("error-messages.theme-delete-error"), isDeleteError);
    }
  }, [isDeleteError]);

  /** Starts the deletion process. */
  const handleDelete = () => {
    setIsDeleting(true);
    setLoadingMessage(t("loading-messages.deleting-theme"));
  };

  // The columns for the table.
  const columns = getThemesColumns({
    handleDelete,
    disableCheckbox: ({ onNumberOfSlides }) => onNumberOfSlides > 0,
    disableDelete: ({ onNumberOfSlides }) => onNumberOfSlides > 0,
  });

  // Error with retrieving list of themes
  useEffect(() => {
    if (themesGetError) {
      displayError(t("error-messages.themes-load-error"), themesGetError);
    }
  }, [themesGetError]);

  return (
    <div className="p-3">
      <ContentHeader
        title={t("header")}
        newBtnTitle={t("create-new-theme")}
        newBtnLink="/themes/create"
      />
      {data && data["hydra:member"] && (
        <ContentBody>
          <>
            {listData && (
              <List
                columns={columns}
                totalItems={listData["hydra:totalItems"]}
                data={listData["hydra:member"]}
                handleDelete={handleDelete}
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

export default ThemesList;
