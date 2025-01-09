import { React } from "react";
import PropTypes from "prop-types";
import FormCheckbox from "../../util/forms/form-checkbox";
import FormInput from "../../util/forms/form-input";
import Select from "../../util/forms/select";
import Contacts from "./contacts/contacts";
import RichText from "../../util/forms/rich-text/rich-text";
import FormTable from "../../util/forms/form-table/form-table";
import FileSelector from "./file-selector";
import StationSelector from "./station/station-selector";
import RadioButtons from "../../util/forms/radio-buttons";
import CheckboxOptions from "../../util/forms/checkbox-options";

/**
 * Render form elements for content form.
 *
 * @param {object} props - The props.
 * @param {Array} props.data - The data to render in the form element.
 * @param {Array} props.errors - An error list, if there are validation errors.
 * @param {Function} props.onChange - Callback, if the value of the field changes.
 * @param {object} props.formStateObject - The form state.
 * @param {Function} props.onFileChange - When file has changed call this function.
 * @param {object} props.mediaData - Array of loaded media entities.
 * @returns {object} Content form element.
 */
function ContentForm({
  data,
  onFileChange,
  formStateObject,
  errors = [],
  onChange = null,
  mediaData = {},
}) {
  const getInputFiles = (field) => {
    const inputFiles = [];

    if (Array.isArray(field)) {
      field.forEach((mediaId) => {
        if (Object.prototype.hasOwnProperty.call(mediaData, mediaId)) {
          inputFiles.push(mediaData[mediaId]);
        }
      });
    }

    return inputFiles;
  };

  /**
   * @param {object} formData - The data for form input.
   * @returns {object | string} - Returns a rendered jsx object.
   */
  function renderElement(formData) {
    let returnElement;
    let defaultMimetypes = null;
    switch (formData.input) {
      case "checkbox-options":
        returnElement = (
          <CheckboxOptions
            formData={formData}
            data={formStateObject}
            onChange={onChange}
          />
        );
        break;
      case "image":
      case "video":
      case "file":
        if (formData.input === "image") {
          defaultMimetypes = ["image/*"];
        } else if (formData.input === "video") {
          defaultMimetypes = ["video/*"];
        }

        returnElement = (
          <div key={formData.key} className={formData.formGroupClasses}>
            {formData?.label && (
              <label htmlFor={formData.name} className="form-label">
                {formData.label}
              </label>
            )}

            <FileSelector
              files={getInputFiles(formStateObject[formData.name])}
              multiple={formData.multipleImages}
              onFilesChange={onFileChange}
              name={formData.name}
              acceptedMimetypes={formData.acceptedMimetypes ?? defaultMimetypes}
            />

            {formData.helpText && <small>{formData.helpText}</small>}
          </div>
        );
        break;
      case "duration":
        returnElement = (
          <FormInput
            name={formData.name}
            min={formData.min}
            type={formData.type}
            label={formData.label}
            helpText={formData.helpText}
            formGroupClasses={formData.formGroupClasses}
            value={
              formStateObject[formData.name]
                ? Math.floor(formStateObject[formData.name] / 1000)
                : 15
            }
            onChange={(value) => {
              const newValue = value.target.value;
              onChange({
                target: { id: "duration", value: Math.max(newValue, 1) * 1000 },
              });
            }}
          />
        );

        break;
      case "input":
        returnElement = (
          <FormInput
            name={formData.name}
            type={formData.type}
            errors={formData.required ? errors : null}
            label={formData.label}
            helpText={formData.helpText}
            value={formStateObject[formData.name] ?? formData?.defaultValue}
            onChange={onChange}
            formGroupClasses={formData.formGroupClasses}
          />
        );

        break;
      case "travel-plan":
        returnElement = (
          <StationSelector
            name={formData.name}
            type={formData.type}
            errors={formData.required ? errors : null}
            label={formData.label}
            helpText={formData.helpText}
            value={formStateObject[formData.name]}
            onChange={onChange}
            formGroupClasses={formData.formGroupClasses}
          />
        );

        break;
      case "rich-text-input":
        returnElement = (
          <RichText
            name={formData.name}
            type={formData.type}
            errors={formData.required ? errors : null}
            label={formData.label}
            helpText={formData.helpText}
            value={formStateObject[formData.name]}
            onChange={onChange}
            formGroupClasses={formData.formGroupClasses}
          />
        );

        break;
      case "radio":
        returnElement = (
          <RadioButtons
            label={formData.label}
            selected={formStateObject[formData.name]}
            radioGroupName={formData.name}
            options={formData.options}
            handleChange={onChange}
          />
        );

        break;
      case "table":
        returnElement = (
          <FormTable
            name={formData.name}
            value={formStateObject[formData.name]}
            onChange={onChange}
            tabsClasses={formData.tableClasses}
          />
        );

        break;
      case "contacts":
        returnElement = (
          <Contacts
            getInputFiles={getInputFiles}
            name={formData.name}
            formData={formData}
            inputContacts={formStateObject[formData.name] ?? []}
            onChange={onChange}
            formGroupClasses={formData.formGroupClasses}
            onFilesChange={onFileChange}
          />
        );

        break;
      case "checkbox":
        returnElement = (
          <FormCheckbox
            label={formData.label}
            onChange={onChange}
            name={formData.name}
            helpText={formData.helpText}
            value={formStateObject[formData.name]}
            formGroupClasses={formData.formGroupClasses}
          />
        );

        break;
      case "header":
        returnElement = (
          <h2 className={formData.formGroupClasses}>{formData.text}</h2>
        );

        break;
      // @TODO: This (header-h3) should be possible to create in a more efficient way, in combination with the above.
      case "header-h3":
        returnElement = (
          <h3 className={formData.formGroupClasses}>{formData.text}</h3>
        );

        break;
      case "textarea":
        returnElement = (
          <>
            {formData?.label && (
              <label htmlFor={formData.name} className="form-label">
                {formData.label}
              </label>
            )}
            <textarea
              onChange={onChange}
              name={formData.name}
              id={formData.name}
              className={`${formData.formGroupClasses} form-control`}
              rows="3"
              defaultValue={formStateObject[formData.name]}
            />
            {formData?.helpText && (
              <small className="form-text d-flex">{formData.helpText}</small>
            )}
          </>
        );

        break;
      case "select":
        returnElement = (
          <Select
            helpText={formData.helpText}
            value={formStateObject[formData.name]}
            name={formData.name}
            options={formData.options}
            onChange={onChange}
            label={formData.label}
            errors={formData.required ? errors : null}
            formGroupClasses={formData.formGroupClasses}
          />
        );

        break;
      default:
        returnElement = <></>;
    }

    return returnElement;
  }

  return <>{renderElement(data)}</>;
}

ContentForm.propTypes = {
  data: PropTypes.shape({
    input: PropTypes.string,
    name: PropTypes.string,
    type: PropTypes.string,
    label: PropTypes.string,
    helpText: PropTypes.string,
    required: PropTypes.bool,
    multipleImages: PropTypes.bool,
  }).isRequired,
  errors: PropTypes.arrayOf(PropTypes.string),
  formStateObject: PropTypes.shape({}).isRequired,
  onChange: PropTypes.func,
  onFileChange: PropTypes.func.isRequired,
  mediaData: PropTypes.shape({
    "@id": PropTypes.string,
  }),
};

export default ContentForm;
