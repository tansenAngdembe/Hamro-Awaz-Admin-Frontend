import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../api/axios";
import ReusableForm from "../../../components/form/ReusbaleForm";
import Swal from "sweetalert2";

const EditVendor = () => {
    const navigate = useNavigate();
    const { uniqueId } = useParams();
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [provinceList, setProvinceList] = useState([]);
    const [districtList, setDistrictList] = useState([]);
    const [localLevelList, setLocalLevelList] = useState([]);
    const [wardList, setWardList] = useState([]);

    const [initialData, setFormData] = useState({
        businessName: '',
        businessOwnerName: '',
        registrationNumber: '',
        panNumber: '',
        description: '',
        provinceId: '',
        districtId: '',
        localLevelId: '',
        wardNumber: '',
        latitude: '',
        longitude: '',
        address: '',
        openingTime: '',
        closingTime: '',
        commissionPercent: 0,
    });


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

    const fetchVendorDetails = async () => {
        try {
            const response = await api.post("vendor/view", { uniqueId });

            if (response.data.code === 200) {
                const vendor = response.data.data;

                setSuccessMessage(response.data.message);
                setFormData({
                    businessName: vendor.businessName,
                    businessOwnerName: vendor.businessOwnerName,
                    registrationNumber: vendor.registrationNumber,
                    panNumber: vendor.panNumber,
                    description: vendor.description,

                    provinceId: vendor.province?.id || "",
                    districtId: vendor.district?.id || "",
                    localLevelId: vendor.localLevel?.id || "",
                    wardNumber: vendor.wardNumber || "",

                    latitude: vendor.latitude,
                    longitude: vendor.longitude,
                    address: vendor.address,
                    openingTime: vendor.openingTime,
                    closingTime: vendor.closingTime,
                    commissionPercent: vendor.commissionPercent,
                });

                if (vendor.province?.id) fetchDistrict(vendor.province.id);
                if (vendor.district?.id) fetchLocalLevel(vendor.district.id);
                if (vendor.localLevel?.id) fetchWards(vendor.localLevel.id);
            } else {
                setErrorMessage(response.data.message);
            }
        } catch (error) {
            setErrorMessage("Something went wrong on server");
        }
    };




    useEffect(() => {
        fetchProvince();
        // fetchDistrict(initialData.provinceId)
        // fetchLocalLevel(initialData.localLevelId);
        // fetchWards(initialData.wardNumber)
        fetchVendorDetails();
    }, []);


    const provinceOptions = provinceList.map(p => ({ value: p.id, label: p.province }));
    const districtOptions = districtList.map(d => ({ value: d.id, label: d.districtName }));
    const localLevelOptions = localLevelList.map(l => ({ value: l.id, label: l.localLevel }))
    const wardsOptions = wardList.map(w => ({ value: w.id, label: w.ward }));

    // Form fields configuration
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
                fetchDistrict(value);
                setDistrictList([]);
                setLocalLevelList([]);
                setWardList([]);
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
                fetchLocalLevel(value);
                setLocalLevelList([]);
                setWardList([]);
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
                fetchWards(value);
                setWardList([]);
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
            name: "description",
            label: "Description",
            type: "textarea",
            required: false,
        },
       
      
    ];

    const handleSubmit = (formData) => {
        setLoading(true);

        // Transform formData to match API expectations
        const submitData = {
            ...formData,
            uniqueId,
            accessGroup: { name: formData.accessGroup },
        };

        api
            .post("/update", submitData)
            .then((response) => {
                if (response.data.code == 200) {
                    Swal.fire({
                        title: "Success",
                        text: response.data.message,
                        icon: "success",
                        confirmButtonColor: "#5569FE",
                    }).then((result) => {
                        if (result.isConfirmed) {
                            navigate("/admin");
                        }
                    });
                } else {
                    setErrorMessage(response.data.message);
                }
            })
            .catch(() => {
                setErrorMessage(
                    "Failed to create admin. Something went wrong on server"
                );
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleReset = () => {
        setSuccessMessage("");
        setErrorMessage("");
    };

    const handleBackClick = () => {
        navigate(`/vendor/view/${uniqueId}`);
    };

    // Custom validation function
    const isFormValid = (formData) => {
        return (
            formData.name?.trim() &&
            formData.email?.trim() &&
            formData.mobileNumber?.trim() &&
            formData.address?.trim() &&
            formData.accessGroup?.trim()
        );
    };

    return (
        <ReusableForm
            title="EDIT VENDOR "
            description="Edit goal post Vendor"
            fields={formFields}
            onSubmit={handleSubmit}
            onReset={handleReset}
            onBack={handleBackClick}
            submitButtonText="Edit"
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

export default EditVendor;
