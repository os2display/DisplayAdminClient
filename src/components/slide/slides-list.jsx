import { React, useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import CheckboxForList from "../util/list/checkbox-for-list";
import List from "../util/list/list";
import idFromUrl from "../util/helpers/id-from-url";
import selectedHelper from "../util/helpers/selectedHelper";
import DeleteModal from "../delete-modal/delete-modal";
import InfoModal from "../info-modal/info-modal";
import Published from "../util/published";
import LinkForList from "../util/list/link-for-list";
import ListButton from "../util/list/list-button";
import ContentHeader from "../util/content-header/content-header";
import ContentBody from "../util/content-body/content-body";
import TemplateLabelInList from "../util/template-label-in-list";
import {
  displayError,
  displaySuccess,
} from "../util/list/toast-component/display-toast";
import {
  useGetV1SlidesQuery,
  useDeleteV1SlidesByIdMutation,
  useGetV1PlaylistsByIdQuery,
} from "../../redux/api/api.generated";

/**
 * The slides list component.
 *
 * @returns {object} The slides list
 */
function SlidesList() {
  const { t } = useTranslation("common");

  // Local state
  const [isDeleting, setIsDeleting] = useState(false);
  const [sortBy, setSortBy] = useState();
  const [selectedRows, setSelectedRows] = useState([]);
  const [onPlaylists, setOnPlaylists] = useState();
  const [page, setPage] = useState();
  const [totalItems, setTotalItems] = useState(0);
  const [isPublished, setIsPublished] = useState();
  const [slidesToDelete, setSlidesToDelete] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [searchText, setSearchText] = useState();
  const [listData, setListData] = useState([]);
  const [loadingMessage, setLoadingMessage] = useState(
    t("slides-list.loading-messages.loading-slides")
  );

  // Delete call
  const [DeleteV1Slides, { isSuccess: isDeleteSuccess, error: isDeleteError }] =
    useDeleteV1SlidesByIdMutation();

  // Get method
  const {
    data,
    error: slidesGetError,
    isLoading,
    refetch,
  } = useGetV1SlidesQuery({
    page,
    orderBy: sortBy?.path,
    order: sortBy?.order,
    title: searchText,
    published: isPublished,
  });

  useEffect(() => {
    if (data && page) {
      setListData(data["hydra:member"]);
      setTotalItems(data["hydra:totalItems"]);
    }
  }, [data]);

  /** Deletes multiple slides. */
  useEffect(() => {
    if (slidesToDelete.length > 0) {
      // As we are deleting multiple slides, the ui will jump if the "is deleting" value from the hook is used.
      setIsDeleting(true);
      if (isDeleteSuccess) {
        displaySuccess(t("slides-list.success-messages.slide-delete"));
      }
      setLoadingMessage(t("slides-list.loading-messages.deleting-slide"));
      const localSlidesToDelete = [...slidesToDelete];
      const slideToDelete = localSlidesToDelete.splice(0, 1).shift();
      const slideToDeleteId = idFromUrl(slideToDelete["@id"]);
      DeleteV1Slides({ id: slideToDeleteId });
      setSlidesToDelete(localSlidesToDelete);
    }
  }, [slidesToDelete, isDeleteSuccess]);

  // Display success messages
  useEffect(() => {
    if (isDeleteSuccess && slidesToDelete.length === 0) {
      displaySuccess(t("slides-list.success-messages.slide-delete"));
      refetch();
      setIsDeleting(false);
    }
  }, [isDeleteSuccess]);

  // Display error on unsuccessful deletion
  useEffect(() => {
    if (isDeleteError) {
      setIsDeleting(false);
      displayError(
        t("slides-list.error-messages.slide-delete-error", {
          error: isDeleteError.error
            ? isDeleteError.error
            : isDeleteError.data["hydra:description"],
        })
      );
    }
  }, [isDeleteError]);

  /**
   * Sets the selected row in state.
   *
   * @param {object} row The selected row.
   */
  function handleSelected(row) {
    setSelectedRows(selectedHelper(row, [...selectedRows]));
  }

  /** Clears the selected rows. */
  function clearSelectedRows() {
    setSelectedRows([]);
  }

  /**
   * Opens the delete modal
   *
   * @param {object} item The item to delete
   */
  function openDeleteModal(item) {
    if (item) {
      setSelectedRows([{ "@id": item["@id"], title: item.title }]);
    }
    setShowDeleteModal(true);
  }

  /** Deletes slide(s), and closes modal. */
  function handleDelete() {
    setSlidesToDelete(selectedRows);
    clearSelectedRows();
    setShowDeleteModal(false);
  }

  /** Closes the delete modal. */
  function onCloseDeleteModal() {
    clearSelectedRows();
    setShowDeleteModal(false);
  }

  /** @param {Array} playlistData The array of playlists. */
  function openInfoModal(playlistData) {
    setOnPlaylists(playlistData);
    setShowInfoModal(true);
  }

  /** Closes the info modal. */
  function onCloseInfoModal() {
    setShowInfoModal(false);
    setOnPlaylists();
  }

  /**
   * Sets next page.
   *
   * @param {number} pageNumber - The next page.
   */
  function onChangePage(pageNumber) {
    setPage(pageNumber);
  }

  /**
   * Sets is published
   *
   * @param {number} localIsPublished - Whether the slide is published.
   */
  function onIsPublished(localIsPublished) {
    if (localIsPublished === "all") {
      setIsPublished(undefined);
    } else {
      setIsPublished(localIsPublished === "published");
    }
  }

  /**
   * Handles sort.
   *
   * @param {object} localSortBy - How the data should be sorted.
   */
  function onChangeSort(localSortBy) {
    setSortBy(localSortBy);
  }

  /**
   * Handles search.
   *
   * @param {object} localSearchText - The search text.
   */
  function onSearch(localSearchText) {
    setSearchText(localSearchText);
  }

  // The columns for the table.
  const columns = [
    {
      key: "pick",
      label: t("slides-list.columns.pick"),
      content: (d) => (
        <CheckboxForList
          onSelected={() => handleSelected(d)}
          selected={selectedRows.indexOf(d) > -1}
        />
      ),
    },
    {
      path: "title",
      sort: true,
      label: t("slides-list.columns.name"),
    },
    {
      // eslint-disable-next-line react/prop-types
      content: ({ templateInfo }) => (
        <TemplateLabelInList templateInfo={templateInfo} />
      ),
      key: "template",
      label: t("slides-list.columns.template"),
    },
    {
      key: "playlists",
      // eslint-disable-next-line react/prop-types
      content: ({ onPlaylists: localOnPlaylists }) => (
        <ListButton callback={openInfoModal} inputData={localOnPlaylists} />
      ),
      label: t("slides-list.columns.slide-on-playlists"),
    },
    {
      key: "published",
      // eslint-disable-next-line react/prop-types
      content: ({ published }) => <Published published={published} />,
      label: t("slides-list.columns.published"),
    },
    {
      key: "edit",
      content: (d) =>
        LinkForList(d["@id"], "slide/edit", t("slides-list.edit-button")),
    },
    {
      key: "delete",
      content: (d) => (
        <Button
          variant="danger"
          disabled={selectedRows.length > 0}
          onClick={() => openDeleteModal(d)}
        >
          {t("slides-list.delete-button")}
        </Button>
      ),
    },
  ];

  // Error with retrieving list of slides
  useEffect(() => {
    if (slidesGetError) {
      displayError(
        t("slides-list.error-messages.slides-load-error", {
          error: slidesGetError.error
            ? slidesGetError.error
            : slidesGetError.data["hydra:description"],
        })
      );
    }
  }, [slidesGetError]);

  return (
    <>
      <ContentHeader
        title={t("slides-list.header")}
        newBtnTitle={t("slides-list.create-new-slide")}
        newBtnLink="/slide/create"
      />
      {listData && (
        <ContentBody>
          <List
            columns={columns}
            totalItems={totalItems}
            data={listData}
            currentPage={page}
            handlePageChange={onChangePage}
            selectedRows={selectedRows}
            clearSelectedRows={clearSelectedRows}
            handleDelete={openDeleteModal}
            handleSort={onChangeSort}
            handleSearch={onSearch}
            handleIsPublished={onIsPublished}
            displayPublished
            isLoading={isLoading || isDeleting}
            loadingMessage={loadingMessage}
          />
        </ContentBody>
      )}
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
