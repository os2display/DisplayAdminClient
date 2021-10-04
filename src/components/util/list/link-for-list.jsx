import { React } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

/**
 * A link for the list
 *
 * @param {object} props
 * Props.
 * @param {object} props.data
 * Data data object containing the id of what is being edited.
 * @param {string} props.param
 * The datatypeparam.
 * @param {string} props.label
 * The label.
 * @returns {object}
 * A link for the list.
 */
function LinkForList({ data, param, label }) {
  const id = data["@id"].substring(
    data["@id"].lastIndexOf("/") + 1,
    data["@id"].length
  );
  return (
    <Link className="btn btn-primary" to={`/${param}/${id}`}>
      {label}
    </Link>
  );
}

LinkForList.propTypes = {
  data: PropTypes.shape({ name: PropTypes.string, id: PropTypes.number })
    .isRequired,
  param: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
};

export default LinkForList;
