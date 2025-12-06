import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios.js";
import ReusableList from "../../components/list/ReusbaleList.jsx";

const ActivityList = () => {
    const navigate = useNavigate();

    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [totalData, setTotalData] = useState(0);

    // Define columns for the table
    const columns = [
        {
            header: "Remarks",
            accessor: "remarks",
        },
        {
            header: "Target Type",
            accessor: "targetType",
        },
        {
            header: "Action",
            accessor: "actionType",
        },        
        {
            header: "Action By",
            accessor: "actionBy.name",
        },
             {
            header: "Date",
            accessor: "actionDate",
            type:"date"
        },
    ];

    const fetchActivityLog = async ({ pageSize, firstRow, page }) => {
        try {
            setLoading(true); 
            const response = await api.post("/actionLog/list", { 
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
            title="ACTIVITY LIST"
            subtitle="View Activity Log"
            columns={columns}
            data={bookings}
            loading={loading}
            fetchData={fetchActivityLog}
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

export default ActivityList;
