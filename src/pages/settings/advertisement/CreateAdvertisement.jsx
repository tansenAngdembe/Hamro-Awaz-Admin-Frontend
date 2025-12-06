import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../../../api/axios";
import ReusableForm from "../../../components/form/ReusbaleForm.jsx";

const CreateAdvertisement = () => {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const groupOptions = [
        {
            value: "ACTIVE",
            label: "Active"
        },
        {
            value: "DRAFT",
            label: "Draft"
        }
    ]

    const initialData = {
        title: "",
        description: "",
    };

    const formFields = [
        {
            name: "title",
            label: "Title",
            type: "text",
            required: true
        },
        {
            name: "description",
            label: "Description",
            type: "text",
            required: true
        },
        {
            name: "status",
            label: "Status",
            type: "select",
            options: groupOptions,
            placeholder: "Select Status",
            required: true,
        },
        {
            name: "image",
            label: "Images",
            type: "file",
            accept: "image/*",
            require: true,
        },
    ];


    const handleSubmit = (formData) => {
        setLoading(true);
        const formDataToSend = new FormData();
        if (formData.image?.length > 0) {
            formData.image.forEach((file) => {
                formDataToSend.append("image", file);
            });
        }

        formDataToSend.append(
            "createAdvertisement ",
            new Blob(
                [
                    JSON.stringify(
                        {
                            title: formData.title,
                            description: formData.description,
                            status: formData.status
                        }
                    ),
                ],
                { type: "application/json" }
            )
        );


        api
            .post("/advertisement/create", formDataToSend, {
                headers: { "Content-Type": "multipart/form-data" },
            })
            .then((response) => {
                if (response.data.code === 200) {
                    Swal.fire({
                        title: "Success",
                        text: response.data.message,
                        icon: "success",
                        confirmButtonColor: "#5569FE",
                    }).then((result) => {
                        if (result.isConfirmed) {
                            navigate(-1);
                        }
                    });
                } else {
                    setErrorMessage(response.data.message);
                }
            })
            .catch(() => {
                setErrorMessage("Failed to create Advertisement. Something went wrong on server");
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
        navigate(-1);
    };

    const isFormValid = (formData) => {
        return (
            formData.title?.trim() &&
            formData.description?.trim()
        );
    };

    return (
        <ReusableForm
            title="CREATE ADVERTISEMENT"
            description="Create Advertisement"
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

export default CreateAdvertisement;
