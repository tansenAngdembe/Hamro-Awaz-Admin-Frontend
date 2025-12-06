import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios.js";
import ReusableForm from "./ReusbaleForm";
import Swal from "sweetalert2";

const ReusableFormImplementation = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [type, settype] = useState([]);
  const [clientList, setClientList] = useState([]);
  const [provinceList, setProvinceList] = useState([]);
  const [districtList, setDistrictList] = useState([]);
  const [localLevelList, setLocalLevelList] = useState([]);
  const [wardList, setWardList] = useState([]);

  const initialData = {
    user: "",
    type: "",
    tag: "",
    description: "",
    input: "",
    latitude: "",
    longitude: "",
    province: "",
    district: "",
    localLevel: "",
    ward: "",
    tole: "",
    isActive: false,
    hasSomething: false,
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

  const fetchActivetype = () => {
    api
      .post("/type/list/active", { pageSize: 50, firstRow: 0 })
      .then((response) => {
        settype(response.data.data.records);
      })
      .catch(() => {
        setErrorMessage("Failed to fetch Type");
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
    fetchActivetype();
    fetchProvince();
  }, []);

  // Transform data for select options
  const userOptions = clientList.map((c) => ({
    value: c.email,
    label: c.fullName + " (" + c.phoneNumber + ")",
  }));

  const typeOptions = type.map((type) => ({
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
      name: "user",
      label: "User",
      type: "react-select",
      options: userOptions,
      placeholder: "Select User",
      required: true,
    },
    {
      name: "type",
      label: "Type",
      type: "select",
      options: typeOptions,
      placeholder: "Select Type",
      required: true,
    },
    {
      name: "tag",
      label: "Tag",
      type: "text",
      placeholder: "1BHK",
    },
    {
      name: "input",
      label: "Input",
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
        { name: "hasSomething", label: "Something" },
        { name: "isActive", label: "Active" },
      ],
    },
    {
      name: "images",
      label: "Upload Images",
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
            user: formData.user,
            isActive: formData.isActive,
            input: formData.input,
            latitude: formData.latitude,
            longitude: formData.longitude,
            district: formData.district,
            type: {
              name: formData.type,
            },
            province: formData.province,
            tole: formData.tole,
            hasSomething: formData.hasSomething,
            localLevel: formData.localLevel,
            tag: formData.tag,
            ward: formData.ward,
            description: formData.description,
          }),
        ],
        { type: "application/json" }
      )
    );

    api
      .post("/something/add", formDataToSend)
      .then((response) => {
        if (response.data.code == 200) {
          Swal.fire({
            title: "Success",
            text: response.data.message,
            icon: "success",
            confirmButtonColor: "#5569FE",
          }).then((result) => {
            if (result.isConfirmed) {
              navigate("/something");
            }
          });
        } else {
          setErrorMessage(response.data.message);
        }
      })
      .catch(() => {
        setErrorMessage(
          "Failed to add something. Something went wrong on server"
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
      title="CREATE SOMETHING"
      description="Creates something"
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

export default ReusableFormImplementation;
