import { React, useEffect, useState } from "react";
import { Button, Col } from "react-bootstrap";
import { useHistory, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import CampaignIcon from "../screen-list/campaign-icon";
import CheckboxForList from "../util/list/checkbox-for-list";
import { Spinner } from "react-bootstrap";
import selectedHelper from "../util/helpers/selectedHelper";
import LinkForList from "../util/list/link-for-list";
import DeleteModal from "../delete-modal/delete-modal";
import List from "../util/list/list";
import InfoModal from "../info-modal/info-modal";
import ListButton from "../util/list/list-button";
import Toast from "../util/toast/toast";
import LiveIcon from "../screen-list/live-icon";
import ContentHeader from "../util/content-header/content-header";
import ContentBody from "../util/content-body/content-body";
import "./screen-list.scss";
import Dimensions from "./dimension";
import idFromUrl from "../util/helpers/id-from-url";
import {
  useGetV1ScreensQuery,
  useDeleteV1ScreensByIdMutation,
  useGetV1ScreenGroupsByIdQuery,
} from "../../redux/api/api.generated";

/**
 * The screen list component.
 *
 * @returns {object}
 *   The screen list.
 */
function ScreenList() {
  const { t } = useTranslation("common");
  const { search } = useLocation();
  const history = useHistory();
  const viewParams = new URLSearchParams(search).get("view");
  const [view, setView] = useState(viewParams ?? "list");
  const [page, setPage] = useState();
  const [selectedRows, setSelectedRows] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [screensToDelete, setScreensToDelete] = useState([]);
  const [inGroups, setInGroups] = useState();
  const [DeleteV1Screens, { isSuccess: isDeleteSuccess }] =
    useDeleteV1ScreensByIdMutation();

  /**
   * @param {Array} groupsData
   * The array of groups.
   */
  function openInfoModal(groupsData) {
    setInGroups(groupsData);
    setShowInfoModal(true);
  }

  /**
   * Closes the info modal.
   */
  function onCloseInfoModal() {
    setShowInfoModal(false);
    setInGroups();
  }

  /**
   * Set the view in url.
   */
  useEffect(() => {
    const params = new URLSearchParams(search);
    params.delete("view");
    params.append("view", view);
    history.replace({ search: params.toString() });
  }, [view]);

  /**
   * Sets the selected row in state.
   *
   * @param {object} data
   * The selected row.
   */
  function handleSelected(data) {
    setSelectedRows(selectedHelper(data, [...selectedRows]));
  }

  /**
   * Opens the delete modal, for deleting row.
   *
   * @param {object} props
   * The props.
   * @param {string} props.title
   * The title of the screen.
   * @param {number} props.id
   * The id of the screen
   */
  function openDeleteModal(item) {
    if (item) {
      setSelectedRows([{ "@id": item["@id"], title: item.title }]);
    }
    setShowDeleteModal(true);
  }

  // The columns for the table.
  const columns = [
    {
      key: "pick",
      label: t("screens-list.columns.pick"),
      content: (data) => (
        <CheckboxForList
          onSelected={() => handleSelected(data)}
          selected={selectedRows.indexOf(data) > -1}
        />
      ),
    },
    {
      path: "live",
      sort: true,
      label: t("screens-list.columns.live"),
      content: (data) => LiveIcon(data),
    },
    {
      path: "title",
      sort: true,
      label: t("screens-list.columns.name"),
    },
    {
      sort: true,
      path: "inScreenGroups",
      content: (data) => ListButton(openInfoModal, [data.inScreenGroups]),
      key: "groups",
      label: t("screens-list.columns.on-groups"),
    },
    {
      path: "size",
      sort: true,
      label: t("screens-list.columns.size"),
    },
    {
      sort: true,
      key: "dimensions",
      content: ({ dimensions }) => Dimensions(dimensions),
      label: t("screens-list.columns.dimensions"),
    },
    {
      sort: true,
      key: "campaign",
      // @TODO: implement overridden by campaing
      label: t("screens-list.columns.campaign"),
      content: (data) => CampaignIcon(data),
    },
    {
      key: "edit",
      content: (data) =>
        LinkForList(data["@id"], "screen/edit", t("screens-list.edit-button")),
    },
    {
      key: "delete",
      content: (data) => (
        <>
          <Button
            variant="danger"
            disabled={selectedRows.length > 0}
            onClick={() => openDeleteModal(data)}
          >
            {t("screens-list.delete-button")}
          </Button>
        </>
      ),
    },
  ];

  /**
   * When the slide is saved, the playlist(s) will be saved.
   * When saved, it redirects to edit slide.
   */
  useEffect(() => {
    if (screensToDelete.length > 0) {
      setIsDeleting(true);
      const screenToDelete = screensToDelete.splice(0, 1).shift();
      const screenToDeleteId = idFromUrl(screenToDelete["@id"]);
      DeleteV1Screens({ id: screenToDeleteId });
    } else if (isDeleteSuccess) {
      window.location.reload(false);
    }
  }, [screensToDelete, isDeleteSuccess]);

  /**
   * Deletes screen, and closes modal.
   */
  function handleDelete() {
    setScreensToDelete(selectedRows);
    clearSelectedRows();
    setShowDeleteModal(false);
  }

  /**
   * Closes the delete modal.
   */
  function onCloseModal() {
    clearSelectedRows();
    setShowDeleteModal(false);
  }

  /**
   * Clears the selected rows.
   */
  function clearSelectedRows() {
    setSelectedRows([]);
  }
  /**
   * Clears the selected rows.
   */
  function onChangePage(pageNumber) {
    setPage(pageNumber);
  }

  const {
    data,
    error: screensGetError,
    isLoading,
  } = useGetV1ScreensQuery({ page: page });

  return (
    <>
      <Toast
        show={screensGetError}
        text={t("screens-list.screens-get-error")}
      />
      <Toast show={isDeleteSuccess} text={t("screens-list.deleted")} />
      <ContentHeader
        title={t("screens-list.header")}
        newBtnTitle={t("screens-list.create-new-screen")}
        newBtnLink="/screen/create"
      />
      <Col md="auto">
        {view === "list" && (
          <Button onClick={() => setView("calendar")}>
            {t("screens-list.change-view-calendar")}
          </Button>
        )}
        {view === "calendar" && (
          <Button onClick={() => setView("list")}>
            {t("screens-list.change-view-list")}
          </Button>
        )}
      </Col>
      <ContentBody>
        <>
          {!(isLoading || isDeleting) && data && data["hydra:member"] && (
            <List
              handlePageChange={onChangePage}
              totalItems={data["hydra:totalItems"]}
              currentPage={page}
              columns={columns}
              selectedRows={selectedRows}
              data={data["hydra:member"]}
              clearSelectedRows={clearSelectedRows}
              withChart={view === "calendar"}
              handleDelete={openDeleteModal}
            />
          )}
          {(isLoading || isDeleting) && <Spinner animation="grow" />}
        </>
      </ContentBody>
      <DeleteModal
        show={showDeleteModal}
        onClose={onCloseModal}
        handleAccept={handleDelete}
        selectedRows={selectedRows}
      />
      <InfoModal
        show={showInfoModal}
        apiCall={useGetV1ScreenGroupsByIdQuery}
        onClose={onCloseInfoModal}
        dataStructureToDisplay={inGroups}
        modalTitle={t("screens-list.info-modal.screen-in-groups")}
      />
    </>
  );
}

export default ScreenList;
