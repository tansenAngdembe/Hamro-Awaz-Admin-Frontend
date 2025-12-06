import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axios";
import ReusableForm from "../../../components/form/ReusbaleForm";
import Swal from "sweetalert2";

const CreateVendor = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [provinceList, setProvinceList] = useState([]);
  const [districtList, setDistrictList] = useState([]);
  const [localLevelList, setLocalLevelList] = useState([]);
  const [wardList, setWardList] = useState([]);

  // Keep selected values separate
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedLocalLevel, setSelectedLocalLevel] = useState("");

  const initialData = {
    businessName: "",
    businessOwnerName: "",
    registrationNumber: "",
    panNumber: "",
    description: "",
    provinceId: "",
    districtId: "",
    localLevelId: "",
    wardNumber: "",
    latitude: "",
    longitude: "",
    address: "",
    openingTime: "",
    closingTime: "",
    commissionPercent: 0,
    vendorAdminFullName: "",
    vendorAdminEmail: "",
    vendorAdminMobileNumber: "",
    vendorAdminAddress: "",
  };

  // Fetch functions
  const fetchProvince = async () => {
    try {
      const response = await api.get("/list/province");
      setProvinceList(response.data.data || []);
    } catch {
      setErrorMessage("Failed to fetch provinces");
    }
  };

  const fetchDistrict = async (provinceId) => {
    if (!provinceId) return;
    try {
      const response = await api.post("/list/district", { provinceId });
      setDistrictList(response.data.data || []);
      ;
    } catch {
      setErrorMessage("Failed to fetch districts");
    }
  };

  const fetchLocalLevel = async (districtId) => {
    if (!districtId) return;
    try {
      const response = await api.post("/list/localLevel", { districtId });
      setLocalLevelList(response.data.data || []);
      setWardList([]);
    } catch {
      setErrorMessage("Failed to fetch local levels");
    }
  };

  const fetchWards = async (localLevelId) => {
    if (!localLevelId) return;
    try {
      const response = await api.post("/list/wards", { localLevelId });
      setWardList(response.data.data || []);
    } catch {
      setErrorMessage("Failed to fetch wards");
    }
  };

  useEffect(() => {
    fetchProvince();
  }, []);

  // Transform data for select options
  const provinceOptions = provinceList.map((p) => ({
    value: p.id,
    label: p.province,
  }));
  const districtOptions = districtList.map((d) => ({
    value: d.id,
    label: d.districtName,
  }));
  const localLevelOptions = localLevelList.map((l) => ({
    value: l.id,
    label: l.localLevel,
  }));
  const wardsOptions = wardList.map((w) => ({
    value: w.id,
    label: w.ward,
  }));

  const formFields = [
    {
      name: "businessName",
      label: "Business Name",
      type: "text",
      required: true,
    },
    {
      name: "businessOwnerName",
      label: "Business Owner Name",
      type: "text",
      required: true,
    },
    {
      name: "registrationNumber",
      label: "Registration Number",
      type: "text",
      required: true,
    },
    {
      name: "panNumber",
      label: "PAN Number",
      type: "text",
      required: true,
    },
    {
      name: "provinceId",
      label: "Province",
      type: "select",
      options: provinceOptions,
      placeholder: "Select Province",
      required: true,
      onChange: (value) => {
        setSelectedProvince(value);
        setSelectedDistrict("");
        setSelectedLocalLevel("");
        fetchDistrict(value);
      },
    },
    {
      name: "districtId",
      label: "District",
      type: "select",
      options: districtOptions,
      placeholder: "Select District",
      required: true,
      onChange: (value) => {
        setSelectedDistrict(value);
        setSelectedLocalLevel("");
        fetchLocalLevel(value);
      },
    },
    {
      name: "localLevelId",
      label: "Local Level",
      type: "select",
      options: localLevelOptions,
      placeholder: "Select Local Level",
      required: true,
      onChange: (value) => {
        setSelectedLocalLevel(value);
        fetchWards(value);
      },
    },
    {
      name: "wardNumber",
      label: "Ward Number",
      type: "select",
      options: wardsOptions,
      required: true,
    },
    {
      name: "latitude",
      label: "Latitude",
      type: "text",
      required: false,
    },
    {
      name: "longitude",
      label: "Longitude",
      type: "text",
      required: false,
    },
    {
      name: "address",
      label: "Address",
      type: "text",
      required: true,
    },
    {
      name: "openingTime",
      label: "Opening Time",
      type: "time",
      required: true,
    },
    {
      name: "closingTime",
      label: "Closing Time",
      type: "time",
      required: true,
    },
    {
      name: "commissionPercent",
      label: "Commission (%)",
      type: "number",
      required: true,
    },
    {
      name: "vendorAdminFullName",
      label: "Admin Full Name",
      type: "text",
      required: true,
    },
    {
      name: "vendorAdminEmail",
      label: "Admin Email",
      type: "email",
      required: true,
    },
    {
      name: "vendorAdminMobileNumber",
      label: "Admin Mobile Number",
      type: "text",
      required: true,
    },
    {
      name: "vendorAdminAddress",
      label: "Admin Address",
      type: "text",
      required: true,
    },
    {
      name: "description",
      label: "Description",
      type: "textarea",
      required: false,
    },
    {
      name: "logoFile",
      label: "Business Logo",
      type: "file",
      required: false,
    },
    {
      name: "documentFile",
      label: "Registration Document",
      type: "file",
      required: false,
    },
  ];

  const handleSubmit = (formData) => {
    setLoading(true);
    const formDataToSend = new FormData();

    if (formData.logoFile && formData.logoFile.length > 0) {
      formDataToSend.append("logoFile", formData.logoFile[0]);
    }

    if (formData.documentFile && formData.documentFile.length > 0) {
      formDataToSend.append("documentFile", formData.documentFile[0]);
    }

    formDataToSend.append(
      "vendor",
      new Blob(
        [
          JSON.stringify({
            businessName: formData.businessName,
            businessOwnerName: formData.businessOwnerName,
            registrationNumber: formData.registrationNumber,
            panNumber: formData.panNumber,
            description: formData.description,
            provinceId: formData.provinceId,
            districtId: formData.districtId,
            localLevelId: formData.localLevelId,
            wardNumber: formData.wardNumber,
            latitude: formData.latitude,
            longitude: formData.longitude,
            address: formData.address,
            openingTime: formData.openingTime,
            closingTime: formData.closingTime,
            commissionPercent: formData.commissionPercent,
            vendorAdminFullName: formData.vendorAdminFullName,
            vendorAdminEmail: formData.vendorAdminEmail,
            vendorAdminMobileNumber: formData.vendorAdminMobileNumber,
            vendorAdminAddress: formData.vendorAdminAddress,
          }),
        ],
        { type: "application/json" }
      )
    );

    api
      .post("/vendor/create", formDataToSend)
      .then((response) => {
        if (response.data.code === 200) {
          Swal.fire({
            title: "Success",
            text: response.data.message,
            icon: "success",
            confirmButtonColor: "#5569FE",
          }).then((result) => {
            if (result.isConfirmed) {
              navigate("/vendor");
            }
          });
        } else {
          setErrorMessage(response.data.message);
        }
      })
      .catch(() => {
        setErrorMessage("Failed to add Vendor. Something went wrong on server");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleReset = () => {
    setDistrictList([]);
    setLocalLevelList([]);
    setWardList([]);
    setSelectedProvince("");
    setSelectedDistrict("");
    setSelectedLocalLevel("");
    setErrorMessage("");
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  const isFormValid = (formData) => {
    return (
      formData.businessName?.trim() &&
      formData.businessOwnerName?.trim() &&
      formData.registrationNumber?.trim() &&
      formData.panNumber?.trim()
    );
  };

  return (
    <ReusableForm
      title="CREATE VENDOR"
      description="Create Vendor"
      fields={formFields}
      onSubmit={handleSubmit}
      onReset={handleReset}
      onBack={handleBackClick}
      submitButtonText="Create"
      resetButtonText="Reset"
      loading={loading}
      initialData={initialData}
      errorMessage={errorMessage}
      successMessage={successMessage}
      onErrorClose={() => setErrorMessage("")}
      onSuccessClose={() => setSuccessMessage("")}
      gridCols="lg:grid-cols-3 md:grid-cols-2"
      customValidation={isFormValid}
    />
  );
};

export default CreateVendor;
