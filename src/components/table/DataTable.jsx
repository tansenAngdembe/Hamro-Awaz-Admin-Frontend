import {
  ArrowLeft,
  ArrowLeftToLine,
  ChevronLeft,
  CirclePlus,
  MoveLeft,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const tableData = [
  {
    first: "Airi",
    last: "Satou",
    position: "Accountant",
    office: "Tokyo",
    salary: "$162,700",
  },
  {
    first: "Angelica",
    last: "Ramos",
    position: "Chief Executive Officer (CEO)",
    office: "London",
    salary: "$1,200,000",
  },
  {
    first: "Ashton",
    last: "Cox",
    position: "Junior Technical Author",
    office: "San Francisco",
    salary: "$86,000",
  },
  {
    first: "Bradley",
    last: "Greer",
    position: "Software Engineer",
    office: "London",
    salary: "$132,000",
  },
  {
    first: "Brenden",
    last: "Wagner",
    position: "Software Engineer",
    office: "San Francisco",
    salary: "$206,850",
  },
  {
    first: "Brielle",
    last: "Williamson",
    position: "Integration Specialist",
    office: "New York",
    salary: "$372,000",
  },
  {
    first: "Bruno",
    last: "Nash",
    position: "Software Engineer",
    office: "London",
    salary: "$163,500",
  },
  {
    first: "Caesar",
    last: "Vance",
    position: "Pre-Sales Support",
    office: "New York",
    salary: "$106,450",
  },
  {
    first: "Cara",
    last: "Stevens",
    position: "Sales Assistant",
    office: "New York",
    salary: "$145,600",
  },
  {
    first: "Cedric",
    last: "Kelly",
    position: "Senior Javascript Developer",
    office: "Edinburgh",
    salary: "$433,060",
  },
];

const ROWS_PER_PAGE = 7;

const DataTable = () => {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(tableData.length / ROWS_PER_PAGE);

  const currentRows = tableData.slice(
    (page - 1) * ROWS_PER_PAGE,
    page * ROWS_PER_PAGE
  );
  const navigate = useNavigate();
  const handleBackClick = (e) => {
    navigate(-1);
  };
  return (
    <div className="p-6 overflow-x-auto bg-white">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <MoveLeft onClick={handleBackClick} className="cursor-pointer" />
          <h2 className="text-xl font-semibold">ADMIN LIST</h2>
        </div>
        <div className="flex items-center gap-1 bg-blue-600 text-white px-2 py-2 hover:bg-blue-700 transition-colors cursor-pointer shadow-sm">
          <CirclePlus size={18} />
          <span className="text-sm font-semibold">Create Admin</span>
        </div>
      </div>
      <p className="text-sm text-gray-500 mb-4">Manage Cosmotech Admins</p>
      <div className="w-full h-px bg-gray-200 mb-4"></div>
      <div className="flex items-center gap-2 mb-5 text-[14px] text-gray-700">
        <span>Show</span>
        <select
          //   value={rowsPerPage}
          //   onChange={(e) => {
          //     // setRowsPerPage(Number(e.target.value));
          //     setPage(1);
          //   }}
          className="border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={25}>25</option>
        </select>
        <span>entries</span>
      </div>

      <table className="min-w-full text-sm border border-gray-200 rounded-md overflow-hidden">
        <thead className="bg-gray-100 text-[14px] uppercase">
          <tr>
            <th className="px-4 py-3 text-left">First name</th>
            <th className="px-4 py-3 text-left">Last name</th>
            <th className="px-4 py-3 text-left">Position</th>
            <th className="px-4 py-3 text-left">Office</th>
            <th className="px-4 py-3 text-left">Salary</th>
          </tr>
        </thead>
        <tbody>
          {currentRows.map((row, idx) => (
            <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
              <td className="px-4 py-3">{row.first}</td>
              <td className="px-4 py-3">{row.last}</td>
              <td className="px-4 py-3">{row.position}</td>
              <td className="px-4 py-3">{row.office}</td>
              <td className="px-4 py-3">{row.salary}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
        <span>
          Showing {ROWS_PER_PAGE * (page - 1) + 1} to{" "}
          {Math.min(page * ROWS_PER_PAGE, tableData.length)} of{" "}
          {tableData.length} entries
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
              className={`px-3 py-1 border rounded ${
                page === i + 1
                  ? "bg-blue-500 text-white"
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
    </div>
  );
};
export default DataTable;
