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
    CheckCircle,
    CreditCard,
    Calendar,
    Clock,
    Minus,
    Equal,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../../../api/axios.js";
import { formatDate, formatTime } from "../../../utils/globalHelpFunction.jsx";
import Loader from "../../../components/loader/Loader.jsx";
import Alert from "../../../components/alerts/Alert.jsx";
import config from "../../../utils/config.js";

const PaymentView = () => {
    const [paymentData, setPaymet] = useState([]);
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const { transactionUuid } = useParams();
    const navigate = useNavigate()


    const fetchPaymentDetails = () => {
        setLoading(true);
        api
            .post("/payment/view", { transactionUuid: transactionUuid })
            .then((response) => {
                if (response.data.code == 200) {
                    setPaymet(response.data.data);
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
        fetchPaymentDetails();
    }, []);
    const handleBackClick = (e) => {
        e.preventDefault();
        navigate("/payments");
    };
    return (
        <div className="p-2 flex flex-col overflow-x-hidden">
            <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-4">
                    <MoveLeft onClick={handleBackClick} className="cursor-pointer" />
                    <h2 className="text-xl font-semibold">VIEW DETAILS</h2>
                </div>
            </div>
            <p className="text-sm text-gray-500 mb-2">
                View Payments Details
            </p>
            
            <div className="w-full h-px bg-gray-200 mb-2"></div>
            {loading ? (
                <Loader />
            ) : (
                <div className="max-w-full p-6 min-h-screen">
                    <div className="bg-white rounded shadow-lg overflow-hidden">
                       <div className="flex justify-between items-center">
                       
                        <div className=" px-6 py-4">
                            <h1 className="text-2xl font-bold">Payment History</h1>
                            <p className=" text-sm mt-1">Transaction Details</p>
                        </div>
                         <div className=" px-6 py-4">
                            <h1 className="text-2xl font-bold">{paymentData?.vendor?.businessName}</h1>
                            <p className=" text-sm mt-1">{paymentData?.vendor?.address}</p>
                        </div>

                        </div>
                        

                        {/* Transaction Info */}
                        <div className="p-4 border-b border-gray-200">
                            <div className="flex justify-between items-center mb-4">
                                <div className="flex items-center space-x-3">
                                    <CheckCircle className="w-6 h-6" style={{ color: paymentData?.transactionStatus?.color }} />
                                    <span className="font-semibold text-lg" style={{ color: paymentData?.transactionStatus?.color }}>
                                        {paymentData?.transactionStatus?.name}
                                    </span>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-500">Transaction Code</p>
                                    <p className="font-mono font-bold text-gray-800">{paymentData?.transactionCode}</p>
                                </div>
                            </div>

                            <div className="flex justify-between items-center space-x-2 ">
                                <div className="flex items-center space-x-2">
                                    <CreditCard className="w-5 h-5" style={{ color: paymentData?.paymentMethod?.color }} />
                                    <span className="font-medium" style={{ color: paymentData?.paymentMethod?.color }}>
                                        Paid via {paymentData?.paymentMethod?.name}
                                    </span>

                                </div>
                                <div>
                                    <span className="font-medium">
                                        Total amount = Rs {paymentData?.totalAmount !== undefined
                                            ? Number(paymentData?.totalAmount).toFixed(3)
                                            : ""}
                                    </span>
                                </div>



                            </div>
                        </div>

                        <div className="p-6">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Booking Details</h2>

                            {paymentData?.bookings?.map((booking, index) => (
                                <div key={index} className="border border-gray-200 rounded p-4 mb-2 ">
                                    {/* Court Info */}
                                    <div className="flex items-start justify-between mb-4 ">
                                        <div className="flex-1">
                                            <h3 className="text-lg font-bold text-gray-900 mb-1">
                                                {booking?.serviceLine?.name}
                                            </h3>
                                            <p className="text-gray-600 text-sm mb-3">
                                                {booking.serviceLine.description}
                                            </p>
                                        </div>
                                        <div className="ml-4">
                                            <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                                                <img
                                                    src={`${config.fileURL}/${booking?.serviceLine?.imageUrls}`}
                                                    alt={booking?.serviceLine?.name}
                                                    className="w-full h-full object-cover rounded-lg"
                                                    onError={(e) => {
                                                        e.target.style.display = 'none';
                                                        e.target.nextSibling.style.display = 'flex';
                                                    }}
                                                />
                                                <div className="hidden w-full h-full bg-gray-300 rounded-lg items-center justify-center text-gray-500 text-xs">
                                                    Court
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="bg-blue-100 p-2 rounded-full">
                                                <Calendar className="w-5 h-5 " />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Booking Date</p>
                                                <p className="font-semibold text-gray-900">
                                                    {formatDate(booking.bookingDate)}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-3">
                                            <div className="bg-green-100 p-2 rounded-full">
                                                <Clock className="w-5 h-5 " />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Start Time</p>
                                                <p className="font-semibold text-gray-900">
                                                    {formatTime(booking.timeSlot.startTime)}
                                                </p>
                                            </div>
                                            <Equal/>
                                            <div>
                                                <p className="text-sm text-gray-500">End Time</p>
                                                <p className="font-semibold text-gray-900">
                                                    {formatTime(booking.timeSlot.endTime)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border-t border-gray-200 pt-4">
                                        <div className="flex justify-between items-center">
                                            <div className="flex space-x-6">
                                                <div>
                                                    <p className="text-sm text-gray-500">Daily Rate</p>
                                                    <p className="font-semibold text-gray-700">
                                                        NPR {booking.serviceLine.dailyRate.toLocaleString()}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">Slot Rate</p>
                                                    <p className="font-semibold ">
                                                        NPR {booking.serviceLine.ratePerSlot.toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                    </div>
                </div>)}
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
export default PaymentView;
