// src/App.jsx
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Shop from "./pages/Shop";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import OtpVerify from "./pages/auth/OtpVerify";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import Cart from "./pages/Cart";
import ProductDetail from "./pages/ProductDetail";
import Checkout from "./pages/ProceedToPay";

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-stone-50 to-white">
      {/* Navbar - always visible */}
      <Navbar />
      <ScrollToTop />

      {/* Main content - grows to push footer down */}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          {/* Add more routes as you create pages */}
          <Route path="/shop" element={<Shop />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forget-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/otp-verify" element={<OtpVerify />} />
          <Route path="/checkout" element={<Checkout />} />
        </Routes>
      </main>

      {/* Footer - always at the bottom */}
      <Footer />
    </div>
  );
}

export default App;
