import { React, useState } from "react";
import { Button, Spinner, Toast } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import CheckboxForList from "../util/list/checkbox-for-list";
import List from "../util/list/list";
import selectedHelper from "../util/helpers/selectedHelper";
import DeleteModal from "../delete-modal/delete-modal";
import InfoModal from "../info-modal/info-modal";
import Published from "./published";
import LinkForList from "../util/list/link-for-list";
import ListButton from "../util/list/list-button";
import ContentHeader from "../util/content-header/content-header";
import ContentBody from "../util/content-body/content-body";
import TemplateLabelInList from "./template-label-in-list";
import {
  useGetV1SlidesQuery,
  useDeleteV1SlidesByIdMutation,
  useGetV1PlaylistsByIdQuery,
} from "../../redux/api/api.generated";
/**
 * The slides list component.
 *
 * @returns {object}
 * The SlidesList
 */
function SlidesList() {
  const { t } = useTranslation("common");
  const [selectedRows, setSelectedRows] = useState([]);
  const [onPlaylists, setOnPlaylists] = useState();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [DeleteV1Slides, { isSuccess: isDeleteSuccess }] =
    useDeleteV1SlidesByIdMutation();

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
   * The title of the slide.
   * @param {number} props.id
   * The id of the slide
   */
  function openDeleteModal({ id, title }) {
    setSelectedRows([{ id, title }]);
    setShowDeleteModal(true);
  }

  /**
   * @param {Array} playlistData
   * The array of playlists.
   */
  function openInfoModal(playlistData) {
    setOnPlaylists(playlistData);
    setShowInfoModal(true);
  }

  // The columns for the table.
  const columns = [
    {
      key: "pick",
      label: t("slides-list.columns.pick"),
      content: (data) => (
        <CheckboxForList
          onSelected={() => handleSelected(data)}
          selected={selectedRows.indexOf(data) > -1}
        />
      ),
    },
    {
      path: "title",
      sort: true,
      label: t("slides-list.columns.name"),
    },
    {
      content: (data) => TemplateLabelInList(data),
      sort: true,
      key: "template",
      label: t("slides-list.columns.template"),
    },
    {
      key: "playlists",
      sort: true,
      content: (data) => ListButton(openInfoModal, data.onPlaylists),
      label: t("slides-list.columns.slide-on-playlists"),
    },
    {
      key: "published",
      sort: true,
      content: (data) => Published(data),
      label: t("slides-list.columns.published"),
    },
    {
      key: "quick-edit",
      content: () => (
        <>
          {/* @TODO: make quick edit modal */}
          <Button variant="primary">Quick edit</Button>
        </>
      ),
    },
    {
      key: "preview",
      content: () => (
        <Button variant="secondary">{t("slides-list.columns.preview")}</Button>
      ),
    },
    {
      key: "edit",
      content: (data) =>
        LinkForList(data["@id"], "slide/edit", t("slides-list.edit-button")),
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
            {t("slides-list.delete-button")}
          </Button>
        </>
      ),
    },
  ];

  /**
   * Deletes slide, and closes modal.
   */
  function handleDelete() {
    const [first] = selectedRows;
    DeleteV1Slides({ id: first.id });
    setSelectedRows([]);
    setShowDeleteModal(false);
  }

  /**
   * Closes the delete modal.
   */
  function onCloseDeleteModal() {
    setSelectedRows([]);
    setShowDeleteModal(false);
  }

  /**
   * Closes the info modal.
   */
  function onCloseInfoModal() {
    setShowInfoModal(false);
    setOnPlaylists();
  }

  /**
   * Clears the selected rows.
   */
  function clearSelectedRows() {
    setSelectedRows([]);
  }

  const {
    data,
    error: slidesGetError,
    isLoading,
  } = useGetV1SlidesQuery({
    page: 1,
  });

  return (
    <>
      <Toast show={slidesGetError} text={t("slides-list.slides-get-error")} />
      <Toast show={isDeleteSuccess} text={t("slides-list.deleted")} />
      <ContentHeader
        title={t("slides-list.header")}
        newBtnTitle={t("slides-list.create-new-slide")}
        newBtnLink="/slide/create"
      />
      <ContentBody>
        {!isLoading && data && data["hydra:member"] && (
          <List
            columns={columns}
            selectedRows={selectedRows}
            data={data["hydra:member"]}
            clearSelectedRows={clearSelectedRows}
          />
        )}
        {isLoading && <Spinner animation="grow" />}
      </ContentBody>

      <DeleteModal
        show={showDeleteModal}
        onClose={onCloseDeleteModal}
        handleAccept={handleDelete}
        selectedRows={selectedRows}
      />
      <InfoModal
        show={showInfoModal}
        apiCall={useGetV1PlaylistsByIdQuery}
        onClose={onCloseInfoModal}
        dataStructureToDisplay={onPlaylists}
        modalTitle={t("slides-list.info-modal.slide-on-playlists")}
      />
    </>
  );
}

export default SlidesList;
