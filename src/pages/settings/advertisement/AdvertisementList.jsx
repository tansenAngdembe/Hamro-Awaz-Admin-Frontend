import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import ReusableList from "../../../components/list/ReusbaleList";
import api from "../../../api/axios";

const Advertisement = () => {
    const navigate = useNavigate();

    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [totalData, setTotalData] = useState(0);

    const columns = [
        {
            header: "Title",
            accessor: "title",
        },
        {
            header: "Description",
            accessor: "description",
        },
        {
            header: "Created At",
            accessor: "createdAt",
            type: "date"
        },
        {
            header: "Status",
            accessor: "status.name",
        }

    ];

    const fetchAdvertisementDetails = async () => {
        try {
            setLoading(true);
            const response = await api.post("/advertisement/list");
            if (response.data.code === 200) {
                setTemplates(response.data.data);
            } else {
                setErrorMessage(response.data.message);
            }
        } catch (error) {
            setErrorMessage("Something went wrong on server");
        } finally {
            setLoading(false);
        }
    };
    const handleDelete = (uniqueId) => {
        Swal.fire({
            title: "Are you sure you want to delete this Advertisement?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#00425A",
            cancelButtonColor: "#FC0000",
            confirmButtonText: "Delete",
            html: `
      <textarea 
        id="deleteReason" 
        class="swal2-textarea" 
        placeholder="Enter reason for deleting" 
        rows="3" 
        style="width: 85%; resize: none; height: 100px; font-size: 15px; text-align: left;"></textarea>
    `,
            preConfirm: () => {
                const remarks = Swal.getPopup().querySelector("#deleteReason").value;
                if (!remarks) {
                    Swal.showValidationMessage("Please enter a reason for deleting");
                }
                return { remarks };
            },
        }).then((result) => {
            if (result.isConfirmed) {
                api
                    .post("/advertisement/delete", { uniqueId, reason: result.value.remarks })
                    .then((response) => {
                        if (response.data.code == 200) {
                            Swal.fire("Deleted!", response.data.message, "success");
                            fetchAdvertisementDetails();
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

    useEffect(() => {
        fetchAdvertisementDetails()
    }, [])



    // Define menu actions for each row
    const menuActions = [
        {
            label: "Delete",
            onClick: (row) => handleDelete(row.uniqueId),
        },
    ];

    const handleBackClick = () => {
        navigate(-1);
        // return null;
    };
    const handleAddAdvertisementt = () => {
        navigate("/setting/advertisement/create");
        // return null;
    };


    return (
        <ReusableList

            title="ADVERTISEMENT"
            subtitle="Manage Advertisement"
            columns={columns}
            data={templates}
            loading={loading}
            // API/Data props
            fetchData={fetchAdvertisementDetails}
            totalData={totalData}
            // Action props
            onBack={handleBackClick}
            onAdd={handleAddAdvertisementt}
            addButtonText="Create Advertisement"
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

export default Advertisement;
