import { React, useState } from "react";
import PropTypes from "prop-types";
import { Tabs, Tab } from "react-bootstrap";
import { createGridArea, createGrid } from "os2display-grid-generator";
import PlaylistDragAndDrop from "../playlist-drag-and-drop/playlist-drag-and-drop";
import "./grid.scss";
/**
 * The grid generator component.
 *
 * @param {object} props
 * Props.
 * @param {object} props.grid
 * The grid to generate.
 * @param {Function} props.handleInput
 * A callback on select in multiselect
 * @param {object} props.selectedData
 * The selected data for the multidropdown.
 * @param {object} props.regions
 * The regions in the grid.
 * @param {string} props.layout
 * Either "horizontal" or "vertical", has styling associated
 * @returns {object}
 * The component.
 */
function GridGenerationAndSelect({
  grid,
  layout,
  regions,
  handleInput,
  selectedData,
}) {
  const [key, setKey] = useState("region1");
  const gridClasses = `grid ${layout}`;
  // Rows and columns in grid defaults to 1.
  const configColumns = grid?.columns || 1;
  const configRows = grid?.rows || 1;
  const gridTemplateAreas = {
    gridTemplateAreas: createGrid(configColumns, configRows),
  };

  /**
   * @param {object} props
   * the props.
   * @param {object} props.target
   * event target
   */
  function handleChange({ target }) {
    const localTarget = target.value.map((value) => {
      return {
        region: target.id,
        ...value,
      };
    });
    handleInput({ target: { value: localTarget, id: "playlists" } });
  }
  return (
    <>
      <div className={gridClasses} style={gridTemplateAreas}>
        {regions &&
          regions.map((data) => (
            <div
              key={data.id}
              className={key === data.id ? "grid-item selected" : "grid-item "}
              style={{ gridArea: createGridArea(data.gridArea) }}
            >
              {data.name}
            </div>
          ))}
      </div>
      <Tabs
        defaultActiveKey="region1"
        id="uncontrolled-tab-example"
        activeKey={key}
        onSelect={(k) => setKey(k)}
      >
        {regions &&
          regions.map((data) => (
            <Tab
              style={{ backgroundColor: "beige" }}
              key={data.id}
              eventKey={data.id}
              title={data.name}
            >
              <PlaylistDragAndDrop
                id="playlist_drag_and_drop"
                handleChange={handleChange}
                formId={data.id}
                data={selectedData.filter(
                  (playlistData) => playlistData.region === data.id
                )}
              />
            </Tab>
          ))}
      </Tabs>
    </>
  );
}

GridGenerationAndSelect.propTypes = {
  grid: PropTypes.shape({ columns: PropTypes.number, rows: PropTypes.number })
    .isRequired,
  selectedData: PropTypes.arrayOf(
    PropTypes.shape({ value: PropTypes.number, label: PropTypes.string })
  ).isRequired,
  layout: PropTypes.string.isRequired,
  handleInput: PropTypes.func.isRequired,
  regions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      name: PropTypes.string,
      gridArea: PropTypes.arrayOf(PropTypes.string),
    })
  ).isRequired,
};

export default GridGenerationAndSelect;
