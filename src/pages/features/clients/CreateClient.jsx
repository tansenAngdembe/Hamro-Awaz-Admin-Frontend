import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axios";
import ReusableForm from "../../../components/form/ReusbaleForm";
import Swal from "sweetalert2";

const CreateUser = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [accessGroups, setAccessGroups] = useState([]);

  const initialData = {
    name: "",
    email: "",
    mobileNumber: "",
    address: "",
    accessGroup: "",
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
      name: "name",
      label: "Full Name",
      type: "text",
      required: true,
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      required: true,
      helpText: "Activation link will be sent to this email",
    },
    {
      name: "mobileNumber",
      label: "Phone Number",
      type: "text",
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
      name: "accessGroup",
      label: "Access Group",
      type: "select",
      options: accessGroupOptions,
      placeholder: "Select Access Group",
      required: true,
    },
  ];

  // const handleSubmit = (formData) => {
  //   setLoading(true);

  //   // Transform formData to match API expectations
  //   const submitData = {
  //     ...formData,
  //     accessGroup: { name: formData.accessGroup },
  //   };

  //   api
  //     .post("/users/create", submitData)
  //     .then((response) => {
  //       if (response.data.code == 200) {
  //         Swal.fire({
  //           title: "Success",
  //           text: response.data.message,
  //           icon: "success",
  //           confirmButtonColor: "#5569FE",
  //         }).then((result) => {
  //           if (result.isConfirmed) {
  //             navigate("/admin");
  //           }
  //         });
  //       } else {
  //         setErrorMessage(response.data.message);
  //       }
  //     })
  //     .catch(() => {
  //       setErrorMessage(
  //         "Failed to create admin. Something went wrong on server"
  //       );
  //     })
  //     .finally(() => {
  //       setLoading(false);
  //     });
  // };

  const handleReset = () => {
    setSuccessMessage("");
    setErrorMessage("");
  };

  const handleBackClick = () => {
    navigate("/user");
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
      title="CREATE User"
      description="Create Hamro Awaz Admin"
      fields={formFields}
      onSubmit={handleSubmit}
      onReset={handleReset}
      onBack={handleBackClick}
      // submitButtonText="Create"
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

export default CreateUser;
