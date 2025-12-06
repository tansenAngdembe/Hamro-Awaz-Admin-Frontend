import React, { useEffect, useState, useRef } from "react";
import { CirclePlus, MoveLeft } from "lucide-react";
import Alert from "../alerts/Alert";
import TableMenu from "../menus/TableMenu.jsx";
import Loader from "../loader/Loader.jsx";
import { formatDate } from "../../utils/globalHelpFunction.jsx";

const ReusableList = ({
  // Required props
  title,
  subtitle,
  columns,
  data,
  loading,

  // API/Data props
  fetchData,
  totalData,

  // Action props
  onBack,
  onAdd,
  addButtonText = "Add New",
  menuActions = [],

  // Pagination props
  initialRowsPerPage = 10,
  showPagination = true,

  // Alert props
  successMessage = "",
  errorMessage = "",
  onClearSuccess,
  onClearError,

  // Customization props
  className = "relative",
  showAddButton = true,
  showBackButton = true,
  rowsPerPageOptions = [5, 10, 25],
}) => {
  const [ROWS_PER_PAGE, setRowsPerPage] = useState(initialRowsPerPage);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const fetchDataRef = useRef(fetchData);

  // Update ref when fetchData changes
  useEffect(() => {
    fetchDataRef.current = fetchData;
  }, [fetchData]);

  useEffect(() => {
    if (totalData) {
      setTotalPages(Math.ceil(totalData / ROWS_PER_PAGE));
    }
  }, [totalData, ROWS_PER_PAGE]);

  useEffect(() => {
    if (fetchDataRef.current) {
      fetchDataRef.current({
        pageSize: ROWS_PER_PAGE,
        firstRow: (page - 1) * ROWS_PER_PAGE,
        page,
      });
    }
  }, [page, ROWS_PER_PAGE]); // Remove fetchData from dependency array

  const handleRowsPerPageChange = (newRowsPerPage) => {
    setPage(1);
    setRowsPerPage(Number(newRowsPerPage));
  };

  const renderCellContent = (row, column) => {
    if (column.render) {
      return column.render(row);
    }

    const value = column.accessor
      .split(".")
      .reduce((obj, key) => obj?.[key], row);
    if (column.type === "date" && value) {
      return formatDate(value);
    }
    return value || "";
  };

  const getMenuActionsForRow = (row) => {
    return menuActions.map((action) => ({
      label:
        typeof action.label === "function" ? action.label(row) : action.label,
      onClick: () => action.onClick(row),
    }));
  };

  return (
    <div className={className}>
      <div className="p-6 overflow-x-auto bg-white">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">

            {showBackButton && title && (
              <MoveLeft onClick={onBack} className="cursor-pointer" />
            )}
            <h2 className="text-xl font-semibold">{title}</h2>
          </div>
          {showAddButton && onAdd && (
            <button
              onClick={onAdd}
              className="flex items-center gap-1 bg-[#2c9d2c] text-white px-2 py-2 hover:bg-green-700 transition-colors cursor-pointer shadow-sm"
            >
              <CirclePlus size={18} />
              <span className="text-sm font-semibold">{addButtonText}</span>
            </button>
          )}
        </div>

        {subtitle && <p className="text-sm text-gray-500 mb-4">{subtitle}</p>}

        <div className="w-full h-px bg-gray-200 mb-4"></div>

        {loading ? (
          <Loader />
        ) : (
          <div>
            {showPagination && (
              <div className="flex items-center gap-2 mb-5 text-[14px] text-gray-700">
                <span>Show</span>
                <select
                  value={ROWS_PER_PAGE}
                  onChange={(e) => handleRowsPerPageChange(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                  {rowsPerPageOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <span>entries</span>
              </div>
            )}

            <table className="w-full text-sm border border-gray-200 rounded-md overflow-x-auto">
              <thead className="bg-gray-100 text-[14px] uppercase">
                <tr>
                  {menuActions.length > 0 && (
                    <th className="px-4 py-3 text-left"></th>
                  )}
                  {columns.map((column, idx) => (
                    <th key={idx} className="px-4 py-3 text-left">
                      {column.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, idx) => (
                  <tr
                    key={row.uniqueId || idx}
                    className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    {menuActions.length > 0 && (
                      <td className="px-4 py-0 absolute">
                        <TableMenu items={getMenuActionsForRow(row)} />
                      </td>
                    )}
                    {columns.map((column, colIdx) => (
                      <td key={colIdx} className="px-4 py-3">
                        {renderCellContent(row, column)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>

            {showPagination && totalData > 0 && (
              <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
                <span>
                  Showing {ROWS_PER_PAGE * (page - 1) + 1} to{" "}
                  {Math.min(page * ROWS_PER_PAGE, totalData)} of {totalData}{" "}
                  entries
                </span>

                <div className="space-x-1">
                  <button
                    onClick={() => setPage((p) => Math.max(p - 1, 1))}
                    disabled={page === 1}
                    className="px-3 py-1 border rounded bg-white hover:bg-gray-100 disabled:opacity-50"
                  >
                    Previous
                  </button>

                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i + 1)}
                      className={`px-3 py-1 border rounded ${page === i + 1
                          ? "bg-[#2c9d2c] text-white"
                          : "bg-white hover:bg-gray-100"
                        }`}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button
                    onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                    disabled={page === totalPages}
                    className="px-3 py-1 border rounded bg-white hover:bg-gray-100 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {successMessage && (
        <Alert
          type="success"
          message={successMessage}
          duration={1000}
          onClose={onClearSuccess}
        />
      )}

      {errorMessage && (
        <Alert
          type="error"
          message={errorMessage}
          duration={1000}
          onClose={onClearError}
        />
      )}
    </div>
  );
};

export default ReusableList;
