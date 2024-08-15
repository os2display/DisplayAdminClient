import { React, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { FormGroup } from "react-bootstrap";
import { useTranslation } from "react-i18next";

/**
 * @param {object} props The props.
 * @param {string} props.name The name of the select component.
 * @param {string} props.label The label of the select component.
 * @param {string} props.value The selected value.
 * @param {Array} props.options The options for the select component.
 * @param {Function} props.onChange The callback for when something is selected.
 * @param {Array} props.errors A list of errors, or null.
 * @param {string} props.errorText The string to display on error.
 * @param {string} props.helpText The helptext.
 * @param {string} props.formGroupClasses The classes for the form-group element.
 * @param {boolean} props.isRequired If the select is required.
 * @param {boolean} props.allowNull Add null option.
 * @returns {object} The select component.
 */
function Select({
  name,
  label,
  options,
  onChange,
  errors = null,
  errorText = "",
  helpText = "",
  value = "",
  formGroupClasses = "",
  isRequired = false,
  allowNull = true,
}) {
  const { t } = useTranslation("common");
  const textOnError = errorText || t("select.validation-text");
  const [error, setError] = useState();
  const [classes, setClasses] = useState("form-select");
  const required = !!errors;

  /** Handle errors. */
  useEffect(() => {
    if (errors && errors.includes(name)) {
      setError(true);
      setClasses("form-select is-invalid");
    }
  }, [errors]);

  const getValue = (option) => {
    if (option?.value !== undefined) {
      return option.value;
    }
    if (option["@id"] !== undefined) {
      return option["@id"];
    }
    return null;
  };

  return (
    <FormGroup className={formGroupClasses}>
      <label htmlFor={name} className="form-label">
        {label}
        {required && " *"}
      </label>
      <select
        className={classes}
        required={isRequired}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
      >
        {allowNull && (
          <option disabled value="">
            {t("select.nothing-selected")}
          </option>
        )}
        {options.map((option) => (
          <option value={getValue(option)} key={option.key || option["@id"]}>
            {option.title}
          </option>
        ))}
      </select>
      {helpText && <small>{helpText}</small>}
      {error && <div className="invalid-feedback">{textOnError}</div>}
    </FormGroup>
  );
}

Select.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      title: PropTypes.string.isRequired,
    })
  ).isRequired,
  errors: PropTypes.arrayOf(PropTypes.string),
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  isRequired: PropTypes.bool,
  errorText: PropTypes.string,
  helpText: PropTypes.string,
  formGroupClasses: PropTypes.string,
  allowNull: PropTypes.bool,
};

export default Select;
