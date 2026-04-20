import React, { useEffect, useState, useRef } from "react";
import { CirclePlus, MoveLeft } from "lucide-react";
import Alert from "../alerts/Alert";
import TableMenu from "../menus/TableMenu.jsx";
import Loader from "../loader/Loader.jsx";
import { formatDate } from "../../utils/globalHelpFunction.jsx";
import DataNotFound from "../loader/DataNotFound.jsx";

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
  searchFields = []

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

  if (column.type === "boolean") {
    if (value === true) {
      return <span style={{ color: "green", fontWeight: 500 }}>✔ Verified</span>;
    }
    return <span style={{ color: "gray" }}>Not Verified</span>;
  }

  if (typeof column.accessor === "function") {
    return column.accessor(row);
  }

  // ✅ Handle plain objects — join their string values
  if (value !== null && typeof value === "object" && !Array.isArray(value)) {
    const display = Object.values(value)
      .filter((v) => typeof v === "string")
      .join(", ");
    return display || "N/A";
  }

  return value ?? "N/A";
};

  const getMenuActionsForRow = (row) => {
    return menuActions.map((action) => ({
      label:
        typeof action.label === "function" ? action.label(row) : action.label,
      onClick: () => action.onClick(row),
    }));
  };

  // ---- Internal filter state ----
  const [filters, setFilters] = useState(
    searchFields.reduce((acc, field) => ({ ...acc, [field.key]: "" }), {})
  );

  // ---- Debounce text fields ----
  const [debouncedFilters, setDebouncedFilters] = useState(filters);
  useEffect(() => {
    const handler = setTimeout(() => {
      const textFields = searchFields
        .filter(f => f.type === "text")
        .reduce((acc, f) => ({ ...acc, [f.key]: filters[f.key] }), {});
      const merged = { ...filters, ...textFields };
      setDebouncedFilters(merged);
    }, 400);
    return () => clearTimeout(handler);
  }, [filters]);

  // ---- Build backend param object dynamically ----
  // --- Build backend param object dynamically ---
  const buildBackendParam = (currentFilters = filters) => {
    const param = {};
    searchFields.forEach(field => {
      const value = currentFilters[field.key];
      if (value && value !== "") {
        param[field.backendKey || field.key] = value; // use backendKey if provided
      }
    });
    return param;
  };


  // ---- Fetch data whenever filters change ----
  useEffect(() => {
    if (fetchDataRef.current) {
      fetchDataRef.current({
        pageSize: ROWS_PER_PAGE,
        firstRow: (page - 1) * ROWS_PER_PAGE,
        page,
        param: buildBackendParam(debouncedFilters), // <-- send param
      });
    }
  }, [page, ROWS_PER_PAGE, debouncedFilters]);






  return (
    <div className={className}>
      <div className="p-2 overflow-x-auto bg-bgPrimary">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-1">

            {showBackButton && title && (
              <MoveLeft onClick={onBack} className="cursor-pointer" />
            )}
            <h4 className=" font-semibold">{title}</h4>
          </div>
          {showAddButton && onAdd && (
            <button
              onClick={onAdd}
              className="flex items-center gap-1 bg-primary text-bgPrimary px-1 py-1 hover:bg-secondary transition-colors cursor-pointer shadow-sm"
            >
              <CirclePlus size={18} />
              <span className="text-sm font-semibold">{addButtonText}</span>
            </button>
          )}
        </div>

        {subtitle && <p className="text-sm text-gray-500 mb-2">{subtitle}</p>}

        <div className="w-full h-px bg-gray-200 mb-2"></div>


        <div>
          <div className="flex justify-between rounded shadow-sm border border-bgPrimary p-1 mb-2">
            {showPagination && (
              <div className="flex items-center gap-2  text-[14px] text-gray-700">
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
            <div className="flex flex-wrap gap-3 ">
              {searchFields.map((field) => {
                if (field.type === "text" || field.type === "email") {
                  return (
                    <div key={field.key} className="relative">
                      <input
                        type={field.type}
                        placeholder={`Search by ${field.label}`}
                        value={filters[field.key]}
                        onChange={(e) =>
                          setFilters((prev) => ({
                            ...prev,
                            [field.key]: e.target.value,
                          }))
                        }
                        className="
              h-10 w-56 rounded-lg border border-gray-300 bg-gray-50
              px-4 text-sm text-gray-800
              placeholder-gray-400
              focus:border-secondary focus:bg-white focus:outline-none
              focus:ring-2 focus:ring-blue-100
              transition
            "
                      />
                    </div>
                  );
                }

                if (field.type === "select") {
                  return (
                    <div key={field.key} className="relative">
                      <select
                        value={filters[field.key]}
                        onChange={(e) => {
                          setFilters((prev) => ({
                            ...prev,
                            [field.key]: e.target.value,
                          }));
                          setPage(1);
                        }}
                        className="
              h-10 w-56 rounded-lg border border-gray-300 bg-gray-50
              px-4 pr-8 text-sm text-gray-800
              focus:border-secondary focus:bg-white focus:outline-none
              focus:ring-2 focus:ring-blue-100
              transition appearance-none cursor-pointer
            "
                      >
                        <option value="">All {field.label}</option>
                        {field.options.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>

                      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                        ▼
                      </span>
                    </div>
                  );
                }

                return null;
              })}
            </div>
          </div>
          {/* {
            loading ? (
              <Loader />
            ) : ( */}
          <table className="w-full text-sm border border-gray-200 rounded-md overflow-x-auto">
            <thead className="bg-gray-100 text-[14px] uppercase">
              <tr>
                {menuActions.length > 0 && (
                  <th className="px-3 py-3 text-left"></th>
                )}
                
                {columns.map((column, idx) => (
                  <th key={idx} className="px-4 py-3 text-left border-white border-l-4">
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.length === 0 && !loading ? (
                <tr>
                  <td colSpan={columns.length + (menuActions.length ? 1 : 0)}>
                    <DataNotFound />
                  </td>
                </tr>
              ) : (
                data.map((row, idx) => (
                  <tr
                    key={row.uniqueId || idx}
                    className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    {menuActions.length > 0 && (
                      <td className="px-3 py-0 absolute">
                        <TableMenu items={getMenuActionsForRow(row)} />
                      </td>
                    )}
                    {columns.map((column, colIdx) => (
                      <td key={colIdx} className="px-4 py-3">
                        {renderCellContent(row, column)}
                      </td>
                    ))}
                  </tr>
                )))
              }
            </tbody>
          </table>

          {/* } */}


          {/* )} */}
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
                      ? "bg-primary text-white"
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

      </div>

      {/* {successMessage && (
        <Alert
          type="success"
          message={successMessage}
          duration={1000}
          onClose={onClearSuccess}
        />
      )} */}

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
