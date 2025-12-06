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
  CirclePlus,
  UserPen,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../../../../api/axios.js";
import { StatusConstant } from "../../../../constants/Constant.js";
import Loader from "../../../../components/loader/Loader.jsx";
import config from "../../../../utils/config.js";
import Alert from "../../../../components/alerts/Alert.jsx";
import { formatDate } from "../../../../utils/globalHelpFunction.jsx";

const ViewVendorUser = ({uniqueId}) => {
  const [user, setuser] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
 

  const fetchVendorUserDetails = () => {
    setLoading(true);
    api
      .post("/vendor/users/view",{uniqueId:uniqueId})
      .then((response) => {
        if (response.data.code == 200) {
          setuser(response.data.data);
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

  useEffect(() => {
    fetchVendorUserDetails();
  }, []);
  return (
    <>
      <div className="p-6 flex flex-col bg-white  overflow-x-hidden">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold"> {user?.fullName}</h2>
          </div>          
        </div>
        
        <div className="w-full h-px bg-gray-200 mb-2"></div>
        {loading ? (
          <Loader />
        ) : (
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-40 h-40 bg-gray-50 m-4 md:m-6 flex items-center justify-center">
              <img
                src={
                  user?.profilePictureName
                    ? `${config.fileURL}${user?.profilePictureName}`
                    : "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg"
                }
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1 px-4 py-4 md:py-6 flex flex-col justify-between">
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="flex flex-col gap-2">
                  <h2 className="text-xl md:text-2xl font-bold">
                    {user.name}
                  </h2>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-sm px-2 py-1 bg-violet-100 text-violet-700 rounded-full flex items-center gap-1">
                      <ShieldCheck className="w-4 h-4" />
                      {user?.vendorAccessGroup?.name || "N/A"}
                    </span>
                    <span
                      className={`text-sm px-2 py-1 rounded-full flex items-center gap-1 ${
                        user?.status?.name === StatusConstant.active
                          ? "bg-green-100 text-green-700"
                          : user?.status?.name === StatusConstant.deleted
                          ? "bg-red-100 text-red-700"
                          : user?.status?.name === StatusConstant.blocked
                          ? "bg-yellow-100 text-yellow-700"
                          : user?.status?.name === StatusConstant.pending
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      <CircleCheck className="w-4 h-4" />
                      {user?.status?.name}
                    </span>
                  </div>
                  <div className="mt-3 space-y-2 text-sm text-gray-700">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" /> {user.email}
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" /> {user.mobileNumber}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" /> {user.address}
                    </div>
                  </div>
                </div>

                <div className="text-xs text-gray-600 space-y-1 text-left md:text-right">
                  <div>Last login: {formatDate(user.lastLoggedInTime)}</div>
                  <div>Password changed: {formatDate( user.passwordChangeDate) || "N/A"}</div>
                  <div>
                    Wrong Password Attempt: {user.wrongPasswordAttemptCount}
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
    </>
  );
};
export default ViewVendorUser;
