import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../../../../api/axios";
import ReusableForm from "../../../../components/form/ReusbaleForm";

const EditVendorUser = () => {
    const navigate = useNavigate();
    const { userUniqueId } = useParams();
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [accessGroups, setAccessGroups] = useState([]);
    const [initialData, setFormData] = useState({
        fullName: "",
        email: "",
        mobileNumber: "",
        address: "",
        vendorAccessGroupName: "",
    });


    const fetchVednorUserDetails = () => {
        api
            .post("/vendor/users/view", { uniqueId: userUniqueId })
            .then((response) => {
                if (response.data.code == 200) {
                    setSuccessMessage(response.data.message);
                    setFormData({
                        fullName: response?.data?.data?.fullName,
                        email: response?.data?.data?.email,
                        mobileNumber: response?.data?.data?.mobileNumber,
                        address: response?.data?.data?.address,
                        profilePictureName: response?.data?.profilePictureName,
                        vendorAccessGroupName: response?.data?.data?.vendorAccessGroupName?.name
                    });
                } else {
                    setErrorMessage(response.data.message);
                }
            })
            .catch(() => {
                setErrorMessage("Something went wrong on server");
            });
    };

    const fetchActiveAccessGroups = () => {
        api
            .get("/accessGroup/vendor/list/active")
            .then((response) => {
                if (response.data.code == 200) {
                    setAccessGroups(response.data.data);
                    setSuccessMessage(response.data.message);
                } else {
                    setErrorMessage(response.data.message);
                }
            })
            .catch(() => {
                setErrorMessage("Something went wrong on server");
            });
    };

    useEffect(() => {
        fetchVednorUserDetails();
        fetchActiveAccessGroups();
    }, []);

    // Transform access groups for select options
    const accessGroupOptions = accessGroups.map((group) => ({
        value: group.name,
        label: group.name,
    }));

    // Form fields configuration
    const formFields = [
        {
            name: "fullName",
            label: "Full Name",
            type: "text",
            required: true,
        },
        {
            name: "email",
            label: "Email",
            type: "email",
            required: true,
        },
        {
            name: "mobileNumber",
            label: "Phone Number",
            type: "number",
            required: true,
            helpText: "Do not enter country code",
        },
        {
            name: "address",
            label: "Address",
            type: "text",
            required: true,
        },

        {
            name: "vendorAccessGroupName",
            label: "Access Group",
            type: "select",
            options: accessGroupOptions,
            placeholder: "Select Access Group",
            required: true,
        },
        {
            name: "profilePicture",
            label: "Profile picture",
            type: "file",
            required: false,
        }

    ];

    const handleSubmit = (formData) => {
        setLoading(true);
        const formDataToSend = new FormData();

        if (formData.profilePicture && formData.profilePicture.length > 0) {
            formDataToSend.append("profilePicture", formData.profilePicture[0]);
        }
        formDataToSend.append(
            "vendorUser",
            new Blob(
                [
                    JSON.stringify({
                        uniqueId: userUniqueId,
                        fullName: formData.fullName,
                        email: formData.email,
                        mobileNumber: formData.mobileNumber,
                        address: formData.address,
                        vendorAccessGroupName: formData.vendorAccessGroupName,
                    }),
                ],
                { type: "application/json" }
            )
        );

        api
            .post("/vendor/users/update", formDataToSend)
            .then((response) => {
                if (response.data.code === 200) {
                    Swal.fire({
                        title: "Success",
                        text: response.data.message,
                        icon: "success",
                        confirmButtonColor: "#5569FE",
                    }).then((result) => {
                        if (result.isConfirmed) {
                            navigate(`/vednor`);
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
        setSuccessMessage("");
        setErrorMessage("");
    };

    const handleBackClick = () => {
        navigate(-1)
    };

    // Custom validation function
    const isFormValid = (formData) => {
        return (
            formData.fullName?.trim() &&
            formData.email?.trim() &&
            formData.mobileNumber?.trim() &&
            formData.address?.trim() &&
            formData.vendorAccessGroupName?.trim()
        );
    };

    return (
        <ReusableForm
            title="EDIT VENDOR USER"
            description="Edit vendor user admin"
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

export default EditVendorUser;
