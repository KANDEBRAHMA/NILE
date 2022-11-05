import { Routes, Route } from "react-router-dom";
import Home from "../components/Home";
import SignIn from "../components/SignIn";
import SignUp from "../components/SignUp";
import ForgotPassword from "../pages/forgot-password";
import SearchEmployees from "../pages/search-employees";
import UserLandingPage from "../pages/user-landing-page";
import AdminLandingPage from "../pages/admin-landing-page";
import React from "react";
import AssignDelivery from "../pages/assign-delivery";
import OldDeliveries from "../pages/old-deliveries";
import DriverLanding from "../pages/driver-landing";
import UserProfile from "../components/UserProfile";
import Map from "../components/Maps";
import AdminApproveRequest from "../pages/AdminApproveRequest";
import Services from "../pages/modify-services";

function UserRoutes() {
  return (
    <div>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/landing-page" element={<Home />} />
        <Route exact path="/SignIn" element={<SignIn />} />
        <Route exact path="/SignUp" element={<SignUp />} />
        <Route exact path="/ForgotPassword" element={<ForgotPassword />} />
        <Route exact path="/userProfile" element={<UserProfile />} />
        <Route exact path="/Location" element={<Map />} />
      </Routes>
    </div>
  );
}

function DriverRoutes() {
  return (
    <div>
      <Routes>
        <Route exact path="/" element={<DriverLanding />} />
        <Route exact path="/landing-page" element={<DriverLanding />} />
        <Route exact path="/SignIn" element={<SignIn />} />
        <Route exact path="/SignUp" element={<SignUp />} />
        <Route exact path="/userProfile" element={<UserProfile />} />
        <Route exact path="/Location" element={<Map />} />
      </Routes>
    </div>
  );
}

function AdminRoutes() {
  return (
    <div>
      <Routes>
        <Route exact path="/" element={<AdminLandingPage />} />
        <Route exact path="/landing-page" element={<AdminLandingPage />} />
        <Route exact path="/search-employees" element={<SearchEmployees />} />
        <Route exact path="/old-deliveries" element={<OldDeliveries />} />
        <Route exact path="/assign-delivery" element={<AssignDelivery />} />
        <Route exact path="/userProfile" element={<UserProfile />} />
        <Route exact path="/admin" element={<AdminApproveRequest />} />
        <Route exact path="/modifyservices" element={<Services />} />
        <Route exact path="/Location" element={<Map />} />
      </Routes>
    </div>
  );
}

function NormalRoutes() {
  return (
    <div>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/landing-page" element={<Home />} />
        <Route exact path="/SignIn" element={<SignIn />} />
        <Route exact path="/SignUp" element={<SignUp />} />
        <Route exact path="/ForgotPassword" element={<ForgotPassword />} />
        <Route exact path="/userProfile" element={<UserProfile />} />
        <Route exact path="/Location" element={<Map />} />
      </Routes>
    </div>
  );
}

export { UserRoutes, AdminRoutes, DriverRoutes, NormalRoutes };
