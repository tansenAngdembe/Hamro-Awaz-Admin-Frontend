import React, { useEffect, useState } from "react";
import api from "../../../../api/axios.js";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ReusableList from "../../../../components/list/ReusbaleList.jsx";
import Swal from "sweetalert2";
import { StatusConstant } from "../../../../constants/Constant.js";
import ViewVendorUser from "./ViewVendorUser.jsx";
import { X } from "lucide-react";

const AuthorityUserList = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const uniqueId = location.state;
    const [users, setusers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [totalData, setTotalData] = useState(0);
    const [openModal, setOpenModal] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);

    const handleView = (row) => {
        setSelectedRow(row);
        setOpenModal(true);
    };

    // Define columns for the table
    const columns = [
        {
            header: "Name",
            accessor: "fullName",
        },
        {
            header: "Email",
            accessor: "email",
        },
        {
            header: "Number",
            accessor: "mobileNumber",
        },
        {
            header: "Status",
            accessor: "status.name",
        },
    ];

    const fetchClientList = async ({ pageSize, firstRow, page }) => {
        try {
            setLoading(true);
            const response = await api.post("/authorityUser/list", {
                pageSize,
                firstRow,
                param: {
                    municipalityUniqueId: uniqueId
                }

            });

            if (response.data.code === 200) {
                setusers(response.data.data.records);
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
                    .post("/vendor/users/block", { uniqueId, remarks: result.value.remarks })
                    .then((response) => {
                        if (response.data.code == 200) {
                            Swal.fire("Blocked!", response.data.message, "success");
                            fetchClientList();
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

    const handleUnblock = (uniqueId) => {
        Swal.fire({
            title: "Are you sure you want to unblock this account?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#00425A",
            cancelButtonColor: "#FC0000",
            confirmButtonText: "Unblock",
            html: `
      <textarea 
        id="unblockReason" 
        class="swal2-textarea" 
        placeholder="Enter reason for unblocking" 
        rows="3" 
        style="width: 85%; resize: none; height: 100px; font-size: 15px; text-align: left;"></textarea>
    `,
            preConfirm: () => {
                const remarks = Swal.getPopup().querySelector("#unblockReason").value;
                if (!remarks) {
                    Swal.showValidationMessage("Please enter a reason for unblocking");
                }
                return { remarks };
            },
        }).then((result) => {
            if (result.isConfirmed) {
                api
                    .post("/vendor/users/unblock", {
                        uniqueId,
                        remarks: result.value.remarks,
                    })
                    .then((response) => {
                        if (response.data.code == 200) {
                            Swal.fire("Unblocked!", response.data.message, "success");
                            fetchClientList();
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


    const handleDelete = (uniqueId) => {
        Swal.fire({
            title: "Are you sure you want to delete this account?",
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
                    .post("/vendor/users/delete", {
                        uniqueId,
                        remarks: result.value.remarks,
                    })
                    .then((response) => {
                        if (response.data.code == 200) {
                            Swal.fire("Deleted!", response.data.message, "success");
                            fetchClientList();
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

    // Define menu actions for each row
    const menuActions = [
        {
            label: "View",
            onClick: (row) => handleView(row.uniqueId)
        },
        {
            label: "Edit",
            onClick: (row) => navigate(`/vendor/user/edit/${row.uniqueId}`),
        },
        {
            label: (row) =>
                row.status.name === StatusConstant.blocked ? "Unblock" : "Block",
            onClick: (row) =>
                row.status.name === StatusConstant.blocked
                    ? handleUnblock(row.uniqueId)
                    : handleBlock(row.uniqueId),
        },
        {
            label: "Delete",
            onClick: (row) => handleDelete(row.uniqueId),
        },
    ];

    const handleBackClick = () => {
        // navigate(-1);
        return null
    };

    const handleAddUser = () => {
        navigate(`/vendor/users/create/${uniqueId}`);
    };

    return (
        <div>
            {openModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-white/5 backdrop-blur-xs z-20">
                    <div className="bg-white p-6 rounded shadow-lg w-[600px] max-h-[90vh] overflow-y-auto">
                        <button
                            className="ml-auto block font-bold mb-2"
                            onClick={() => setOpenModal(false)}
                        >
                            <X />
                        </button>
                        <ViewVendorUser uniqueId={selectedRow} />
                    </div>
                </div>
            )}


            <ReusableList
                // Required props
                // title="VENDOR ADMIN LISTdfasdf"
                subtitle="Manage Vedor "
                columns={columns}
                data={users}
                loading={loading}
                // API/Data props
                fetchData={fetchClientList}
                totalData={totalData}
                // Action props
                onBack={handleBackClick}
                onAdd={handleAddUser}
                addButtonText="Create Authority Admin"
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
        </div>
    );
};

export default AuthorityUserList;
