import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../api/axios";
import ReusableForm from "../../../components/form/ReusbaleForm";
import Swal from "sweetalert2";

const EditUserProfile = () => {
    const navigate = useNavigate();
    const { uniqueId } = useParams();
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [initialData, setFormData] = useState({
        fullName: "",
        email: "",
        phoneNumber: "",
        remarks: null,
    });


    const fetchUserDetails = () => {
        api
            .post("/users/view", { uniqueId: uniqueId })
            .then((response) => {
                if (response.data.code == 200) {
                    setSuccessMessage(response.data.message);
                    setFormData({
                        fullName: response.data.data.fullName,
                        phoneNumber: response.data.data.phoneNumber,
                        email: response.data.data.email,
                    });
                } else {
                    setErrorMessage(response.data.message);
                }
            })
            .catch(() => {
                setErrorMessage("Something went wrong on server");
            });
    };


    useEffect(() => {
        fetchUserDetails();
    }, []);


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
            name: "phoneNumber",
            label: "Phone Number",
            type: "text",
            required: true,
        }
    ];

    const handleSubmit = (formData) => {
        setLoading(true);

        Swal.fire({
            title: "Are you sure you want to Edit this account?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#00425A",
            cancelButtonColor: "#FC0000",
            confirmButtonText: "Edit",
            html: `
      <textarea 
        id="editReason" 
        class="swal2-textarea" 
        placeholder="Enter reason for editing." 
        rows="3" 
        style="width: 85%; resize: none; height: 100px; font-size: 15px; text-align: left;"></textarea>
    `,
            preConfirm: () => {
                const remarks = Swal.getPopup().querySelector("#editReason").value;
                if (!remarks) {
                    Swal.showValidationMessage("Please enter a reason for blocking");
                }
                return { remarks };
            },
        }).then((result) => {
            if (result.isConfirmed) {
                const submitData = {
                    ...formData,
                    remarks:result.value.remarks,
                    uuid: uniqueId,
                };

                api
                    .post("/users/update", submitData)
                    .then((response) => {
                        if (response.data.code == 200) {
                            Swal.fire({
                                title: "Success",
                                text: response.data.message,
                                icon: "success",
                                confirmButtonColor: "#5569FE",
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    navigate("/users");
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
            }
        });

    };

    const handleReset = () => {
        setSuccessMessage("");
        setErrorMessage("");
    };

    const handleBackClick = () => {
        navigate("/users");
    };

    // Custom validation function
    const isFormValid = (formData) => {
        return (
            formData.fullName?.trim() &&
            formData.email?.trim() &&
            formData.phoneNumber?.trim()
        );
    };

    return (
        <ReusableForm
            title="EDIT USER"
            description="Edit Users"
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

export default EditUserProfile;
