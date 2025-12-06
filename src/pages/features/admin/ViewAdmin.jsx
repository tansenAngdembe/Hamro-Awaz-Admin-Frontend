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
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Alert from "../../../components/alerts/Alert";
import api from "../../../api/axios";
import Swal from "sweetalert2";
import { StatusConstant } from "../../../constants/Constant.js";
import Loader from "../../../components/loader/Loader.jsx";
import config from "../../../utils/config.js";

const ViewAdmin = () => {
  const [admin, setAdmin] = useState([]);
  const [adminEmail, setAdminEmail] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { uniqueId } = useParams();

  const navigate = useNavigate();
  const handleBackClick = (e) => {
    e.preventDefault();
    navigate("/admin");
  };

  const fetchAdminDetails = () => {
    setLoading(true);
    api
      .post("/view", { uniqueId })
      .then((response) => {
        if (response.data.code == 200) {
          setAdmin(response.data.data);
          setAdminEmail(response.data.data.email);
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
          .post("/block", { uniqueId, remarks: result.value.remarks })
          .then((response) => {
            if (response.data.code == 200) {
              Swal.fire("Blocked!", response.data.message, "success");
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
          .post("/unblock", { uniqueId, remarks: result.value.remarks })
          .then((response) => {
            if (response.data.code == 200) {
              Swal.fire("Unblocked", response.data.message, "success");
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
          .post("/delete", { uniqueId, remarks: result.value.remarks })
          .then((response) => {
            if (response.data.code == 200) {
              Swal.fire("Deleted", response.data.message, "success");
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

  const handlePasswordLink = (e) => {
    e.preventDefault();

    Swal.fire({
      title: "Are you sure you want to send password activation link?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#00425A",
      cancelButtonColor: "#FC0000",
      confirmButtonText: "Send",
      html: `
      <textarea 
        id="activationReason" 
        class="swal2-textarea" 
        placeholder="Enter reason for activation" 
        rows="3" 
        style="width: 85%; resize: none; height: 100px; font-size: 15px; text-align: left;"></textarea>
    `,
      preConfirm: () => {
        const remarks = Swal.getPopup().querySelector("#activationReason").value;
        if (!remarks) {
          Swal.showValidationMessage("Please enter a reason for activation.");
        }
        return { remarks };
      },
    }).then((result) => {
      if (result.isConfirmed) {  ///api/v1/admin/sendPasswordResetLink
        api
          .post("/sendPasswordResetLink", { email: admin.email, remarks: result.value.remarks })
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
    fetchAdminDetails();
  }, []);
  return (
    <>
      <div className="p-6 bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="max-w mx-auto">
          <div className="flex flex-col md:flex-row gap-3 items-center justify-between mb-4">
            <div className="flex  items-center gap-4 not-first:">
              <div
                onClick={handleBackClick}
                className="p-2 rounded bg-white shadow-sm hover:shadow-md cursor-pointer"
                aria-label="Back"
                title="Back"
              >
                <MoveLeft className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-gray-800">View Admin</h1>
                <p className="text-sm text-gray-500">HamroAwaz — Issue Reporting System</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">Admin ID:</span>
              <div className="text-sm font-mono text-gray-800 bg-white px-3 py-1 rounded shadow-sm">
                {admin?.uniqueId ?? "—"}
              </div>
            </div>
          </div>

          <div className="w-full h-px bg-gray-200 mb-6"></div>

          {/* Main grid */}
          {loading ? (
            <div className="flex items-center justify-center h-80">
              <Loader />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Left: Profile card */}
              <div className="md:col-span-4">
                <div className="sticky top-6 bg-white rounded shadow-lg overflow-hidden">
                  <div className="relative h-28 bg-[#0B5A9A]">
                    {/* accent header */}
                    <div className="absolute left-4 bottom-[-28px]">
                      <div className="w-32 h-32 rounded-full ring-4 ring-white bg-gray-100 overflow-hidden shadow-xl">
                        <img
                          src={
                            admin?.profilePictureName
                              ? `${config.fileURL}${admin.profilePictureName}`
                              : "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg"
                          }
                          alt={`${admin?.name ?? "Admin"} avatar`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-16 pb-6 px-6">
                    <h2 className="text-xl font-bold text-gray-800">{admin?.name ?? "—"}</h2>
                    <p className="text-sm text-gray-600 mt-1">{admin?.email ?? "—"}</p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/70 border text-sm">
                        <ShieldCheck className="w-4 h-4 text-[#1F8A3A]" />
                        <span className="font-medium">{admin?.accessGroup?.name ?? "—"}</span>
                      </span>

                      <span
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm border ${admin?.status?.name === StatusConstant.active
                            ? "bg-green-50 border-green-100 text-green-700"
                            : admin?.status?.name === StatusConstant.deleted
                              ? "bg-red-50 border-red-100 text-red-700"
                              : admin?.status?.name === StatusConstant.blocked
                                ? "bg-yellow-50 border-yellow-100 text-yellow-700"
                                : admin?.status?.name === StatusConstant.pending
                                  ? "bg-blue-50 border-blue-100 text-blue-700"
                                  : "bg-gray-50 border-gray-100 text-gray-700"
                          }`}
                      >
                        <CircleCheck className="w-4 h-4" />
                        {admin?.status?.name ?? "—"}
                      </span>
                    </div>

                    <div className="mt-5 text-sm text-gray-700 space-y-3">
                      <div className="flex items-center gap-3">
                        <Mail className="w-4 h-4 text-gray-500" />
                        <span>{admin?.email ?? "—"}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <span>{admin?.mobileNumber ?? "—"}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <span className="line-clamp-2">{admin?.address ?? "—"}</span>
                      </div>
                    </div>

                    <div className="mt-6 grid grid-cols-3 gap-3">
                      <div className="bg-gray-50 rounded-lg p-3 text-center">
                        <div className="text-xs text-gray-500">Logins</div>
                        <div className="text-lg font-semibold text-gray-800">
                          {admin?.loginCount ?? 0}
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3 text-center">
                        <div className="text-xs text-gray-500">Wrong Attempts</div>
                        <div className="text-lg font-semibold text-gray-800">
                          {admin?.wrongPasswordAttemptCount ?? 0}
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3 text-center">
                        <div className="text-xs text-gray-500">Tickets</div>
                        <div className="text-lg font-semibold text-gray-800">
                          {admin?.createdTicketsCount ?? 0}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* compact actions (mobile) */}
                  <div className="px-6 pb-6 md:hidden">
                    <div className="flex gap-2">
                      {admin?.status?.name !== "BLOCKED" ? (
                        <button
                          onClick={handleBlock}
                          className="flex-1 px-3 py-2 rounded bg-yellow-100 text-yellow-700 text-sm flex items-center justify-center gap-2"
                        >
                          <ShieldCheck className="w-4 h-4" /> Block
                        </button>
                      ) : (
                        <button
                          onClick={handleUnblock}
                          className="flex-1 px-3 py-2 rounded bg-yellow-100 text-yellow-700 text-sm flex items-center justify-center gap-2"
                        >
                          <ShieldCheck className="w-4 h-4" /> Unblock
                        </button>
                      )}
                      <button
                        onClick={handleResetPassword}
                        className="flex-1 px-3 py-2 rounded bg-blue-100 text-blue-700 text-sm flex items-center justify-center gap-2"
                      >
                        <KeyRound className="w-4 h-4" /> Reset
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Detailed info + actions */}
              <div className="md:col-span-8">
                <div className="bg-white rounded shadow-lg p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">Account Details</h3>
                      <p className="text-sm text-gray-500">All metadata and activity</p>
                    </div>

                    <div className="hidden md:flex items-center gap-3">
                      {/* big action buttons */}
                      {admin?.status?.name !== "BLOCKED" ? (
                        <button
                          onClick={handleBlock}
                          className="px-4 py-2 bg-yellow-50 border border-yellow-100 text-yellow-700 rounded flex items-center gap-2 text-sm hover:bg-yellow-100 transition"
                        >
                          <ShieldCheck className="w-4 h-4" /> Block Account
                        </button>
                      ) : (
                        <button
                          onClick={handleUnblock}
                          className="px-4 py-2 bg-yellow-50 border border-yellow-100 text-yellow-700 rounded flex items-center gap-2 text-sm hover:bg-yellow-100 transition"
                        >
                          <ShieldCheck className="w-4 h-4" /> Unblock Account
                        </button>
                      )}

                      <button
                        onClick={handlePasswordLink}
                        className="px-4 py-2 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded flex items-center gap-2 text-sm hover:bg-indigo-100 transition"
                      >
                        <LogIn className="w-4 h-4" /> Resend Activation
                      </button>

                      <button
                        onClick={handleResetPassword}
                        className="px-4 py-2 bg-blue-50 border border-blue-100 text-blue-700 rounded flex items-center gap-2 text-sm hover:bg-blue-100 transition"
                      >
                        <KeyRound className="w-4 h-4" /> Reset Password
                      </button>

                      <button
                        onClick={handleDelete}
                        className="px-3 py-2 bg-red-50 border border-red-100 text-red-700 rounded flex items-center gap-2 text-sm hover:bg-red-100 transition"
                      >
                        <Trash2 className="w-4 h-4" /> Delete
                      </button>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Last login</span>
                        <span className="text-sm font-medium text-gray-800">
                          {admin?.lastLoggedInTime ?? "—"}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Password changed</span>
                        <span className="text-sm font-medium text-gray-800">
                          {admin?.passwordChangeDate ?? "—"}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Account created</span>
                        <span className="text-sm font-medium text-gray-800">
                          {admin?.createdAt ?? "—"}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Wrong password attempts</span>
                        <span className="text-sm font-medium text-gray-800">
                          {admin?.wrongPasswordAttemptCount ?? 0}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <div className="text-sm text-gray-500">Assigned Areas</div>
                        <div className="mt-2 text-sm text-gray-700">
                          {admin?.assignedAreas?.length > 0
                            ? admin.assignedAreas.join(", ")
                            : "None"}
                        </div>
                      </div>

                      <div>
                        <div className="text-sm text-gray-500">Notes</div>
                        <div className="mt-2 text-sm text-gray-700 whitespace-pre-wrap">
                          {admin?.notes ?? "—"}
                        </div>
                      </div>

                      <div>
                        <div className="text-sm text-gray-500">Extra metadata</div>
                        <div className="mt-2 text-sm text-gray-700">
                          Role: <span className="font-medium">{admin?.role ?? "—"}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Mobile action row (bottom) */}
                  <div className="mt-6 md:hidden flex flex-col gap-2">
                    <button
                      onClick={handlePasswordLink}
                      className="w-full px-4 py-2 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded flex items-center justify-center gap-2 text-sm"
                    >
                      <LogIn className="w-4 h-4" /> Resend Activation
                    </button>
                    <button
                      onClick={handleDelete}
                      className="w-full px-4 py-2 bg-red-50 border border-red-100 text-red-700 rounded flex items-center justify-center gap-2 text-sm"
                    >
                      <Trash2 className="w-4 h-4" /> Delete Account
                    </button>
                  </div>
                </div>

                {/* Activity / Timeline area */}
                <div className="mt-6">
                  <div className="bg-white rounded shadow-lg p-6">
                    <h4 className="text-lg font-semibold text-gray-800">Recent Activity</h4>
                    <p className="text-sm text-gray-500 mt-1">Latest admin actions and logins</p>

                    <div className="mt-4 space-y-3">
                      {admin?.recentActivity && admin.recentActivity.length > 0 ? (
                        admin.recentActivity.map((act, idx) => (
                          <div key={idx} className="flex items-start gap-3">
                            <div className="w-2.5 h-2.5 rounded-full bg-[#0B5A9A] mt-2" />
                            <div className="flex-1 text-sm text-gray-700">
                              <div className="flex justify-between">
                                <div>{act.description}</div>
                                <div className="text-xs text-gray-400">{act.time}</div>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-sm text-gray-500">No recent activity</div>
                      )}
                    </div>
                  </div>
                </div>
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
      </div>
    </>
  );

};
export default ViewAdmin;
