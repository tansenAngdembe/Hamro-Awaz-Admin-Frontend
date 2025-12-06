import React, { useState, useEffect } from "react";
import { MoveLeft } from "lucide-react";
import Select from "react-select";
import Alert from "../alerts/Alert";
import config from "../../utils/config";

const ReusableForm = ({
  title,
  description,
  fields,
  onSubmit,
  onReset,
  onBack,
  submitButtonText = "Submit",
  resetButtonText = "Reset",
  showBackButton = true,
  showResetButton = true,
  loading = false,
  initialData = {},
  errorMessage = "",
  successMessage = "",
  onErrorClose,
  onSuccessClose,
  customSelectStyles = {},
  className = "",
  gridCols = "lg:grid-cols-4 md:grid-cols-3",
  customValidation,
}) => {
  const [formData, setFormData] = useState(initialData);
  const [images, setImages] = useState([]);
  const BASE_URL = config.fileURL;

  useEffect(() => {
    if(!window.location.url === "vendor/create"){
      setFormData(initialData);

    }
  }, [initialData]);

  const defaultSelectStyles = {
    control: (provided, state) => ({
      ...provided,
      height: 40,
      minHeight: 40,
      fontSize: "14px",
      borderRadius: "0px",
      borderColor: state.isFocused ? "#3b82f6" : "#9ca3af",
      boxShadow: state.isFocused ? "0 0 0 2px rgba(59, 130, 246, 0.5)" : "none",
      "&:hover": {
        borderColor: "#3b82f6",
      },
      paddingLeft: "0.5rem",
      backgroundColor: "#fff",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#000",
      fontSize: "14px",
    }),
    valueContainer: (provided) => ({
      ...provided,
      padding: "0px",
    }),
    input: (provided) => ({
      ...provided,
      margin: "0px",
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      padding: "4px",
    }),
    clearIndicator: (provided) => ({
      ...provided,
      padding: "4px",
    }),
    indicatorSeparator: () => ({
      display: "none",
    }),
    menu: (provided) => ({
      ...provided,
      fontSize: "14px",
      zIndex: 20,
    }),
    ...customSelectStyles,
  };

  const handleChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (name, checked) => {
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };


useEffect(() => {
  const imageField = initialData?.imageUrls;

  if (Array.isArray(imageField)) {
    setImages(
      imageField.map((url) => ({
        preview: url.startsWith("http") ? url : `${BASE_URL}${url}`,
        name: "existing",
        isExisting: true,
      }))
    );
  }
}, [initialData]);



  const handleImageUpload = (e, fieldName, maxImages = 4) => {
    const files = Array.from(e.target.files).slice(
      0,
      maxImages - images.length
    );
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
    }));

    const updatedImages = [...images, ...newImages];
    setImages(updatedImages);

    handleChange(
      fieldName,
      updatedImages.map((img) => img.file)
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const isFormValid = () => {
    if (customValidation) {
      return customValidation(formData);
    }

    // Default validation - check required fields
    return fields.every((field) => {
      if (field.required) {
        const value = formData[field.name];
        return value && value.toString().trim() !== "";
      }
      return true;
    });
  };

  const handleReset = () => {
    setFormData(initialData);
    setImages([]);
    if (onReset) onReset();
  };

  const handleRemoveImage = (index, fieldName) => {
    setImages((prev) => prev.filter((_, i) => i !== index));

    setFormData((prev) => ({
      ...prev,
      [fieldName]: prev[fieldName].filter((_, i) => i !== index)
    }));
  };



  const renderField = (field) => {
    const {
      name,
      label,
      type,
      placeholder,
      options = [],
      required = false,
      disabled = false,
      rows = 4,
      cols = 4,
      maxImages = 4,
      onChange,
      colSpan = "",
      validation,
      helpText,
      ...fieldProps
    } = field;

    const baseInputClass =
      "w-full h-[40px] text-[14px] border border-gray-400 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500";
    const baseSelectClass =
      "w-full h-[40px] text-[14px] border border-gray-400 px-2 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500";

    const handleFieldChange = (value) => {
      handleChange(name, value);
      if (onChange) onChange(value, formData);
    };

    switch (type) {
      case "text":
      case "email":
      case "number":
      case "time":
        return (
          <div>
            <input
              type={type}
              name={name}
              value={formData[name] || ""}
              placeholder={placeholder}
              onChange={(e) => handleFieldChange(e.target.value)}
              className={baseInputClass}
              required={required}
              disabled={disabled}
              {...fieldProps}
            />
            {helpText && (
              <small className="text-gray-500 mt-1 block">{helpText}</small>
            )}
          </div>
        );

      case "textarea":
        return (
          <textarea
            name={name}
            value={formData[name] || ""}
            onChange={(e) => handleFieldChange(e.target.value)}
            rows={rows}
            cols={cols}
            placeholder={placeholder}
            className="w-full text-[14px] border border-gray-400 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required={required}
            disabled={disabled}
            {...fieldProps}
          />
        );

      case "select":
        return (
          <select
            name={name}
            value={formData[name] || ""}
            onChange={(e) => handleFieldChange(e.target.value)}
            className={baseSelectClass}
            required={required}
            disabled={disabled}
            {...fieldProps}
          >
            <option value="" disabled>
              {placeholder || `Select ${label}`}
            </option>
            {options.map((option, index) => (
              <option key={index} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case "react-select":
        return (
          <Select
            options={options}
            value={options.find((opt) => opt.value === formData[name]) || null}
            onChange={(selectedOption) =>
              handleFieldChange(selectedOption ? selectedOption.value : "")
            }
            placeholder={placeholder || `Select ${label}`}
            isClearable
            styles={defaultSelectStyles}
            isDisabled={disabled}
            {...fieldProps}
          />
        );

      case "checkbox":
        return (
          <div
            className={`flex items-center gap-2 ${colSpan ? colSpan : "min-w-[180px]"
              }`}
          >
            <input
              type="checkbox"
              name={name}
              checked={formData[name] || false}
              onChange={(e) => handleCheckboxChange(name, e.target.checked)}
              disabled={disabled}
              {...fieldProps}
            />
            <label className="text-[15px] font-medium text-gray-700">
              {label}
            </label>
          </div>
        );

      case "file":
        return (
          <div>
            <div className="inline-flex items-start gap-2 rounded border border-gray-300 bg-transparent p-2">
              {images.length < maxImages && (
                <div
                  onClick={() => document.getElementById(`${name}Input`).click()}
                  className="w-24 h-24 cursor-pointer border-2 border-dashed border-gray-400 rounded flex items-center justify-center text-2xl text-gray-500"
                >
                  +
                </div>
              )}

              {images.map((img, index) => (
                <div
                  key={index}
                  className="relative w-24 h-24 bg-gray-100 text-xs text-center p-1 rounded flex items-center justify-center overflow-hidden"
                >
                  {/* Remove button */}
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index, name)}
                    className="absolute top-1 right-1 bg-black bg-opacity-50 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full hover:bg-opacity-80"
                  >
                    ✕
                  </button>

                  <img
                    src={img.preview}
                    alt="preview"
                    className="w-full h-full object-cover rounded"
                  />
                </div>
              ))}

              <input
                id={`${name}Input`}
                type="file"
                accept="image/*"
                multiple
                hidden
                onChange={(e) => handleImageUpload(e, name, maxImages)}
                disabled={disabled}
                {...fieldProps}
              />
            </div>
          </div>
        );


      case "checkbox-group":
        return (
          <div className={`flex flex-wrap gap-x-6 gap-y-3 ${colSpan}`}>
            {options.map(({ name: checkboxName, label: checkboxLabel }) => (
              <div
                key={checkboxName}
                className="flex items-center gap-2 min-w-[180px]"
              >
                <input
                  type="checkbox"
                  name={checkboxName}
                  checked={formData[checkboxName] || false}
                  onChange={(e) =>
                    handleCheckboxChange(checkboxName, e.target.checked)
                  }
                  disabled={disabled}
                />
                <label className="text-[15px] font-medium text-gray-700">
                  {checkboxLabel}
                </label>
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`bg-white shadow-md rounded-md p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center mb-4">
        <div className="flex items-center gap-2">
          {showBackButton && onBack && (
            <MoveLeft onClick={onBack} className="cursor-pointer" />
          )}
          <h2 className="text-xl font-semibold">{title}</h2>
        </div>
      </div>

      {description && (
        <p className="text-sm text-gray-500 mb-4">{description}</p>
      )}

      <div className="w-full h-px bg-gray-200 mb-4"></div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className={`grid grid-cols-1 ${gridCols} gap-6`}>
          {fields.map((field, index) => {
            const { name, label, type, colSpan = "", ...fieldProps } = field;

            if (type === "checkbox-group") {
              return (
                <div key={index} className={colSpan || "col-span-full mt-1"}>
                  {renderField(field)}
                </div>
              );
            }

            return (
              <div key={index} className={colSpan}>
                {type !== "checkbox" && (
                  <label className="block text-[15px] font-medium text-gray-700 mb-1">
                    {label}
                    {field.required && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </label>
                )}
                {renderField(field)}
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-6">
          <button
            type="submit"
            disabled={loading || !isFormValid()}
            className={`bg-[#1a963d] text-white font-medium px-5 py-2 transition-colors
            ${loading || !isFormValid()
                ? "opacity-60 cursor-not-allowed"
                : "hover:bg-[#18b143] cursor-pointer"
              }`}
          >
            {loading ? "Processing..." : submitButtonText}
          </button>

          {showResetButton && (
            <button
              type="button"
              onClick={handleReset}
              className="border border-[#1a963d] text-[#1a963d] hover:bg-[#18b143] hover:text-white font-medium px-5 py-2 transition-colors cursor-pointer"
            >
              {resetButtonText}
            </button>
          )}
        </div>
      </form>

      {/* Error Alert */}
      {errorMessage && (
        <Alert
          type="error"
          message={errorMessage}
          duration={4000}
          onClose={onErrorClose}
        />
      )}

      {/* Success Alert */}
      {successMessage && (
        <Alert
          type="success"
          message={successMessage}
          duration={2000}
          onClose={onSuccessClose}
        />
      )}
    </div>
  );
};

export default ReusableForm;
