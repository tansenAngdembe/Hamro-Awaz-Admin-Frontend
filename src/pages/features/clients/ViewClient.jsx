import {
  Mail,
  Phone,
  MapPin,
  KeyRound,
  Trash2,
  ShieldCheck,
  CircleCheck,
  LogIn,
  MoveLeft,
  CircleDollarSign,
  Cone,
  Clock,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Alert from "../../../components/alerts/Alert.jsx";
import api from "../../../api/axios.js";
import Swal from "sweetalert2";
import { StatusConstant } from "../../../constants/Constant.js";
import Loader from "../../../components/loader/Loader.jsx";
import config from "../../../utils/config.js";
import { formatDate } from "../../../utils/globalHelpFunction.jsx";

const ViewClient = () => {
  const [client, setClient] = useState([]);
  const [clientEmail, setClientEmail] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { uniqueId } = useParams();

  const navigate = useNavigate();
  const handleBackClick = (e) => {
    e.preventDefault();
    navigate("/users");
  };
  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };
  const downloadFile = async (filePath) => {
    const fileUrl = `${config.fileURL}${filePath}`;
    window.open(fileUrl, "_blank");
  }
  const fetchClientDetails = () => {
    setLoading(true);
    api
      .post("/users/view", { uniqueId })
      .then((response) => {
        if (response.data.code == 200) {
          setClient(response.data.data);
          setClientEmail(response.data.data.email);
          setSuccessMessage(response.data.message);
        } else {
          setErrorMessage(response.data.message);
        }
        setLoading(false);
      })
      .catch(() => {
        setErrorMessage("Something went wrong on server");
        setLoading(false);
      });
  };

  const handleBlock = (e) => {
    e.preventDefault();

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
          .post("/users/block", { uniqueId, remarks: result.value.remarks })
          .then((response) => {
            if (response.data.code == 200) {
              Swal.fire("Blocked!", response.data.message, "success");
              fetchClientDetails();
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


  const handleUnblock = (e) => {
    e.preventDefault();

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
          .post("/users/unblock", { uniqueId, remarks: result.value.remarks })
          .then((response) => {
            if (response.data.code == 200) {
              Swal.fire("Unblocked", response.data.message, "success");
              fetchClientDetails();
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

  const handleDelete = (e) => {
    e.preventDefault();

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
        placeholder="Enter reason for deletion" 
        rows="3" 
        style="width: 85%; resize: none; height: 100px; font-size: 15px; text-align: left;"></textarea>
    `,
      preConfirm: () => {
        const remarks = Swal.getPopup().querySelector("#deleteReason").value;
        if (!remarks) {
          Swal.showValidationMessage("Please enter a reason for deletion");
        }
        return { remarks };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        api
          .post("/users/delete", { uniqueId, remarks: result.value.remarks })
          .then((response) => {
            if (response.data.code == 200) {
              Swal.fire("Deleted", response.data.message, "success");
              fetchClientDetails();
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

  const handleResetPassword = (e) => {
    e.preventDefault();

    Swal.fire({
      title: "Are you sure you want to send password reset link ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#00425A",
      cancelButtonColor: "#FC0000",
      confirmButtonText: "Send",
      html: `
      <textarea
        id="reason"
        class="swal2-textarea"
        placeholder="Enter reason for deletion"
        rows="3"
        style="width: 85%; resize: none; height: 100px; font-size: 15px; text-align: left;"></textarea>
    `,
      preConfirm: () => {
        const remarks = Swal.getPopup().querySelector("#reason").value;
        if (!remarks) {
          Swal.showValidationMessage(
            "Please enter a reason for password reset"
          );
        }
        return { remarks };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        api
          .post("/sendPasswordResetLink", {
            email: adminEmail,
            remarks: result.value.remarks,
          })
          .then((response) => {
            if (response.data.code == 200) {
              Swal.fire("Success", response.data.message, "success");
              fetchAdminDetails();
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
    fetchClientDetails();
  }, []);
  return (
    <div className="p-6 flex flex-col bg-white  overflow-x-hidden">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-4">
            <MoveLeft onClick={handleBackClick} className="cursor-pointer" />
            <h2 className="text-xl font-semibold">VIEW DETAILS</h2>
          </div>
        </div>
        <p className="text-sm text-gray-500 mb-2">
          View Users Details
        </p>
        <div className="w-full h-px bg-gray-200 mb-2"></div>
        {loading ? (
          <Loader />
        ) : (
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-40 h-40 bg-gray-50 m-4 md:m-6 flex items-center justify-center">
              <img
                src={
                  client?.profilePictureLink
                    ? `${config.fileURL}${client?.profilePictureLink}`
                    : "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg"
                }
                alt="Profile"
                className="w-24 h-24 md:w-32 md:h-32 object-cover"
              />
            </div>

            <div className="flex-1 px-4 py-4 md:py-6 flex flex-col justify-between">
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="flex flex-col gap-2">
                  <h2 className="text-xl md:text-2xl font-bold">
                    {client?.fullName}
                  </h2>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-sm px-2 py-1 bg-violet-100 text-violet-700 rounded-full flex items-center gap-1">
                      <ShieldCheck className="w-4 h-4" />
                      {client?.role?.name}
                    </span>
                    <span
                      className={`text-sm px-2 py-1 rounded-full flex items-center gap-1 ${
                        client?.status?.name === StatusConstant.active
                          ? "bg-green-100 text-green-700"
                          : client?.status?.name === StatusConstant.deleted
                          ? "bg-red-100 text-red-700"
                          : client?.status?.name === StatusConstant.blocked
                          ? "bg-yellow-100 text-yellow-700"
                          : client?.status?.name === StatusConstant.pending
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      <CircleCheck className="w-4 h-4" />
                      {client?.status?.name}
                    </span>
                  </div>
                  <div className="mt-3 space-y-2 text-sm text-gray-700">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" /> {client?.email}
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" /> {client?.phoneNumber}
                    </div>                   
                  </div>
                </div>

                <div className="text-xs text-gray-600 space-y-1 text-left md:text-right">
                  <div>Last login: {formatDate(client?.lastLoggedInTime)}</div>
                  <div>Password changed: {formatDate(client?.passwordChangeDate) || "NULL"}</div>
                  <div>Account created: {formatDate(client?.registeredDate)}</div>
                  <div>
                    Wrong Password Attempt: {client?.wrongPasswordAttemptCount}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-4">
                {client?.status?.name !== "BLOCKED" ? (
                  <button
                    onClick={handleBlock}
                    className="cursor-pointer px-4 py-2 bg-yellow-100 text-yellow-700 rounded-sm flex items-center gap-2 text-sm hover:bg-yellow-200 transition duration-200"
                  >
                    <ShieldCheck className="w-4 h-4" /> Block Account
                  </button>
                ) : (
                  <button
                    onClick={handleUnblock}
                    className="cursor-pointer px-4 py-2 bg-yellow-100 text-yellow-700 rounded-sm flex items-center gap-2 text-sm hover:bg-yellow-200 transition duration-200"
                  >
                    <ShieldCheck className="w-4 h-4" /> Unblock Account
                  </button>
                )}
                <button
                  onClick={handleResetPassword}
                  className="cursor-pointer px-4 py-2 bg-blue-100 text-blue-700 rounded-sm flex items-center gap-2 text-sm hover:bg-blue-200 transition duration-200"
                >
                  <KeyRound className="w-4 h-4" /> Reset Password
                </button>
                {/* <button className="cursor-pointer px-4 py-2 bg-indigo-100 text-indigo-700 rounded-sm flex items-center gap-2 text-sm hover:bg-indigo-200 transition duration-200">
                  <LogIn className="w-4 h-4" /> Resend Activation
                </button> */}
                <button
                  onClick={handleDelete}
                  className="cursor-pointer px-4 py-2 bg-red-100 text-red-700 rounded-sm flex items-center gap-2 text-sm hover:bg-red-200 transition duration-200"
                >
                  <Trash2 className="w-4 h-4" /> Delete Account
                </button>
              </div>
            </div>
          </div>
        )}
        {successMessage && (
          <Alert
            type="success"
            message={successMessage}
            duration={1000}
            onClose={() => setSuccessMessage("")}
          />
        )}

        {errorMessage && (
          <Alert
            type="error"
            message={errorMessage}
            duration={1000}
            onClose={() => setErrorMessage("")}
          />
        )}
      </div>
  );
};
export default ViewClient;
