import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { X } from "lucide-react";

export default function PaymentDetailsModal({ isOpen, onClose, data }) {


    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50 border-2 " onClose={onClose}>
                {/* Background */}
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-opacity-40 backdrop-blur-sm" />
                </Transition.Child>

                {/* Modal Panel */}
                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded bg-white p-6 text-left align-middle shadow-xl transition-all border-1">

                                {/* Header */}
                                <div className="flex justify-between items-center border-b pb-3 mb-4">
                                    <Dialog.Title className="text-xl font-semibold text-gray-900">
                                        PAYMENT DETAILS
                                    </Dialog.Title>

                                    <button
                                        className="p-2 rounded-full hover:bg-gray-100"
                                        onClick={onClose}
                                    >
                                        <X size={22} />
                                    </button>
                                </div>

                                {/* Customer + Vendor Info */}
                                <div className="grid grid-cols-2 gap-6">
                                    {/* Left */}
                                    <div className="space-y-1">
                                        <p><span className="font-semibold">Customer:</span> {data?.user?.fullName}</p>
                                        <p><span className="font-semibold">Email:</span> {data?.user?.email}</p>
                                        <p><span className="font-semibold">Phone:</span> {data?.user?.phoneNumber}</p>
                                        <p><span className="font-semibold">Vendor:</span> {data?.vendor?.businessName}</p>
                                        <p><span className="font-semibold">Address:</span> {data?.vendor?.address}</p>
                                    </div>

                                    {/* Right */}
                                    <div className="space-y-1">
                                        <p><span className="font-semibold">Transaction Code:</span> {data?.transactionCode}</p>
                                        <p><span className="font-semibold">Amount:</span> {data?.totalAmount} NPR</p>

                                        <p>
                                            <span className="font-semibold">Payment Method:</span>
                                            <span
                                                className="ml-2 font-semibold px-2 py-1 rounded text-white"
                                                style={{ backgroundColor: data?.paymentMethod?.color }}
                                            >
                                                {data?.paymentMethod?.name}
                                            </span>
                                        </p>

                                        <p>
                                            <span className="font-semibold">Status:</span>
                                            <span
                                                className="ml-2 font-semibold px-2 py-1 rounded text-white"
                                                style={{ backgroundColor: data?.transactionStatus?.color }}
                                            >
                                                {data?.transactionStatus?.name}
                                            </span>
                                        </p>

                                    </div>
                                </div>

                                {/* Booking Details */}
                                {data?.bookings?.length > 0 && (
                                    <div className="mt-6">
                                        <h3 className="text-md font-semibold mb-2">Bookings</h3>
                                        {data.bookings.map((b, index) => (
                                            <div key={index} className="bg-gray-100 p-4 rounded-md mb-3">
                                                <p><span className="font-semibold">Booking Date:</span> {b.bookingDate}</p>

                                                <p>
                                                    <span className="font-semibold">Time Slot:</span>
                                                    {" "}
                                                    {b.timeSlot.startTime} - {b.timeSlot.endTime}
                                                </p>

                                                <p><span className="font-semibold">Service:</span> {b.serviceLine.name}</p>

                                                <p>
                                                    <span className="font-semibold">Rate Per Slot:</span> {b.serviceLine.ratePerSlot}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Logs Section */}
                                <div className="mt-6">
                                    <h3 className="text-md font-semibold mb-2">Payment Logs</h3>

                                    {/* Request */}
                                    <div className="bg-gray-100 rounded-md p-4 text-sm">
                                        <p className="font-medium mb-2">Request Payload:</p>
                                        <pre className="whitespace-pre-wrap text-gray-700">
                                            {data?.transactionRequestData}
                                        </pre>
                                    </div>

                                    {/* Response */}
                                    <div className="bg-gray-100 rounded-md p-4 text-sm mt-3">
                                        <p className="font-medium mb-2">Response Payload:</p>
                                        <pre className="whitespace-pre-wrap text-gray-700">
                                            {data?.transactionResponseData}
                                        </pre>
                                    </div>
                                </div>

                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
