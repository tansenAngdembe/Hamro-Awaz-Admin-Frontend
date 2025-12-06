import React, { useEffect, useState } from "react";
import api from "../../../api/axios";
import { useNavigate } from "react-router-dom";
import ReusableList from "../../../components/list/ReusbaleList.jsx";
import Swal from "sweetalert2";
import { StatusConstant } from "../../../constants/Constant.js";

const BookingList = () => {
    const navigate = useNavigate();

    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [totalData, setTotalData] = useState(0);

    // Define columns for the table
    const columns = [
        {
            header: "Booked By",
            accessor: "bookedBy.fullName",
        },
        {
            header: "Email",
            accessor: "bookedBy.email",
        },
        {
            header: "Booking Date",
            accessor: "bookingDate",
        },        
        {
            header: "Status",
            accessor: "status.name",
        },
    ];

    const fetchBookingList = async ({ pageSize, firstRow, page }) => {
        try {
            setLoading(true);
            const response = await api.post("/booking/list", {
                pageSize,
                firstRow,
            });

            if (response.data.code === 200) {
                setBookings(response.data.data.records);
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

    
    


  

    // Define menu actions for each row
    const menuActions = [
        {
            label: "View",
            onClick: (row) => navigate(`/booking/view/${row.uniqueId}`),
        },
        
       
    ];

    const handleBackClick = () => {
        // navigate(-1);
        return null;
    };
  

    return (
        <ReusableList
            title="BOOKING LIST"
            subtitle="Manage Bookings"
            columns={columns}
            data={bookings}
            loading={loading}
            fetchData={fetchBookingList}
            totalData={totalData}
            onBack={handleBackClick}
            menuActions={menuActions}
            successMessage={successMessage}
            errorMessage={errorMessage}
            onClearSuccess={() => setSuccessMessage("")}
            onClearError={() => setErrorMessage("")}
            initialRowsPerPage={10}
            rowsPerPageOptions={[5, 10, 25]}
        />
    );
};

export default BookingList;
