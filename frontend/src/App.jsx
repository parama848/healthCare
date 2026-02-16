import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Records from "./pages/Records";
import FindCare from "./pages/FindCare";
import Wallet from "./pages/Wallet";
import Profile from "./pages/Profile";
import Auth from "./pages/Auth";

import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import UploadRecord from "./pages/UploadRecord";
import Emergency from "./pages/Emergency";
import DoctorDetails from "./pages/DoctorDetails";
import BookingPage from "./pages/BookingPage";
import PaymentSuccess from "./pages/PaymentSuccess";
import RecordsPage from "./pages/RecordsPage";
import RewardsPage from "./pages/RewardsPage"

function App() {
  const token = localStorage.getItem("token");

  return (
    <>
    <Routes>

      {/* Auth Page */}
      <Route
        path="/auth"
        element={
          token ? <Navigate to="/" replace /> : <Auth />
        }
      />

      {/* Protected Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout>
              <Home />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/records"
        element={
          <ProtectedRoute>
            <Layout>
              <Records />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/find-care"
        element={
          <ProtectedRoute>
            <Layout>
              <FindCare />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/wallet"
        element={
          <ProtectedRoute>
            <Layout>
              <Wallet />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Layout>
              <Profile />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/upload-file"
        element={
          <ProtectedRoute>
            <Layout>
              <UploadRecord />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/emergency"
        element={
          <ProtectedRoute>
            <Layout>
              <Emergency />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route path="/doctor/:id" element={<DoctorDetails />} />
        <Route path="/booking/:id" element={<BookingPage />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/records" element={<RecordsPage />} />
        <Route path="/digital-reward" element={<RewardsPage />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" />} />

    </Routes>
    </>
  );
}

export default App;
