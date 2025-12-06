import React, { useEffect, useState } from 'react';
import { Calendar, Clock, User, Mail, MapPin, DollarSign, AlertCircle, Loader, MoveLeft, Banknote } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import Alert from '../../../components/alerts/Alert';
import api from '../../../api/axios';
import { formatDate } from '../../../utils/globalHelpFunction';

const BookingDetails = () => {
    const { bookingUniqueId } = useParams();
    const [bookingData, setBookingData] = useState({})
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const navigate = useNavigate();

    const handleBackClick = (e) => {
        e.preventDefault();
        navigate(-1);
    };

    const fetchBookingDetails = () => {
        setLoading(true);
        api
            .post("/booking/view", { bookingUniqueId })
            .then((response) => {
                if (response.data.code == 200) {
                    setBookingData(response.data.data);
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
        fetchBookingDetails();
    }, []);

    // const formatTime = (time) => {
    //     const [hours, minutes] = time?.split(':');
    //     const hour = parseInt(hours);
    //     const period = hour >= 12 ? 'PM' : 'AM';
    //     const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    //     return `${displayHour}:${minutes} ${period}`;
    // };

   

    return (
        <div className="p-2 flex flex-col overflow-x-hidden">
            <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-4">
                    <MoveLeft onClick={handleBackClick} className="cursor-pointer" />
                    <h2 className="text-xl font-semibold">VIEW DETAILS</h2>
                </div>
            </div>
            <p className="text-sm text-gray-500 mb-2">
                View Booking Details
            </p>
            <div className="w-full h-px bg-gray-200 mb-2"></div>
            {loading ? (
                <Loader />
            ) : (
                <div className=" bg-gray-50 py-4 px-2">
                    <div className="max-w-full">
                        <div className="bg-white rounded shadow-sm border border-gray-200 p-6 mb-6">
                            <div className="flex items-center justify-between mb-4">
                                <h1 className="text-xl font-bold text-gray-900">Booking Details</h1>
                                <div className="flex items-center gap-2">
                                    <span
                                        className="px-3 py-1 rounded-full text-sm font-medium text-white"
                                        style={{ backgroundColor: bookingData?.status?.color }}
                                    >
                                        {bookingData?.status?.name}
                                    </span>
                                </div>
                            </div>
                            <p className="text-sm text-gray-500">
                                Booking ID: {bookingData?.timeSlot?.uniqueId.slice(0, 8)}...
                            </p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="bg-white rounded shadow-sm border border-gray-200 p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Booking Information</h2>

                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <Calendar className="w-5 h-5 text-green-600 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-700">Date</p>
                                            <p className="text-gray-900">{formatDate(bookingData?.bookingDate)}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <Clock className="w-5 h-5 text-green-600 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-700">Time Slot</p>
                                            <p className="text-gray-900">
                                                {bookingData?.timeSlot?.startTime} - {bookingData?.timeSlot?.endTime}
                                            </p>
                                            <span
                                                className="inline-block px-2 py-1 text-xs rounded-full text-white mt-1"
                                                style={{ backgroundColor: bookingData?.timeSlot?.status?.color }}
                                            >
                                                {bookingData?.timeSlot?.status?.name}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <User className="w-5 h-5 text-green-600 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-700">Booked By</p>
                                            <p className="text-gray-900 font-medium">{bookingData?.bookedBy?.fullName}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <Mail className="w-5 h-5 text-green-600 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-700">Email</p>
                                            <p className="text-gray-900">{bookingData?.bookedBy?.email}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded shadow-sm border border-gray-200 p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Service Information</h2>

                                <div className="space-y-4">
                                    <div>
                                        <h3 className="font-semibold text-gray-900 text-lg">{bookingData?.serviceLine?.name}</h3>
                                        <p className="text-gray-600">{bookingData?.serviceLine?.description}</p>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <MapPin className="w-5 h-5 text-green-600 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-700">Futsal</p>
                                            <p className="text-gray-900 font-medium">{bookingData?.serviceLine?.vendorService?.name}</p>
                                            <p className="text-gray-600">{bookingData?.serviceLine?.vendorService?.vendor?.address}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <Banknote className="w-5 h-5 text-green-600 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-700">Pricing</p>
                                            <div className="space-y-1">
                                                <p className="text-gray-900">
                                                    <span className="font-medium">Per Slot:</span> NPR {bookingData?.serviceLine?.ratePerSlot}
                                                </p>
                                                <p className="text-gray-600 text-sm">
                                                    Daily Rate: NPR {bookingData?.serviceLine?.dailyRate}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {bookingData?.status?.name === 'CANCELLED' && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-6">
                                <div className="flex items-center gap-2">
                                    <AlertCircle className="w-5 h-5 text-red-600" />
                                    <h3 className="font-medium text-red-900">Booking Cancelled</h3>
                                </div>
                                <p className="text-red-700 mt-1 text-sm">
                                    This booking has been cancelled.
                                </p>
                            </div>
                        )}


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

export default BookingDetails;