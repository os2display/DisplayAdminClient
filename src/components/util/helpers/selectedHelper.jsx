/**
 * @param {object} row - the selected row.
 * @param {Array} selectedData - the selected rows.
 * @returns {Array} updated array with currently selected rows.
 */
function selectedHelper(row, selectedData) {
  const id = row["@id"];
  const alreadySelected = selectedData.find((x) => x.id === id);
  if (alreadySelected) {
    selectedData.splice(selectedData.indexOf(alreadySelected), 1);
  } else {
    selectedData.push(row);
  }
  return selectedData;
}

export default selectedHelper;
