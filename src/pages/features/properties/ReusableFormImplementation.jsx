import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axios";
import ReusableForm from "../../../components/form/ReusbaleForm";
import Swal from "sweetalert2";

const AddProperty = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [propertyType, setPropertyType] = useState([]);
  const [clientList, setClientList] = useState([]);
  const [provinceList, setProvinceList] = useState([]);
  const [districtList, setDistrictList] = useState([]);
  const [localLevelList, setLocalLevelList] = useState([]);
  const [wardList, setWardList] = useState([]);

  const initialData = {
    clientEmail: "",
    propertyType: "",
    tag: "",
    description: "",
    rent: "",
    latitude: "",
    longitude: "",
    province: "",
    district: "",
    localLevel: "",
    ward: "",
    tole: "",
    isPetFriendly: false,
    hasElectricity: false,
    hasWheelChairAccess: false,
    hasElevator: false,
    isFurnished: false,
    hasCctv: false,
    hasWater: false,
    hasParking: false,
    images: null,
  };

  // Fetch functions
  const fetchClients = () => {
    api
      .post("/clients/list", { pageSize: -1, firstRow: 0 })
      .then((response) => {
        setClientList(response.data.data.records);
      })
      .catch(() => {
        setErrorMessage("Failed to fetch clients");
      });
  };

  const fetchActivePropertyType = () => {
    api
      .post("/propertyType/list/active", { pageSize: 50, firstRow: 0 })
      .then((response) => {
        setPropertyType(response.data.data.records);
      })
      .catch(() => {
        setErrorMessage("Failed to fetch property type");
      });
  };

  const fetchProvince = () => {
    api
      .get("/list/province")
      .then((response) => {
        setProvinceList(response.data.data);
      })
      .catch(() => {
        setErrorMessage("Failed to fetch provinces");
      });
  };

  const fetchDistrict = (provinceId) => {
    if (!provinceId) return;
    api
      .post("/list/district", { provinceId })
      .then((response) => {
        setDistrictList(response.data.data || []);
      })
      .catch(() => {
        setErrorMessage("Failed to fetch districts");
      });
  };

  const fetchLocalLevel = (districtId) => {
    if (!districtId) return;
    api
      .post("/list/localLevel", { districtId })
      .then((response) => {
        setLocalLevelList(response.data.data || []);
      })
      .catch(() => {
        setErrorMessage("Failed to fetch local levels");
      });
  };

  const fetchWards = (localLevelId) => {
    if (!localLevelId) return;
    api
      .post("/list/wards", { localLevelId })
      .then((response) => {
        setWardList(response.data.data || []);
      })
      .catch(() => {
        setErrorMessage("Failed to fetch wards");
      });
  };

  useEffect(() => {
    fetchClients();
    fetchActivePropertyType();
    fetchProvince();
  }, []);

  // Transform data for select options
  const clientOptions = clientList.map((c) => ({
    value: c.email,
    label: c.fullName + " (" + c.phoneNumber + ")",
  }));

  const propertyTypeOptions = propertyType.map((type) => ({
    value: type.name,
    label: type.name,
  }));

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

  const wardOptions = wardList.map((w) => ({
    value: w.ward,
    label: w.ward,
  }));

  // Form fields configuration
  const formFields = [
    {
      name: "clientEmail",
      label: "Property Owner",
      type: "react-select",
      options: clientOptions,
      placeholder: "Select Property Owner",
      required: true,
    },
    {
      name: "propertyType",
      label: "Property Type",
      type: "select",
      options: propertyTypeOptions,
      placeholder: "Select Property Type",
      required: true,
    },
    {
      name: "tag",
      label: "Tag",
      type: "text",
      placeholder: "1BHK",
    },
    {
      name: "rent",
      label: "Rent",
      type: "number",
      placeholder: "25000",
      required: true,
    },
    {
      name: "latitude",
      label: "Latitude",
      type: "text",
      placeholder: "27.6839173",
    },
    {
      name: "longitude",
      label: "Longitude",
      type: "text",
      placeholder: "85.3466249",
    },
    {
      name: "province",
      label: "Province",
      type: "select",
      options: provinceOptions,
      placeholder: "Select Province",
      required: true,
      onChange: (value) => {
        fetchDistrict(value);
        setDistrictList([]);
        setLocalLevelList([]);
        setWardList([]);
      },
    },
    {
      name: "district",
      label: "District",
      type: "select",
      options: districtOptions,
      placeholder: "Select District",
      required: true,
      onChange: (value) => {
        fetchLocalLevel(value);
        setLocalLevelList([]);
        setWardList([]);
      },
    },
    {
      name: "localLevel",
      label: "Local Level",
      type: "select",
      options: localLevelOptions,
      placeholder: "Select Local Level",
      required: true,
      onChange: (value) => {
        fetchWards(value);
        setWardList([]);
      },
    },
    {
      name: "ward",
      label: "Ward",
      type: "select",
      options: wardOptions,
      placeholder: "Select Ward",
      required: true,
    },
    {
      name: "tole",
      label: "Tole",
      type: "text",
      placeholder: "Subidhanagar",
    },
    {
      name: "description",
      label: "Description",
      type: "textarea",
      rows: 4,
      cols: 4,
    },
    {
      name: "amenities",
      label: "Amenities",
      type: "checkbox-group",
      colSpan: "col-span-full mt-1",
      options: [
        { name: "hasElectricity", label: "Electricity" },
        { name: "hasWater", label: "Water" },
        { name: "hasParking", label: "Parking" },
        { name: "isFurnished", label: "Furnished" },
        { name: "hasCctv", label: "CCTV Surveillance" },
        { name: "isPetFriendly", label: "Pet Friendly" },
        { name: "hasWheelChairAccess", label: "Wheel Chair Access" },
        { name: "hasElevator", label: "Elevator" },
      ],
    },
    {
      name: "images",
      label: "Upload Property Images",
      type: "file",
      maxImages: 4,
      colSpan: "mt-4",
    },
  ];

  const handleSubmit = (formData) => {
    setLoading(true);
    const formDataToSend = new FormData();

    if (formData.images) {
      formData.images.forEach((file) => {
        formDataToSend.append("images", file);
      });
    }

    formDataToSend.append(
      "property",
      new Blob(
        [
          JSON.stringify({
            clientEmail: formData.clientEmail,
            isPetFriendly: formData.isPetFriendly,
            hasWheelchairAccess: formData.hasWheelChairAccess,
            hasElevator: formData.hasElevator,
            isFurnished: formData.isFurnished,
            rent: formData.rent,
            latitude: formData.latitude,
            longitude: formData.longitude,
            district: formData.district,
            propertyType: {
              name: formData.propertyType,
            },
            province: formData.province,
            tole: formData.tole,
            hasElectricity: formData.hasElectricity,
            localLevel: formData.localLevel,
            tag: formData.tag,
            hasCctv: formData.hasCctv,
            ward: formData.ward,
            description: formData.description,
            hasWater: formData.hasWater,
            hasParking: formData.hasParking,
          }),
        ],
        { type: "application/json" }
      )
    );

    api
      .post("/property/add", formDataToSend)
      .then((response) => {
        if (response.data.code == 200) {
          Swal.fire({
            title: "Success",
            text: response.data.message,
            icon: "success",
            confirmButtonColor: "#5569FE",
          }).then((result) => {
            if (result.isConfirmed) {
              navigate("/properties");
            }
          });
        } else {
          setErrorMessage(response.data.message);
        }
      })
      .catch(() => {
        setErrorMessage(
          "Failed to add Property. Something went wrong on server"
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleReset = () => {
    setDistrictList([]);
    setLocalLevelList([]);
    setWardList([]);
    setErrorMessage("");
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <ReusableForm
      title="ADD PROPERTY"
      description="Adds Property in Cosmotech Platform"
      fields={formFields}
      onSubmit={handleSubmit}
      onReset={handleReset}
      onBack={handleBackClick}
      submitButtonText="Create"
      resetButtonText="Reset"
      loading={loading}
      initialData={initialData}
      errorMessage={errorMessage}
      onErrorClose={() => setErrorMessage("")}
      gridCols="lg:grid-cols-4 md:grid-cols-3"
    />
  );
};

export default AddProperty;
