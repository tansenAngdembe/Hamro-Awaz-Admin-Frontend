import React, { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import Sidebar from "../../components/sidebar/Sidebar";
import Header from "../../components/header/Header";
import AdminList from "../features/admin/AdminList";
import { Route, Routes, useNavigate } from "react-router-dom";
import CreateAdmin from "../features/admin/CreateAdmin";
import ViewAdmin from "../features/admin/ViewAdmin";
import ChangePassword from "../change-password/ChangePassword";
import SettingPage from "../settings/SettingPage";
import ViewProfile from "../features/admin/ViewProfile";
import ProfileMenu from "../../components/menus/ProfileMenu";
import api from "../../api/axios";
import ReusableFormImplementation from "../../components/form/ReusableFormImplementation";
import VendorList from "../features/vendor/VendorList";
import ViewVendor from "../features/vendor/ViewVendor";
import ViewClient from "../features/clients/ViewClient";
import PaymentList from "../features/payments/PaymentList";
import EditProfile2 from "../features/admin/EditProfile2";
import EditVendor from "../features/vendor/EditVendor";
import ClientList from "../features/clients/ClientList";
import CreateUser from "../features/clients/CreateClient";
import CreateUserVendor from "../features/vendor/CreateVendorUser";
import CreateVendor from "../features/vendor/CreateVendor";
import EditUserProfile from "../features/clients/EditUserProfile";
import EditVendorUser from "../features/vendor/vendoruser/EditVendorUser";
import PaymentView from "../features/payments/PaymentView";
import EmailList from "../settings/email/EmailList";
import ViewEmailTemplate from "../settings/email/ViewEmailTemplate";
import { EditEmailTemplate } from "../settings/email/EditEmailTemplate";
import BookingList from "../features/bookings/BookingList";
import BookingDetails from "../features/bookings/BookingView";
import TermsConditionsList from "../settings/termsconditions/TermsConditionsList";
import CreateTermsAndConditons from "../settings/termsconditions/CreateTermsAndConditons";
import ViewTermsAndCondtions from "../settings/termsconditions/ViewTAC";
import ActivityList from "./ActivityLog";
import AccessGroup from "../settings/accessgroup/AccessGroupView";
import AccessGroupList from "../settings/accessgroup/AccessGroupList";
import CreateAccessGroup from "../settings/accessgroup/CrateAccessGroup";
import EditAccessGroup from "../settings/accessgroup/EditAccessGroup";
import AccessGroupView from "../settings/accessgroup/AccessGroupView";
import Advertisement from "../settings/advertisement/AdvertisementList";
import CreateAdvertisement from "../settings/advertisement/CreateAdvertisement";
const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [admin, setAdmin] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  const fetchAdminDetails = () => {
    api
      .post("/view/profile")
      .then((response) => {
        if (response.data.code == 200) {
          setAdmin(response.data.data);
        }
      })
      .catch(() => {
        console.error("Something went wrong on server");
      });
  };
  const handleLogout = () => {
    api
      .get("/logout")
      .then((response) => {
        if (response.data.code == 200) {
          setSuccessMessage(response.data.message);
          window.location.replace("/login");
        } else {
          setErrorMessage(response.data.message);
        }
      })
      .catch(() => {
        setErrorMessage("Something went wrong on server");
      });
  };
  useEffect(() => {
    fetchAdminDetails();
  }, []);
  return (
    <div className="flex h-screen flex-col lg:flex-row overflow-hidden">
      <aside
        className={`fixed inset-y-0 left-0 z-40 transform bg-white shadow-lg transition-transform duration-300 lg:relative lg:translate-x-0 lg:flex ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <Sidebar closeSidebar={() => setSidebarOpen(false)} />
      </aside>
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/30 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="lg:hidden bg-white shadow-sm px-4 py-3 flex items-center justify-between">
          <button onClick={() => setSidebarOpen(true)}>
            <Menu size={24} />
          </button>
          <div className="flex items-center gap-2 text-sm text-gray-500 cursor-pointer">
            <img
              src={
                admin?.profilePictureLink
                  ? config.fileURLproperty?.admin?.profilePictureLink
                  : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRudHXH-lOcx-pWj4udssvEVtNAV5E1z1sggg&s"
              }
              alt="avatar"
              className="rounded-full w-8 h-8"
            />
            <span>
              Namaste,{" "}
              <span className="text-red-600 font-medium ">{admin?.name}</span>
            </span>
            <ProfileMenu
              items={[
                {
                  label: "View Profile",
                  onClick: () => navigate("/view/profile"),
                },
                {
                  label: "Change Password",
                  onClick: () => navigate("/changePassword"),
                },
                { label: "Activity Log", onClick: () => console.log("Log") },
                { label: "Log out", onClick: () => handleLogout() },
              ]}
            />
          </div>
        </header>
        <header className="hidden lg:block z-10 bg-white shadow-sm">
          <Header profile={admin} />
          <div className="w-full h-px bg-gray-200"></div>
        </header>
        <main className="flex-1 p-4 overflow-y-auto bg-gray-50">
          <Routes>
            <Route path="/activity-log" element={<ActivityList />} />
            <Route path="form" element={<ReusableFormImplementation />} />
            <Route path="admin" element={<AdminList />} />
            <Route path="admin/create" element={<CreateAdmin />} />
            <Route path="/admin/edit/:uniqueId" element={<EditProfile2 />} />
            <Route path="admin/view/:uniqueId" element={<ViewAdmin />} />
            <Route path="changePassword" element={<ChangePassword />} />
            <Route path="/view/profile" element={<ViewProfile />} />


            <Route path="vendor" element={<VendorList />} />
            <Route path="vendor/view/:uniqueId" element={<ViewVendor />} />
            <Route path="/vendor/create" element={<CreateVendor />} />
            <Route path="/vendor/users/create/:uniqueId" element={<CreateUserVendor />} />
            <Route path="vendor/edit/:uniqueId" element={<EditVendor />} />

            {/* Vendor User */}
            <Route path="/vendor/user/edit/:userUniqueId" element={<EditVendorUser />} />

            <Route path="users" element={<ClientList />} />
            <Route path="/users/create" element={<CreateUser />} />
            <Route path="users/view/:uniqueId" element={<ViewClient />} />
            <Route path="/user/edit/:uniqueId" element={<EditUserProfile />} />

            {/* Bookings  */}
            <Route path="bookings" element={<BookingList />} />
            <Route path="/booking/view/:bookingUniqueId" element={<BookingDetails />} />

            <Route path="payments" element={<PaymentList />} />
            <Route path="payments/view/:transactionUuid" element={<PaymentView />} />



            <Route path="/setting" element={<SettingPage />} />
            <Route path="/setting/email-templates" element={<EmailList />} />
            <Route path="/setting/email-templates/view/:templateName" element={<ViewEmailTemplate />} />
            <Route path="/setting/email-templates/edit/:templateName" element={<EditEmailTemplate />} />

            <Route path="/setting/terms-and-conditions" element={<TermsConditionsList />} />
            <Route path="/setting/terms-and-conditions/create" element={<CreateTermsAndConditons />} />
            <Route path="/setting/email-termsConditions/view/:uniqueId" element={<ViewTermsAndCondtions />} />

            <Route path="/setting/access-group" element={<AccessGroupList />} />
            <Route path="/setting/access-group/create" element={<CreateAccessGroup />} />
            <Route path="/setting/access-group/edit/:uniqueId" element={<EditAccessGroup />} />
            <Route path="/setting/access-group/view/:uniqueId" element={<AccessGroupView />} />

            <Route path="/setting/advertisement" element={<Advertisement />} />
            <Route path="/setting/advertisement/create" element={<CreateAdvertisement />} />





          </Routes>
        </main>
      </div>
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
export default Dashboard;
