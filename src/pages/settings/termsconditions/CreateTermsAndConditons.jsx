import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axios";
import ReusableForm from "../../../components/form/ReusbaleForm";
import Swal from "sweetalert2";

const CreateTermsAndConditons = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [tacStatus, setTermsAndConditionsStatus] = useState([]);
  

  const initialData = {
    name: "",
    content: "",
    effectiveDate: "",
    status:""
  };
  const fetchTermsAndConditionsStatus = () => {
    api
      .get("/termsAndConditions/status/list")
      .then((response) => {
        if (response.data.code == 200) {
          setTermsAndConditionsStatus(response.data.data);
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
    fetchTermsAndConditionsStatus();
  }, []);
 // Transform terms and Conditions for select options
  const tacOptions = tacStatus.map((status) => ({
    value: status,
    label: status,
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
      name: "effectiveDate",
      label: "Effective Date",
      type: "date",
      required: true,
    },
    {
      name: "status",
      label: "Status",
      type: "select",
      options: tacOptions,
      placeholder: "Select Status",
      required: true,
    },  {
      name: "content",
      label: "Content",
      type: "editor",
      required: true,
    },
  ];

  const handleSubmit = (formData) => {
    setLoading(true);

    // Transform formData to match API expectations
    const submitData = {
      ...formData
    };

    api
      .post("/termsAndConditions/create", submitData)
      .then((response) => {
        if (response.data.code == 200) {
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
    navigate(-1);
  };

  // Custom validation function
  const isFormValid = (formData) => {
    return (
      formData.name?.trim() &&
      formData.content?.trim() &&
      formData.effectiveDate?.trim()
    );
  };

  return (
    <ReusableForm
      title="CREATE TERMS AND CONDITIONS"
      description="Create Terms And Conditons"
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
      gridCols="lg:grid-cols-1 md:grid-cols-1"
      customValidation={isFormValid}
    />
  );
};

export default CreateTermsAndConditons;
