import React, { useState, useEffect } from "react";
import { MoveLeft } from "lucide-react";
import Select from "react-select";
import Alert from "../alerts/Alert";
import config from "../../utils/config";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useRef } from "react";
import { useMapEvents } from "react-leaflet";


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
    if (!window.location.url === "authority/create") {
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

  const LocationPicker = ({ onSelect }) => {
    useMapEvents({
      click(e) {
        onSelect(e.latlng.lat, e.latlng.lng);
      },
    });

    return null;
  };

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
      "w-full h-11 text-sm rounded-lg border border-gray-200 bg-white px-3 focus:outline-none focus:ring-2 focus:ring-[#1a963d]/40 focus:border-[#1a963d] transition";

    const baseSelectClass =
      "w-full h-11 text-sm rounded-lg border border-gray-200 bg-white px-3 focus:outline-none focus:ring-2 focus:ring-[#1a963d]/40 focus:border-[#1a963d] transition";

    const handleFieldChange = (value) => {
      handleChange(name, value);
      if (onChange) onChange(value, formData);
    };
    const mapRef = useRef(null);


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
              <p className="text-xs text-gray-500 mt-1">{helpText}</p>
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
            className="w-full text-sm rounded-lg border border-gray-200 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1a963d]/40 focus:border-[#1a963d] transition"
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
          <div className={`flex items-center gap-3 ${colSpan || "min-w-[180px]"}`}>
            <input
              type="checkbox"
              name={name}
              checked={formData[name] || false}
              onChange={(e) => handleCheckboxChange(name, e.target.checked)}
              disabled={disabled}
              className="h-4 w-4 rounded border-gray-300 text-[#1a963d] focus:ring-[#1a963d]"
              {...fieldProps}
            />
            <label className="text-sm font-medium text-gray-700">
              {label}
            </label>
          </div>
        );

      case "file":
        return (
          <div className="flex flex-wrap gap-3">
            {images.length < maxImages && (
              <div
                onClick={() => document.getElementById(`${name}Input`).click()}
                className="w-24 h-24 cursor-pointer rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 hover:border-[#1a963d] hover:text-[#1a963d] transition"
              >
                +
              </div>
            )}

            {images.map((img, index) => (
              <div
                key={index}
                className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200 shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index, name)}
                  className="absolute top-1 right-1 bg-black/60 text-white w-5 h-5 flex items-center justify-center rounded-full text-xs hover:bg-black"
                >
                  ✕
                </button>
                <img
                  src={img.preview}
                  alt="preview"
                  className="w-full h-full object-cover"
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
        );

      case "checkbox-group":
        return (
          <div className={`flex flex-wrap gap-x-6 gap-y-3 ${colSpan}`}>
            {options.map(({ name: checkboxName, label: checkboxLabel }) => (
              <div key={checkboxName} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name={checkboxName}
                  checked={formData[checkboxName] || false}
                  onChange={(e) =>
                    handleCheckboxChange(checkboxName, e.target.checked)
                  }
                  disabled={disabled}
                  className="h-4 w-4 rounded border-gray-300 text-[#1a963d]"
                />
                <label className="text-sm font-medium text-gray-700">
                  {checkboxLabel}
                </label>
              </div>
            ))}
          </div>
        );

      case "map":
        return (
          <div className="w-full">
            <div className="h-[520px] rounded-xl overflow-hidden border border-gray-200">
              <MapContainer
                center={[27.7172, 85.324]} // Nepal default
                zoom={7}
                className="h-full w-full"
                // whenCreated={(map) => (mapRef.current = map)}
               
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationPicker
                  onSelect={(lat, lng) => {
                    handleChange("latitude", lat);
                    handleChange("longitude", lng);
                  }}
                />
                {formData.latitude && formData.longitude && (
                  <Marker position={[formData.latitude, formData.longitude]} />
                )}
              </MapContainer>
            </div>

            {/* Display selected coords (read-only UI) */}
            <div className="grid grid-cols-2 gap-4 mt-3">
              <div className="text-sm text-gray-600">
                <span className="font-medium">Latitude:</span>{" "}
                {formData.latitude || "-"}
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-medium">Longitude:</span>{" "}
                {formData.longitude || "-"}
              </div>
            </div>

            {helpText && (
              <p className="text-xs text-gray-500 mt-2">{helpText}</p>
            )}
          </div>
        );


      default:
        return null;
    }
  };


  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 ${className}`}>
      <div className="flex items-center gap-3 mb-3">
        {showBackButton && onBack && (
          <MoveLeft onClick={onBack} className="cursor-pointer text-gray-600 hover:text-black" />
        )}
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
      </div>

      {description && (
        <p className="text-sm text-gray-500 mb-4">{description}</p>
      )}

      <div className="border-b border-gray-200 mb-6" />

      <form onSubmit={handleSubmit}>
        <div className={`grid grid-cols-1 ${gridCols} gap-6`}>
          {fields.map((field, index) => {
            const { label, type, colSpan = "" } = field;

            return (
              <div key={index} className={colSpan}>
                {type !== "checkbox" && (
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                )}
                {renderField(field)}
              </div>
            );
          })}
        </div>

        <div className="flex gap-4 mt-8">
          <button
            type="submit"
            disabled={loading || !isFormValid()}
            className={`rounded-lg px-6 py-2.5 text-sm font-medium text-white transition
          ${loading || !isFormValid()
                ? "bg-[#1a963d]/60 cursor-not-allowed"
                : "bg-[#1a963d] hover:bg-[#148032]"
              }`}
          >
            {loading ? "Processing..." : submitButtonText}
          </button>

          {showResetButton && (
            <button
              type="button"
              onClick={handleReset}
              className="rounded-lg px-6 py-2.5 text-sm font-medium border border-[#1a963d] text-[#1a963d] hover:bg-[#1a963d] hover:text-white transition"
            >
              {resetButtonText}
            </button>
          )}
        </div>
      </form>
    </div>

  );
};

export default ReusableForm;
