import { React, useState } from "react";
import PropTypes from "prop-types";
import { Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import ListButton from "../util/list/list-button";
import InfoModal from "../info-modal/info-modal";
import PlaylistsDropdown from "../util/forms/multiselect-dropdown/playlists/playlists-dropdown";
import DragAndDropTable from "../util/drag-and-drop-table/drag-and-drop-table";

/**
 * An input for forms.
 *
 * @param {string} props
 * the props.
 * @param {string} props.radioGroupName
 * The name of the input
 * @param {string} props.label
 * The label for the input
 * @returns {object}
 * An input.
 */
function PlaylistDragAndDrop({ handleChange, name, data }) {
  const { t } = useTranslation("common");
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [dataStructureToDisplay, setDataStructureToDisplay] = useState();
  const [infoModal, setInfoModal] = useState("");

  /**
   * Opens info modal with either categories or slides.
   *
   * @param {object} props
   * The props
   * @param {Array} props.displayData
   * The data to sum up in the modal
   * @param {string} props.modalTitle
   * The title for the infomodal.
   */
  function openInfoModal({ displayData, modalTitle }) {
    setInfoModal(modalTitle);
    setDataStructureToDisplay(displayData);
    setShowInfoModal(true);
  }

  /**
   * Closes the info modal.
   */
  function onCloseInfoModal() {
    setShowInfoModal(false);
    setDataStructureToDisplay();
  }

  /**
   * Removes playlist from list of playlists, and closes modal.
   *
   * @param {object} props
   * The props.
   * @param {string} props.value
   * The id of the playlist
   */
  function handleRemove({ value }) {
    const indexOfItemToRemove = data
      .map((item) => {
        return item.id;
      })
      .indexOf(value);

    data.splice(indexOfItemToRemove, 1);
    const target = { value: data, id: name };
    handleChange({ target });
  }

  // The columns of the list
  const columns = [
    {
      path: "name",
      label: t("playlist-drag-and-drop.columns.name"),
    },
    {
      content: (displayData) =>
        ListButton(
          openInfoModal,
          {
            displayData: displayData.slides,
            modalTitle: t("playlist-drag-and-drop.info-modal.playlist-slides"),
          },
          displayData.slides?.length,
          displayData.slides?.length === 0
        ),
      path: "slides",
      key: "slides",
      label: t("playlist-drag-and-drop.columns.number-of-slides"),
    },
    {
      content: (displayData) =>
        ListButton(
          openInfoModal,
          {
            displayData: displayData.categories,
            modalTitle: t(
              "playlist-drag-and-drop.info-modal.playlist-categories"
            ),
          },
          displayData.categories?.length,
          displayData.categories?.length === 0
        ),
      path: "categories",
      key: "categories",
      label: t("playlist-drag-and-drop.columns.number-of-categories"),
    },
    {
      path: "onFollowingScreens",
      content: (displayData) =>
        ListButton(
          openInfoModal,
          {
            displayData: displayData.onFollowingScreens,
            modalTitle: t("playlist-drag-and-drop.columns.playlist-screens"),
          },
          displayData.onFollowingScreens.length,
          displayData.onFollowingScreens.length === 0
        ),
      key: "screens",
      label: t("playlists-list.columns.on-screens"),
    },
    {
      key: "edit",
      content: () => (
        <>
          {/* @TODO: make quick edit modal */}
          <Button variant="primary">Quick edit</Button>
        </>
      ),
    },
    {
      key: "delete",
      content: (playlistData) => (
        <Button variant="danger" onClick={() => handleRemove(playlistData)}>
          {t("playlist-drag-and-drop.remove-from-list")}
        </Button>
      ),
    },
  ];

  return (
    <>
      <div className="mb-3">
        <PlaylistsDropdown
          name={name}
          handlePlaylistSelection={handleChange}
          selected={data}
        />
      </div>
      {data.length > 0 && (
        <DragAndDropTable
          columns={columns}
          onDropped={handleChange}
          name={name}
          data={data}
        />
      )}
      <InfoModal
        show={showInfoModal}
        onClose={onCloseInfoModal}
        dataStructureToDisplay={dataStructureToDisplay}
        modalTitle={infoModal}
      />
    </>
  );
}

PlaylistDragAndDrop.propTypes = {
  name: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(
    PropTypes.shape({ value: PropTypes.number, label: PropTypes.string })
  ).isRequired,
  handleChange: PropTypes.func.isRequired,
};

export default PlaylistDragAndDrop;
