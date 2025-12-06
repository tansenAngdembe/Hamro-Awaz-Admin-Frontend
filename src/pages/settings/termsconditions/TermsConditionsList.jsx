import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../../../api/axios";
import ReusableList from "../../../components/list/ReusbaleList";
import { StatusConstant } from "../../../constants/Constant";


const TermsConditionsList = () => {
    const navigate = useNavigate();

    const [termsConditions, setTermsAndConditons] = useState([]);
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [totalData, setTotalData] = useState(0);


    // Define columns for the table
    const columns = [
        {
            header: "Template",
            accessor: "name",
        },
        {
            header: "Effective Date",
            accessor: "effectiveDate",
            type: "date"
        },
        {
            header: "Created Date",
            accessor: "createdAt",
            type: "date"
        },

        {
            header: "Status",
            accessor: "status",
        },
    ];

    const fetchTermsAndConditons = async () => {
        try {
            setLoading(true);
            const response = await api.post("/termsAndConditions/list");
            if (response.data.code === 200) {
                setTermsAndConditons(response.data.data);
                setTotalData(response.data.data.total);
                setSuccessMessage(response.data.message);
            } else {
                setErrorMessage(response.data.message);
            }
        } catch (error) {
            setErrorMessage("Something went wrong on server");
        } finally {
            setLoading(false);
        }
    };

    const handleActive = (uniqueId) => {
        Swal.fire({
            title: "Are you sure you want to active?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#00425A",
            cancelButtonColor: "#FC0000",
            confirmButtonText: "Active",
            html: `
      <textarea 
        id="activeReason" 
        class="swal2-textarea" 
        placeholder="Enter reason for activating." 
        rows="3" 
        style="width: 85%; resize: none; height: 100px; font-size: 15px; text-align: left;"></textarea>
    `,
            preConfirm: () => {
                const remarks = Swal.getPopup().querySelector("#activeReason").value;
                if (!remarks) {
                    Swal.showValidationMessage("Please enter a reason for active");
                }
                return { remarks };
            },
        }).then((result) => {
            if (result.isConfirmed) {
                api
                    .post("/termsAndConditions/active", { uniqueId, remarks: result.value.remarks })
                    .then((response) => {
                        if (response.data.code == 200) {
                            Swal.fire("Blocked!", response.data.message, "success");
                            fetchTermsAndConditons();
                        } else {
                            Swal.fire("Error", response.data.message, "error");
                        }
                    })
                    .catch(() => {
                        Swal.fire("Error", "Something went wrong on server", "error");
                    });
            }
        });
    };

    const handleInActivate = (uniqueId) => {
        Swal.fire({
            title: "Are you sure you want to InActivate?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#00425A",
            cancelButtonColor: "#FC0000",
            confirmButtonText: "In Active",
            html: `
      <textarea 
        id="inActivateReason" 
        class="swal2-textarea" 
        placeholder="Enter reason for unblocking" 
        rows="3" 
        style="width: 85%; resize: none; height: 100px; font-size: 15px; text-align: left;"></textarea>
    `,
            preConfirm: () => {
                const remarks = Swal.getPopup().querySelector("#inActivateReason").value;
                if (!remarks) {
                    Swal.showValidationMessage("Please enter a reason for InActivate");
                }
                return { remarks };
            },
        }).then((result) => {
            if (result.isConfirmed) {
                api
                    .post("/termsAndConditions/inactivate", { uniqueId, remarks: result.value.remarks })
                    .then((response) => {
                        if (response.data.code == 200) {
                            Swal.fire("Success", response.data.message, "success");
                          fetchTermsAndConditons();
                        } else {
                            Swal.fire("Error", response.data.message, "error");
                        }
                    })
                    .catch(() => {
                        Swal.fire("Error", "Something went wrong on server", "error");
                    });
            }
        });
    };

    const handleDraft = (uniqueId) => {
        Swal.fire({
            title: "Are you sure you want to Draft?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#00425A",
            cancelButtonColor: "#FC0000",
            confirmButtonText: "Draft",
            html: `
      <textarea 
        id="inDraftReason" 
        class="swal2-textarea" 
        placeholder="Enter reason for unblocking" 
        rows="3" 
        style="width: 85%; resize: none; height: 100px; font-size: 15px; text-align: left;"></textarea>
    `,
            preConfirm: () => {
                const remarks = Swal.getPopup().querySelector("#inDraftReason").value;
                if (!remarks) {
                    Swal.showValidationMessage("Please enter a reason for InActivate");
                }
                return { remarks };
            },
        }).then((result) => {
            if (result.isConfirmed) {
                api
                    .post("/termsAndConditions/draft", { uniqueId, remarks: result.value.remarks })
                    .then((response) => {
                        if (response.data.code == 200) {
                            Swal.fire("Success", response.data.message, "success");
                           fetchTermsAndConditons();
                        } else {
                            Swal.fire("Error", response.data.message, "error");
                        }
                    })
                    .catch(() => {
                        Swal.fire("Error", "Something went wrong on server", "error");
                    });
            }
        });
    };
    const menuActions = [
        {
            label: "View",
            onClick: (row) => navigate(`/setting/email-termsConditions/view/${row.uniqueId}`),
        },
        {
            label: (row) =>
                row.status !== StatusConstant.active ? "Active" : "In active",
            onClick: (row) =>
                row.status !== StatusConstant.active
                    ?  handleActive(row.uniqueId) 
                    :handleInActivate(row.uniqueId),
        },
        {
            label: (row) =>
                row.status !== StatusConstant.draft ? "Draft" : "",
            onClick: (row) =>
                row.status !== StatusConstant.draft
                    ? handleDraft(row.uniqueId)
                    : null,
        }


    ];

    const handleBackClick = () => {
        navigate(-1);
        // return null;
    };
    const handleAddTermsAndConditions = () => {
        navigate("/setting/terms-and-conditions/create")
    }


    return (
        <ReusableList
            // Required props
            title="Terms and Conditons List"
            subtitle="Manage Terms And Conditions"
            columns={columns}
            data={termsConditions}
            loading={loading}
            // API/Data props
            fetchData={fetchTermsAndConditons}
            totalData={totalData}
            // Action props
            onBack={handleBackClick}
            onAdd={handleAddTermsAndConditions}
            addButtonText="Create Terms and Contitons"
            menuActions={menuActions}
            // Alert props
            successMessage={successMessage}
            errorMessage={errorMessage}
            onClearSuccess={() => setSuccessMessage("")}
            onClearError={() => setErrorMessage("")}
            // Pagination props
            initialRowsPerPage={10}
            rowsPerPageOptions={[5, 10, 25]}
        />
    );
};

export default TermsConditionsList;
