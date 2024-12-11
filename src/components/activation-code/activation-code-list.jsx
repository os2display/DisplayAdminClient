import { React, useEffect, useState, useContext } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Button } from "react-bootstrap";
import List from "../util/list/list";
import ListContext from "../../context/list-context";
import UserContext from "../../context/user-context";
import useModal from "../../context/modal-context/modal-context-hook";
import { ActivationCodeColumns } from "./activation-code-columns";
import ContentHeader from "../util/content-header/content-header";
import ContentBody from "../util/content-body/content-body";
import idFromUrl from "../util/helpers/id-from-url";
import {
  displaySuccess,
  displayError,
} from "../util/list/toast-component/display-toast";
import {
  api,
  useDeleteV2UserActivationCodesByIdMutation,
  useGetV2UserActivationCodesQuery,
} from "../../redux/api/api.generated.ts";

/**
 * The Activation Code list component.
 *
 * @returns {object} The users list.
 */
function ActivationCodeList() {
  const { t } = useTranslation("common", { keyPrefix: "activation-code-list" });
  const { selected, setSelected } = useModal();
  const {
    searchText: { get: searchText },
    page: { get: page },
    createdBy: { get: createdBy },
  } = useContext(ListContext);
  const context = useContext(UserContext);

  // Local state
  const [items, setItems] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [listData, setListData] = useState();
  const [loadingMessage, setLoadingMessage] = useState(
    t("loading-messages.loading-activation-code")
  );

  // Remove from tenant call
  const [
    DeleteV2UserActivationCode,
    { isSuccess: isDeleteSuccess, error: isDeleteError },
  ] = useDeleteV2UserActivationCodesByIdMutation();

  // Get method
  const {
    data,
    error: activationCodeGetError,
    isLoading,
    refetch,
  } = useGetV2UserActivationCodesQuery({
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

  /** Deletes multiple codes. */
  useEffect(() => {
    if (isDeleting && selected.length > 0) {
      const codeToDelete = selected[0];
      setSelected(selected.slice(1));
      const codeToDeleteId = idFromUrl(codeToDelete.id);
      DeleteV2UserActivationCode({ id: codeToDeleteId });
    }
  }, [isDeleting, isDeleteSuccess]);

  // Sets success messages in local storage, because the page is reloaded
  useEffect(() => {
    if (isDeleteSuccess && selected.length === 0) {
      displaySuccess(t("success-messages.activation-code-delete"));
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
      displayError(
        t("error-messages.activation-code-delete-error"),
        isDeleteError
      );
    }
  }, [isDeleteError]);

  /** Starts the deletion process. */
  const handleDelete = () => {
    setIsDeleting(true);
    setLoadingMessage(t("loading-messages.deleting-activation-code"));
  };

  // Error with retrieving list of users
  useEffect(() => {
    if (activationCodeGetError) {
      displayError(
        t("error-messages.activation-code-load-error"),
        activationCodeGetError
      );
    }
  }, [activationCodeGetError]);

  const dispatch = useDispatch();

  const refreshCallback = (id) => {
    const item = items.filter((e) => e["@id"] === id);

    if (item.length !== 1) {
      return;
    }

    dispatch(
      api.endpoints.postV2UserActivationCodesRefresh.initiate({
        userActivationCodeActivationCode: JSON.stringify({
          activationCode: item[0].code,
        }),
      })
    )
      .then((response) => {
        if (response.data) {
          refetch();
        }
      })
      .catch((err) => {
        displayError(t("error-refreshing-code"), err);
      });
  };

  // The columns for the table.
  const columns = ActivationCodeColumns({ handleDelete });

  columns.push({
    path: "@id",
    dataFunction: (id) => {
      return (
        <Button
          variant="primary"
          className="refresh-activation-code"
          onClick={() => refreshCallback(id)}
        >
          {t("refresh-button")}
        </Button>
      );
    },
    label: "",
  });

  useEffect(() => {
    if (listData) {
      // Set title from code, for use with delete modal.
      const newItems = [...(listData["hydra:member"] ?? [])].map((el) => {
        return {
          ...el,
          title: el.code,
        };
      });

      setItems(newItems);
    }
  }, [listData]);

  return (
    <div className="p-3">
      <ContentHeader
        title={t("header")}
        newBtnTitle={t("create-activation-codes")}
        newBtnLink="/activation/create"
      />
      <ContentBody>
        <>
          {listData && (
            <List
              columns={columns}
              totalItems={listData["hydra:totalItems"]}
              data={items}
              handleDelete={handleDelete}
              deleteSuccess={isDeleteSuccess || false}
              isLoading={isLoading || isDeleting}
              loadingMessage={loadingMessage}
              showCreatedByFilter={false}
              displaySearch={false}
            />
          )}
        </>
      </ContentBody>
    </div>
  );
}

export default ActivationCodeList;
