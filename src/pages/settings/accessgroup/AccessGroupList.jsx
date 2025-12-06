import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import ReusableList from "../../../components/list/ReusbaleList";
import api from "../../../api/axios";

const AccessGroupList = () => {
    const navigate = useNavigate();

    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [totalData, setTotalData] = useState(0);

    const columns = [
        {
            header: "Role",
            accessor: "name",
        },
        {
            header: "Description",
            accessor: "description",
        },
        {
            header: "Status",
            accessor: "status.name",
        }
        
    ];

    const fetchAccessGroup = async () => {
        try {
            setLoading(true);
            const response = await api.get("/accessGroup/list/active");
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
    const handleBlock = (uniqueId) => {
        Swal.fire({
            title: "Are you sure you want to block this account?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#00425A",
            cancelButtonColor: "#FC0000",
            confirmButtonText: "Block",
            html: `
      <textarea 
        id="blockReason" 
        class="swal2-textarea" 
        placeholder="Enter reason for blocking" 
        rows="3" 
        style="width: 85%; resize: none; height: 100px; font-size: 15px; text-align: left;"></textarea>
    `,
            preConfirm: () => {
                const remarks = Swal.getPopup().querySelector("#blockReason").value;
                if (!remarks) {
                    Swal.showValidationMessage("Please enter a reason for blocking");
                }
                return { remarks };
            },
        }).then((result) => {
            if (result.isConfirmed) {
                api
                    .post("/block", { uniqueId, remarks: result.value.remarks })
                    .then((response) => {
                        if (response.data.code == 200) {
                            Swal.fire("Blocked!", response.data.message, "success");
                            fetchAccessGroup();
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
        fetchAccessGroup()
    }, [])



    // Define menu actions for each row
    const menuActions = [
        {
            label: "View",
            onClick: (row) => navigate(`/setting/access-group/view/${row.id}`),
        },
        {
            label: "Edit",
            onClick: (row) => navigate(`/setting/access-group/edit/${row.id}`),
        }
    ];

    const handleBackClick = () => {
        navigate(-1);
        // return null;
    };
     const handleAddAdmin = () => {
        navigate("/setting/access-group/create");
        // return null;
    };


    return (
        <ReusableList
            // Required props
            title="ACCESS GROUP"
            subtitle="Manage Access"
            columns={columns}
            data={templates}
            loading={loading}
            // API/Data props
            fetchData={fetchAccessGroup}
            totalData={totalData}
            // Action props
            onBack={handleBackClick}
            onAdd={handleAddAdmin}
            addButtonText="Create Access Group"
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

export default AccessGroupList;
