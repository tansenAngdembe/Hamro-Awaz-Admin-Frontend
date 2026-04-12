import React, { useEffect, useState } from "react";
import api from "../../../api/axios.js";
import { useNavigate } from "react-router-dom";
import ReusableList from "../../../components/list/ReusbaleList.jsx";
import Swal from "sweetalert2";
import { StatusConstant } from "../../../constants/Constant.js";

const GovernmentList = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    governmentName: "",
    status: "",
  });

  const [page, setPage] = useState(1);
  const [ROWS_PER_PAGE, setRowsPerPage] = useState(10);


  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [totalData, setTotalData] = useState(0);

  // Define columns for the table
  const columns = [
    {
      header: "Name",
      accessor: "governmentName",
    },
    {
      header: "Code",
      accessor: "code",
    },

    {
      header: "District",
      accessor: "district.districtName",
    },
    {
      header: "Status",
      accessor: "status.name",
    },
  ];


  const fetchGovernmentList = async ({ pageSize, firstRow, page, param }) => {
    try {
      setLoading(true);
      const response = await api.post("/municipality/list", {
        pageSize,
        firstRow,
        param // <-- param object sent to backend
      });

      if (response.data.code === 200) {
        setAdmins(response.data.data.records);
        setTotalData(response.data.data.total);
      } else {
        setErrorMessage(response.data.message);
      }
    } catch (error) {
      setErrorMessage("Something went wrong on server");
    } finally {
      setLoading(false);
    }
  };



  useEffect(() => {
    fetchGovernmentList();
  }, [page, ROWS_PER_PAGE, filters]);

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
          .post("/municipality/block", { uniqueId, remarks: result.value.remarks })
          .then((response) => {
            if (response.data.code == 200) {
              Swal.fire("Success", response.data.message, "success");
              fetchGovernmentList({ pageSize: 10, firstRow: 0, page: 1 });
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
          .post("/municipality/unblock", { uniqueId, remarks: result.value.remarks })
          .then((response) => {
            if (response.data.code == 200) {
              Swal.fire("Success", response.data.message, "success");
              fetchGovernmentList({ pageSize: 10, firstRow: 0, page: 1 });
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
          .post("/municipality/delete", { uniqueId, remarks: result.value.remarks })
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
      onClick: (row) => navigate(`/authority/view`, { state: row.uniqueId }),
    },
    {
      label: "Edit",
      onClick: (row) => navigate(`/authority/edit/${row.uniqueId}`),
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

  const handleAddVendor = () => {
    navigate("/authority/create");
  };

  return (
    <ReusableList
      // Required props
      title="MUNICIPALITY LIST"
      subtitle="Manage Municipality Details"
      columns={columns}
      data={admins}
      loading={loading}
      // API/Data props
      fetchData={fetchGovernmentList}
      totalData={totalData}
      // Action props
      onBack={handleBackClick}
      onAdd={handleAddVendor}
      addButtonText="Add Municipality"
      menuActions={menuActions}
      // Alert props
      successMessage={successMessage}
      errorMessage={errorMessage}
      onClearSuccess={() => setSuccessMessage("")}
      onClearError={() => setErrorMessage("")}
      // Pagination props
      initialRowsPerPage={10}
      rowsPerPageOptions={[5, 10, 25]}
      searchFields={[
        { key: "province", backendKey: "province", label: "Province", type: "text" },
        { key: "district", backendKey: "district", label: "District", type: "text" },
        { key: "governmentName", backendKey: "governmentName", label: "Name", type: "text" },
        { key: "code", backendKey: "code", label: "Code", type: "text" },
        { key: "status", backendKey: "status", label: "Status", type: "select", options: ["ACTIVE", "DELETED", "PENDING", "BLOCKED"] }
      ]}
    />
  );
};

export default GovernmentList;
