import { React, Fragment } from "react";
import PropTypes from "prop-types";
import get from "lodash.get";
import ColumnProptypes from "../../proptypes/column-proptypes";
import SelectedRowsProptypes from "../../proptypes/selected-rows-proptypes";

/**
 * @param {object} props The props.
 * @param {Array} props.columns The columns for the table.
 * @param {Array} props.selectedRows The selected rows array.
 * @param {Array} props.data The data to display.
 * @returns {object} The table body.
 */
function TableBody({ columns, selectedRows, data }) {
  /**
   * Renders a cell with the content received.
   *
   * @param {object} item The item to render.
   * @param {object} column The column to render.
   * @returns {object | string} Returns a rendered jsx object, or the path.
   */
  function renderCell(item, column) {
    if (column.content) {
      return column.content(item);
    }
    return get(item, column.path);
  }

  /**
   * Styles a row if it is selected.
   *
   * @param {object} item The data item.
   * @returns {string} Class for styling.
   */
  function isRowSelected(item) {
    let classes = "";
    if (selectedRows.find((x) => x.id === item.id)) classes += "bg-light";
    return classes;
  }

  return (
    <tbody>
      {data.map((item) => (
        <Fragment key={item["@id"]}>
          <tr className={isRowSelected(item)}>
            {columns.map((column) => (
              <td key={`${item["@id"]}${column.path || column.key}`}>
                {renderCell(item, column)}
              </td>
            ))}
          </tr>
        </Fragment>
      ))}
    </tbody>
  );
}

TableBody.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({ name: PropTypes.string, "@id": PropTypes.string })
  ).isRequired,
  columns: ColumnProptypes.isRequired,
  selectedRows: SelectedRowsProptypes.isRequired,
};

export default TableBody;
