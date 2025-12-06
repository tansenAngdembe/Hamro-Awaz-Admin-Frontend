import React, { useEffect, useState } from "react";
import api from "../../../api/axios";
import { useNavigate } from "react-router-dom";
import ReusableList from "../../../components/list/ReusbaleList.jsx";
import Swal from "sweetalert2";
import { StatusConstant } from "../../../constants/Constant.js";

const AdminList = () => {
  const navigate = useNavigate();

  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [totalData, setTotalData] = useState(0);

  // Define columns for the table
  const columns = [
    {
      header: "Full Name",
      accessor: "name",
    },
    {
      header: "Email",
      accessor: "email",
    },
    {
      header: "Mobile Number",
      accessor: "mobileNumber",
    },
    {
      header: "Access Group",
      accessor: "accessGroup.name",
    },
    {
      header: "Status",
      accessor: "status.name",
    },
  ];

  const fetchAdminList = async ({ pageSize, firstRow, page }) => {
    try {
      setLoading(true);
      const response = await api.post("/list", {
        pageSize,
        firstRow,
      });

      if (response.data.code === 200) {
        setAdmins(response.data.data.records);
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
          .post("/block", { uniqueId, remarks: result.value.remarks })
          .then((response) => {
            if (response.data.code == 200) {
              Swal.fire("Blocked!", response.data.message, "success");
              fetchAdminList({ pageSize: 10, firstRow: 0, page: 1 });
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
          .post("/unblock", { uniqueId, remarks: result.value.remarks })
          .then((response) => {
            if (response.data.code == 200) {
              Swal.fire("Unblocked!", response.data.message, "success");
              fetchAdminList({ pageSize: 10, firstRow: 0, page: 1 });
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
          .post("/delete", { uniqueId, remarks: result.value.remarks })
          .then((response) => {
            if (response.data.code == 200) {
              Swal.fire("Deleted!", response.data.message, "success");
              fetchAdminList({ pageSize: 10, firstRow: 0, page: 1 });
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
      onClick: (row) => navigate(`/admin/view/${row.uniqueId}`),
    },
    {
      label: "Edit",
      onClick: (row) => navigate(`/admin/edit/${row.uniqueId}`),
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
    return null;
  };

  const handleAddAdmin = () => {
    navigate("/admin/create");
  };

  return (
    <ReusableList
      // Required props
      title="ADMIN LIST"
      subtitle="Manage  Admins"
      columns={columns}
      data={admins}
      loading={loading}
      // API/Data props
      fetchData={fetchAdminList}
      totalData={totalData}
      // Action props
      onBack={handleBackClick}
      onAdd={handleAddAdmin}
      addButtonText="Create Admin"
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

export default AdminList;
