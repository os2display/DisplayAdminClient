import { React } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import MediaSelector from "./media-selector";
import FormCheckbox from "../../util/forms/form-checkbox";
import FormInput from "../../util/forms/form-input";
import Select from "../../util/forms/select";
import Contacts from "../../util/forms/contacts/contacts";
import RichText from "../../util/forms/rich-text/rich-text";
import FormTable from "../../util/forms/form-table/form-table";

/**
 * Render form elements for content form.
 *
 * @param {object} props - The props.
 * @param {Array} props.data - The data to render in the form element.
 * @param {Function} props.requiredFieldCallback - If the form is required, a
 *   callback to add to validation.
 * @param {Array} props.errors - An error list, if there are validation errors.
 * @param {Function} props.onChange - Callback, if the value of the field changes.
 * @param {object} props.formStateObject - The form state.
 * @param {Function} props.onMediaChange - When media have changed call this function.
 * @param {Array} props.mediaData - Array of loaded media entities.
 * @returns {object} - A form element.
 */
function ContentForm({
  data,
  requiredFieldCallback,
  errors,
  onChange,
  onMediaChange,
  formStateObject,
  mediaData,
}) {
  const { t } = useTranslation("common");

  const getInputImage = (formData) => {
    const field = formStateObject[formData.name];
    let inputImages = null;
    if (Array.isArray(field)) {
      inputImages = [];
      field.forEach((mediaId) => {
        if (Object.prototype.hasOwnProperty.call(mediaData, mediaId)) {
          inputImages.push(mediaData[mediaId]);
        }
      });
    } else if (
      typeof formData === "object" &&
      Object.prototype.hasOwnProperty.call(mediaData, formData.name)
    ) {
      inputImages = [];
      inputImages.push(mediaData[formData.name]);
    }
    return inputImages;
  };

  /**
   * @param {object} formData - The data for form input.
   * @returns {object | string} - Returns a rendered jsx object.
   */
  function renderElement(formData) {
    let returnElement;

    switch (formData.input) {
      case "input":
        if (data.required) {
          requiredFieldCallback(data.name);
        }
        returnElement = (
          <FormInput
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
        if (data.required) {
          requiredFieldCallback(data.name);
        }
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
            onMediaChange={onMediaChange}
            getInputImage={getInputImage}
            name={formData.name}
            formData={formData}
            value={formStateObject[formData.name]}
            onChange={onChange}
            formGroupClasses={formData.formGroupClasses}
          />
        );
        break;
      case "checkbox":
        if (data.required) {
          requiredFieldCallback(data.name);
        }
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
        if (data.required) {
          requiredFieldCallback(data.name);
        }
        returnElement = (
          <h2 className={formData.formGroupClasses}>{formData.text}</h2>
        );
        break;
      // @TODO: This (header-h3) should be possible to create in a more efficient way, in combination with the above.
      case "header-h3":
        if (data.required) {
          requiredFieldCallback(data.name);
        }
        returnElement = (
          <h3 className={formData.formGroupClasses}>{formData.text}</h3>
        );
        break;
      case "textarea":
        if (data.required) {
          requiredFieldCallback(data.name);
        }
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
              <small className="form-text text-muted">
                {formData.helpText}
              </small>
            )}
          </>
        );
        break;
      case "select":
        if (data.required) {
          requiredFieldCallback(data.name);
        }
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
      case "image":
        returnElement = (
          <>
            {formData?.label && (
              <label htmlFor={formData.name} className="form-label">
                {formData.label}
              </label>
            )}

            <MediaSelector
              multiple={data.multipleImages}
              selectedMedia={getInputImage(formData)}
              onSelectedMedia={onMediaChange}
              name={formData.name}
              invalidText={
                data.multipleImages
                  ? t("render-form-element.images-invalid")
                  : t("render-form-element.image-invalid")
              }
              formGroupClasses={formData.formGroupClasses}
            />

            {formData.helpText && (
              <small className="form-text text-muted">
                {formData.helpText}
              </small>
            )}
          </>
        );
        break;
      default:
        returnElement = <></>;
    }

    return returnElement;
  }

  return <>{renderElement(data)}</>;
}

ContentForm.defaultProps = {
  errors: [],
};

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
  requiredFieldCallback: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onMediaChange: PropTypes.func.isRequired,
  mediaData: PropTypes.objectOf(PropTypes.object).isRequired,
};

export default ContentForm;
