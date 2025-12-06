import {
    Mail,
    Phone,
    MapPin,
    ShieldCheck,
    CircleCheck,
    MoveLeft,
    UserPen,
    Edit3,
    Calendar,
    FileText,
    User,
    CheckCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Alert from "../../../components/alerts/Alert";
import Loader from "../../../components/loader/Loader.jsx";
import api from "../../../api/axios.js";
import HtmlContent from "../../../components/RichText/HtmlContent.jsx";
import { formatDate, formatTime } from "../../../utils/globalHelpFunction.jsx";

const ViewTermsAndCondtions = () => {
    const { uniqueId } = useParams();
    const [termsAndConditions, setTermsAndConditions] = useState({});
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const navigate = useNavigate();
    const handleBackClick = (e) => {
        e.preventDefault();
        navigate(-1);
    };

    const fetchTermsAndConditions = () => {
        setLoading(true);
        api
            .post("/termsAndConditions/view", {
                uniqueId: uniqueId
            })
            .then((response) => {
                if (response.data.code == 200) {
                    setTermsAndConditions(response.data.data);
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
        fetchTermsAndConditions();
    }, []);
    return (
        <>
            <div className="p-6 flex flex-col   overflow-x-hidden">
                <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-4">
                        <MoveLeft onClick={handleBackClick} className="cursor-pointer" />
                        <h2 className="text-xl font-semibold">VIEW TERMS AND CONDITIONS</h2>
                    </div>
                </div>
                <p className="text-sm text-gray-500 mb-2">
                    View  Terms And Conditions details
                </p>
                <div className="w-full h-px bg-gray-200 mb-2"></div>
                {loading ? (
                    <Loader />
                ) : (
                    <div className="  p-2">
                        <div className="max-w-full">
                            <div className="bg-white rounded shadow-lg border-b border-gray-200">
                                <div className="p-6 border-b border-gray-100">
                                    <div className="flex items-center justify-between mb-4">
                                        <h1 className="text-3xl font-bold text-gray-900">{termsAndConditions?.name}</h1>
                                        <div className="flex items-center space-x-2">
                                            <span className={`px-3 py-1 rounded text-sm font-medium ${termsAndConditions?.status === 'DRAFT'
                                                ? 'bg-yellow-100 text-yellow-800'
                                                : 'bg-green-100 text-green-800'
                                                }`}>
                                                {termsAndConditions?.status}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                                        <div className="flex items-center space-x-2">
                                            <Calendar className="w-4 h-4 text-blue-500" />
                                            <span>Effective: {formatDate(termsAndConditions?.effectiveDate)}</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <User className="w-4 h-4 text-green-500" />
                                            <span>Created by: {termsAndConditions?.createdBy?.name}</span>
                                        </div>
                                        
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="bg-white shadow-lg">
                                <div className="p-2">
                                    <HtmlContent html={termsAndConditions?.content} />
                                </div>
                            </div>

                            <div className="bg-white rounded shadow-lg border-t border-gray-200">
                                <div className="p-6">
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                                        {/* Timestamps */}
                                        <div className="text-sm text-gray-500 space-y-1">
                                            <div>Created: {formatDate(termsAndConditions?.createdAt)}</div>
                                            <div>Updated: {formatDate(termsAndConditions?.updatedAt)}</div>
                                            <div>Admin: {termsAndConditions?.createdBy?.email}</div>
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
        </>
    );
};
export default ViewTermsAndCondtions;
