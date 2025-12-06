import React, { useEffect, useState } from "react";
import api from "../../../api/axios";
import { useNavigate } from "react-router-dom";
import ReusableList from "../../../components/list/ReusbaleList.jsx";
import Swal from "sweetalert2";
import { StatusConstant } from "../../../constants/Constant.js";
import PaymentDetailsModal from "./PaymentDetailModal.jsx";

const PaymentList = () => {
    const navigate = useNavigate();

    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [totalData, setTotalData] = useState(0);
    const [open, setOpen] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState({});

    // Define columns for the table
    const columns = [
        {
            header: "Name",
            accessor: "user.fullName",
        },
        {
            header: "Transaction Uuid",
            accessor: "transactionUuid",
        },
        {
            header: "Amount ",
            accessor: "totalAmount",
        },
        {
            header: "Date",
            accessor: "transactionRequestDate",
            type: "date"
        },
        {
            header: "Method",
            accessor: "paymentMethod.name",
        },
        {
            header: "Transaction Code",
            accessor: "transactionCode",
        },
        {
            header: "Futsal",
            accessor: "vendor.businessName"
        },
        {
            header: "Status",
            accessor: "transactionStatus.name",
        }


    ];

    const fetchPaymentList = async ({ pageSize, firstRow, page }) => {
        try {
            setLoading(true);
            const response = await api.post("/payment/list", {
                pageSize,
                firstRow,
            });

            if (response.data.code === 200) {
                setAdmins(response.data.data.records);
                setTotalData(response.data.data.total);
                setSuccessMessage(response.data.message);
            } else {
                setErrorMessage(response.data.message);
            }
        } catch (error) {
            setErrorMessage("Something went wrong on server");
        } finally {
            setLoading(false);
        }
    };

    const handleComplete = (transactionUuid) => {
        Swal.fire({
            title: "Are you sure you want to complete this payment?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#00425A",
            cancelButtonColor: "#FC0000",
            confirmButtonText: "Complete",
            html: `
            <input 
                type="text" 
                id="transactionCode" 
                class="swal2-input" 
                placeholder="Enter transaction code"
                style="width: 85%; font-size: 15px; text-align: left;" 
            />
            <textarea 
                id="completeReason" 
                class="swal2-textarea" 
                placeholder="Enter reason for completing" 
                rows="3" 
                style="width: 85%; resize: none; height: 100px; font-size: 15px; text-align: left;">
            </textarea>
        `,
            preConfirm: () => {
                const transactionCode = Swal.getPopup().querySelector("#transactionCode").value;
                const remarks = Swal.getPopup().querySelector("#completeReason").value;

                if (!transactionCode) {
                    Swal.showValidationMessage("Please enter a transaction code.");
                } else if (!remarks) {
                    Swal.showValidationMessage("Please enter a reason for completing.");
                }

                return { transactionCode, remarks };
            },
        }).then((result) => {
            if (result.isConfirmed) {
                api
                    .post("/payment/complete", {
                        transactionUniqueId: transactionUuid,
                        transactionCode: result.value.transactionCode,
                        remarks: result.value.remarks

                    })
                    .then((response) => {
                        if (response.data.code === 200) {
                            Swal.fire("Completed!", response.data.message, "success");
                            fetchPaymentList({ pageSize: 10, firstRow: 0, page: 1 });
                        } else {
                            Swal.fire("Error", response.data.message, "error");
                        }
                    })
                    .catch(() => {
                        Swal.fire("Error", "Something went wrong on the server", "error");
                    });
            }
        });
    };

    const fetchPaymentDetail = async (transactionUuid) => {
        setLoading(true);
        api
            .post("/payment/view", { transactionUuid: transactionUuid })
            .then((response) => {
                if (response.data.code == 200) {
                    setSelectedPayment(response.data.data);
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

    // Define menu actions for each row
    const menuActions = [
        {
            label: "View",
            onClick: (row) => {
                fetchPaymentDetail(row.transactionUuid)
                    setOpen(true)
            }
        },
        {
            label: "Complete",
            onClick: (row) => handleComplete(row.transactionUuid),
        },

    ];

    const handleBackClick = () => {
        // navigate(-1);
        return null
    };



    return (
        <>
            <PaymentDetailsModal
                isOpen={open}
                onClose={() => setOpen(false)}
                data={selectedPayment}
            />
            <ReusableList
                // Required props
                title="Payments LIST"
                subtitle="Manage Payments"
                columns={columns}
                data={admins}
                loading={loading}
                // API/Data props
                fetchData={fetchPaymentList}
                totalData={totalData}
                // Action props
                onBack={handleBackClick}
                menuActions={menuActions}
                // Alert props
                successMessage={successMessage}
                errorMessage={errorMessage}
                onClearSuccess={() => setSuccessMessage("")}
                onClearError={() => setErrorMessage("")}
                // Pagination props
                initialRowsPerPage={10}
                rowsPerPageOptions={[5, 10, 25]}
            />
        </>
    );
};

export default PaymentList;
