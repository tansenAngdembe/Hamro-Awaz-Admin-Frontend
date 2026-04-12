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
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Alert from "../../../components/alerts/Alert.jsx";
import api from "../../../api/axios.js";
import Swal from "sweetalert2";
import { StatusConstant } from "../../../constants/Constant.js";
import Loader from "../../../components/loader/Loader.jsx";
import config from "../../../utils/config.js";
import VendorUserList from "./vendoruser/AuthorityUserList.jsx";
import AuthorityUserList from "./vendoruser/AuthorityUserList.jsx";

const ViewDetails = () => {
  const [vendor, setVendor] = useState([]);
  const [vendorEmail, setVendorEmail] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const location = useLocation()
  const uniqueId = location.state;
  const navigate = useNavigate();
  const handleBackClick = (e) => {
    e.preventDefault();
    navigate("/authority");
  };

  const fetchvendorDetails = () => {
    setLoading(true);
    api
      .post("/municipality/view", { uniqueId })
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
    <div className="p-6  min-h-screen overflow-x-hidden">
      {/* Header */}
      <div className="flex items-center gap-4 mb-4">
        <MoveLeft
          onClick={handleBackClick}
          className="cursor-pointer text-gray-600 hover:text-gray-900"
        />
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">
            Municipality Details
          </h2>
          <p className="text-sm text-gray-500">
            View municipality information
          </p>
        </div>
      </div>

      <div className="h-px bg-gray-200 mb-6" />

      {loading ? (
        <Loader />
      ) : (
        <div className="bg-white rounded-xl shadow-sm">
          {/* Top Section */}
          <div className="flex flex-col md:flex-row gap-6 p-6 border-b">
            {/* Logo */}
            <div className="w-32 h-32 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
              <img
                src={
                  vendor?.logoUrl
                    ? `${config.fileURL}${vendor.logoUrl}`
                    : "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg"
                }
                alt="Logo"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Basic Info */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-2xl font-bold text-gray-900">
                  {vendor?.governmentName}
                </h2>

                <span
                  className="text-sm px-3 py-1 rounded-full font-medium"
                  style={{
                    backgroundColor: `${vendor?.status?.color}20`,
                    color: vendor?.status?.color,
                  }}
                >
                  <CircleCheck className="w-4 h-4 inline mr-1" />
                  {vendor?.status?.name}
                </span>
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {vendor?.email}
                </div>

                <div className="flex items-center gap-2">
                  <KeyRound className="w-4 h-4" />
                  Code: {vendor?.code}
                </div>

                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {vendor?.address}
                </div>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {/* Administrative Info */}
            <Section title="Administrative Information">
              <Info label="Province" value={vendor?.province?.province} />
              <Info label="District" value={vendor?.district?.districtName} />
              <Info
                label="Local Level"
                value={vendor?.localLevel?.localLevel}
              />
              <Info label="Ward Number" value={vendor?.wardNumber} />
              <Info
                label="Total Wards"
                value={vendor?.localLevel?.totalWards}
              />
            </Section>

            {/* Location */}
            <Section title="Geo Location">
              <Info label="Latitude" value={vendor?.latitude} />
              <Info label="Longitude" value={vendor?.longitude} />
            </Section>

            {/* System */}
            <Section title="System Information">
              <Info label="Created At" value={formatDate(vendor?.createdAt)} />
              <Info label="Updated At" value={formatDate(vendor?.updatedAt)} />

              <div>
                <label className="text-sm text-gray-500">Document</label>
                {vendor?.documentUrl ? (
                  <p
                    className="text-secondary text-sm hover:underline cursor-pointer mt-1"
                    onClick={() => downloadFile(vendor.documentUrl)}
                  >
                    📄 View Document
                  </p>
                ) : (
                  <p className="text-sm text-gray-400">No document uploaded</p>
                )}
              </div>
            </Section>
          </div>

          {/* Description */}
          <div className="border-t p-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              Description
            </h3>
            <p className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700">
              {vendor?.description || "No description provided"}
            </p>
          </div>
        </div>
      )}

      {/* Alerts */}
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

    <div className="mt-6">
      <AuthorityUserList />
    </div>
  </>
);

};
const Section = ({ title, children }) => (
  <div className="space-y-4">
    <h3 className="font-semibold text-gray-900 border-b pb-2">
      {title}
    </h3>
    {children}
  </div>
);

const Info = ({ label, value }) => (
  <div>
    <label className="text-sm text-gray-500">{label}</label>
    <p className="text-gray-900 font-medium">{value || "-"}</p>
  </div>
);

export default ViewDetails;
