import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../api/axios";
import ReusableForm from "../../../components/form/ReusbaleForm";
import Swal from "sweetalert2";

const CreateUserVendor = () => {
    const navigate = useNavigate();
    const { uniqueId } = useParams(); 
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [accessGroups, setAccessGroups] = useState([]);

    const initialData = {
        fullName: "",
        email: "",
        mobileNumber: "",
        address: "",
        vendorAccessGroupName: "",
        profilePicture: null,
    };

    const fetchActiveAccessGroups = () => {
        api
            .get("/accessGroup/vendor/list/active")
            .then((response) => {
                if (response.data.code === 200) {
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
        fetchActiveAccessGroups();
    }, []);

    const accessGroupOptions = accessGroups.map((g) => ({
        value: g.name,
        label: g.name,
    }));

    const formFields = [
        { name: "fullName", label: "Full Name", type: "text", required: true },
        { name: "email", label: "Email", type: "email", required: true },
        { name: "mobileNumber", label: "Mobile Number", type: "text", required: true },
        { name: "address", label: "Address", type: "text", required: true },
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
            label: "Profile Picture",
            type: "file",
            required: false,
        },
    ];

    const handleSubmit = async (formData) => {
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
                        fullName: formData.fullName,
                        email: formData.email,
                        mobileNumber: formData.mobileNumber,
                        address: formData.address,
                        vendorUniqueId: uniqueId,
                        vendorAccessGroupName: formData.vendorAccessGroupName,
                    }),
                ],
                { type: "application/json" }
            )
        );

        try {
            const response = await api.post("/vendor/users/create", formDataToSend);

            if (response.data.code === 200) {
                Swal.fire("Success", response.data.message,"success"
                ).then((result) => {
                    if (result.isConfirmed) {
                        navigate(-1);
                    }
                });
            } else {
                setErrorMessage(response.data.message);
            }
        } catch (error) {
            setErrorMessage("Something went wrong on server");
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setErrorMessage("");
        setSuccessMessage("");
    };

    const handleBackClick = () => {
        navigate(-1);
    };

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
            title="CREATE VENDOR USER"
            description="Create a new vendor user"
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
            gridCols="lg:grid-cols-2 md:grid-cols-2"
            customValidation={isFormValid}
        />
    );
};

export default CreateUserVendor;
