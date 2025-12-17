import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../../../api/axios.js";
import ReusableForm from "../../../components/form/ReusbaleForm.jsx";

const CreateGovernment = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [type, settype] = useState([]);
    const [clientList, setClientList] = useState([]);
    const [provinceList, setProvinceList] = useState([]);
    const [districtList, setDistrictList] = useState([]);
    const [localLevelList, setLocalLevelList] = useState([]);
    const [wardList, setWardList] = useState([]);
    const [successMessage, setSuccessMessage] = useState("");


    const initialData = {
        governmentName: "",
        email: "",
        code: "",
        description: "",
        provinceId: "",
        districtId: "",
        localLevelId: "",
        wardNumber: "",
        latitude: "",
        longitude: "",
        address: "",
        authorityAdminFullName: "",
        authorityAdminEmail: "",
        authorityAdminPhoneNumber: "",
        authorityAdminAddress: "",
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
        value: w.id,
        label: w.ward,
    }));

    // Form fields configuration
    const formFields = [
        {
            name: "governmentName",
            label: "Municipality Name",
            type: "text",
            required: true,
        },
        {
            name: "email",
            label: "Municipality email",
            type: "email",
            required: true,
        },
        {
            name: "code",
            label: "Code Number",
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
                setDistrictList([]);
                setLocalLevelList([]);
                setWardList([]);
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
                setLocalLevelList([]);
                setWardList([]);
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
                setWardList([]);
                fetchWards(value);
            },
        },
        {
            name: "wardNumber",
            label: "Ward Number",
            type: "select",
            options: wardOptions,
            required: true,
        },
        {
            name: "address",
            label: "Address",
            type: "text",
            required: true,
        },

        {
            name: "authorityAdminFullName",
            label: "Authority Admin User Full Name",
            type: "text",
            required: true,
        },
        {
            name: "authorityAdminEmail",
            label: "Authority  Admin User Email",
            type: "email",
            required: true,
        },
        {
            name: "authorityAdminPhoneNumber",
            label: "Authority Admin Phone Number",
            type: "number",
            required: true,
        },
        {
            name: "authorityAdminAddress",
            label: "Authority Admin Address",
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
            name: "documentFile",
            label: "Registration Document",
            type: "file",
            required: false,
        },
        {
            name: "location",
            label: "Municipality Location",
            type: "map",
            colSpan: "col-span-full",
            helpText: "Click on map to select exact location",
        },
    ];

    const handleSubmit = (formData) => {
        setLoading(true);
        const formDataToSend = new FormData();
        if (formData.documentFile?.length > 0) {
            formData.documentFile.forEach((file) => {
                formDataToSend.append("documentFile", file);
            });
        }


        formDataToSend.append(
            "municipality",
            new Blob(
                [
                    JSON.stringify({
                        governmentName: formData.governmentName,
                        email: formData.email,
                        code: formData.code,
                        documentUrl: formData.documentUrl,
                        description: formData.description,
                        provinceId: formData.provinceId,
                        districtId: formData.districtId,
                        localLevelId: formData.localLevelId,
                        wardNumber: formData.wardNumber,
                        latitude: formData.latitude,
                        longitude: formData.longitude,
                        address: formData.address,
                        authorityAdminFullName: formData.authorityAdminFullName,
                        authorityAdminEmail: formData.authorityAdminEmail,
                        authorityAdminPhoneNumber: formData.authorityAdminPhoneNumber,
                        authorityAdminAddress: formData.authorityAdminAddress
                    }),
                ],
                { type: "application/json" }
            )
        );
        console.log(formData)

        api
            .post("/municipality/create", formDataToSend)
            .then((response) => {
                if (response.data.code == 200) {
                    Swal.fire({
                        title: "Success",
                        text: response.data.message,
                        icon: "success",
                        confirmButtonColor: "#5569FE",
                    }).then((result) => {
                        if (result.isConfirmed) {
                            navigate("/authority");
                        }
                    });
                } else if( response.data.code == 442){
                     Swal.fire({
                        title: "Failed",
                        text: response.data.message,
                        icon: "failed",
                        confirmButtonColor: "#5569FE",
                    }).then((result) => {
                        if (result.isConfirmed) {
                            navigate("/authority");
                        }
                    });

                }
                 else {
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
            title="Create Government and Authority User"
            description="Create Governement and Admin User"
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
            gridCols="lg:grid-cols-4 md:grid-cols-3"
        />
    );
};

export default CreateGovernment;
