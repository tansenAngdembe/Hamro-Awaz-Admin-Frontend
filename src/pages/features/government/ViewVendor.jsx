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
  Clock,
  View,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Alert from "../../../components/alerts/Alert";
import api from "../../../api/axios";
import Swal from "sweetalert2";
import { StatusConstant } from "../../../constants/Constant.js";
import Loader from "../../../components/loader/Loader.jsx";
import config from "../../../utils/config.js";
import VendorUserList from "./vendoruser/VendorUserList.jsx";

const ViewVendor = () => {
  const [vendor, setVendor] = useState([]);
  const [vendorEmail, setVendorEmail] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { uniqueId } = useParams();

  const navigate = useNavigate();
  const handleBackClick = (e) => {
    e.preventDefault();
    navigate("/vendor");
  };

  const fetchvendorDetails = () => {
    setLoading(true);
    api
      .post("/vendor/view", { uniqueId })
      .then((response) => {
        if (response.data.code == 200) {
          setVendor(response.data.data);
          setVendorEmail(response.data.data.email);
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
          .post("/vendor/block", { uniqueId, remarks: result.value.remarks })
          .then((response) => {
            if (response.data.code == 200) {
              Swal.fire("Blocked!", response.data.message, "success");
              fetchvendorDetails();
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
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
          .post("/vendor/unblock", { uniqueId, remarks: result.value.remarks })
          .then((response) => {
            if (response.data.code == 200) {
              Swal.fire("Unblocked", response.data.message, "success");
              fetchvendorDetails();
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
          .post("/vendor/delete", { uniqueId, remarks: result.value.remarks })
          .then((response) => {
            if (response.data.code == 200) {
              Swal.fire("Deleted", response.data.message, "success");
              fetchvendorDetails();
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
          .post("/vendor/sendPasswordResetLink", {
            email: vendorEmail,
            remarks: result.value.remarks,
          })
          .then((response) => {
            if (response.data.code == 200) {
              Swal.fire("Success", response.data.message, "success");
              fetchvendorDetails();
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

  const downloadFile = async (filePath) => {
    const fileUrl = `${config.fileURL}${filePath}`;
    window.open(fileUrl, "_blank");
  }

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };
  useEffect(() => {
    fetchvendorDetails();
  }, []);
  return (
    <>
      <div className="p-6 flex flex-col bg-white  overflow-x-hidden">
        <div className="flex justify-between">
          <div>
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-4">
                <MoveLeft onClick={handleBackClick} className="cursor-pointer" />
                <h2 className="text-xl font-semibold">VIEW DETAILS</h2>
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-2">
              View Vendor Details
            </p>
          </div>

        </div>
        <div className="w-full h-px bg-gray-200 mb-2"></div>
        {loading ? (
          <Loader />
        ) : (
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-40 h-40  m-1 md:m-6 flex items-center justify-center bg-red-300">
              <img
                src={
                  vendor?.logoUrl
                    ? `${config.fileURL}${vendor.logoUrl}`
                    : "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg"
                }
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1 px-4 py-4 md:py-6 flex flex-col justify-between">
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="flex flex-col gap-2">

                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{vendor?.businessName}</h2>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-sm px-2 py-1 bg-violet-100 text-violet-700 rounded-full flex items-center gap-1">
                        <ShieldCheck className="w-4 h-4" />
                        {vendor?.accessGroup?.name}
                      </span>
                      <span
                        className={`text-sm px-2 py-1 rounded-full flex items-center gap-1 ${vendor?.status?.name === StatusConstant.active
                          ? "bg-green-100 text-green-700"
                          : vendor?.status?.name === StatusConstant.deleted
                            ? "bg-red-100 text-red-700"
                            : vendor?.status?.name === StatusConstant.blocked
                              ? "bg-yellow-100 text-yellow-700"
                              : vendor?.status?.name === StatusConstant.pending
                                ? "bg-blue-100 text-blue-700"
                                : "bg-gray-100 text-gray-700"
                          }`}
                      >
                        <CircleCheck className="w-4 h-4" />
                        {vendor?.status?.name}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">{vendor?.description}</p>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">{vendor?.address}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">
                          {formatTime(vendor?.openingTime)} - {formatTime(vendor?.closingTime)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-xs text-gray-600 space-y-1 text-left md:text-right">
                  <div>Last login: {vendor.lastLoggedInTime}</div>
                  <div>Password changed: {vendor.passwordChangeDate}</div>
                  <div>Account created: {vendor.createdAt}</div>

                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-4">
                {vendor?.status?.name !== "BLOCKED" ? (
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
                <button className="cursor-pointer px-4 py-2 bg-indigo-100 text-indigo-700 rounded-sm flex items-center gap-2 text-sm hover:bg-indigo-200 transition duration-200">
                  <LogIn className="w-4 h-4" /> Resend Activation
                </button>
                <button
                  onClick={handleDelete}
                  className="cursor-pointer px-4 py-2 bg-red-100 text-red-700 rounded-sm flex items-center gap-2 text-sm hover:bg-red-200 transition duration-200"
                >
                  <Trash2 className="w-4 h-4" /> Delete Account
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                {/* Business Information */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 border-b border-gray-200 pb-2">Business Information</h3>

                  <div>
                    <label className="text-sm font-medium text-gray-500">Business Owner</label>
                    <p className="text-gray-900">{vendor.businessOwnerName}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">Registration Number</label>
                    <p className="text-gray-900">{vendor.registrationNumber}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">PAN Number</label>
                    <p className="text-gray-900">{vendor.panNumber}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">Commission</label>
                    <p className="text-gray-900">{vendor.commissionPercent}%</p>
                  </div>
                </div>

                {/* Location Information */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 border-b border-gray-200 pb-2">Location Information</h3>

                  <div>
                    <label className="text-sm font-medium text-gray-500">Province</label>
                    <p className="text-gray-900">{vendor?.province?.province}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">District</label>
                    <p className="text-gray-900">{vendor?.district?.districtName}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">Local Level</label>
                    <p className="text-gray-900">{vendor?.localLevel?.localLevel}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">Ward Number</label>
                    <p className="text-gray-900">{vendor?.wardNumber}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">Coordinates</label>
                    <p className="text-gray-900">{vendor?.latitude}, {vendor?.longitude}</p>
                  </div>
                </div>

                {/* System Information */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 border-b border-gray-200 pb-2">System Information</h3>

                  <div>
                    <label className="text-sm font-medium text-gray-500">Created At</label>
                    <p className="text-gray-900">{formatDate(vendor.createdAt)}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">Last Updated</label>
                    <p className="text-gray-900">{formatDate(vendor.updatedAt)}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">Admin Verified</label>
                    <div className="flex items-center gap-2">
                      {vendor.verifiedByAdmin ? (
                        <>
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-green-700 text-sm font-medium">Verified</span>
                        </>
                      ) : (
                        <>
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          <span className="text-red-700 text-sm font-medium">Not Verified</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">Documents</label>
                    <div className="space-y-1">
                      <p className="text-blue-600 text-sm hover:underline cursor-pointer"
                        onClick={() => downloadFile(vendor?.documentUrl)}
                      >

                        📄 {vendor.documentUrl}
                      </p>
                      {/* <p className="text-blue-600 text-sm hover:underline cursor-pointer">
                        🖼️ {`${config.fileURL}${vendor.logoUrl}`}
                      </p> */}
                    </div>
                  </div>
                </div>
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
      <div className="relative mb-23">

        <VendorUserList />
      </div>

    </>
  );
};
export default ViewVendor;
