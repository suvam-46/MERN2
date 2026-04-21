<<<<<<< HEAD
import React, { useState, useEffect, useCallback } from "react";
=======
<<<<<<< HEAD
import React, { useState, useEffect } from "react";
>>>>>>> 2f41cbe50e00a7c815281d618a53e9c9ad00551b
import {
  BrowserRouter,
  Route,
  Routes,
  Outlet,
  Navigate,
  useLocation,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import axios from "axios";

// Existing Pages
import LoadingScreen from "./pages/LoadingScreen";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyEmail from "./pages/Customer/VerifyEmail";
import ForgotPassword from "./pages/ForgotPassword";
import HomePage from "./pages/Customer/HomePage";
import Cart from "./pages/Customer/Cart";
import Profile from "./pages/Customer/Profile";
import Shop from "./pages/Customer/Shop";
import NewArrival from "./pages/Customer/NewArrival";
import TopRated from "./pages/Customer/TopRated";
import SingleProduct from "./pages/Customer/SingleProduct";
import Wishlist from "./pages/Customer/Wishlist";

// --- NEW ORDER & PAYMENT PAGES ---
import CheckoutPage from "./pages/Customer/CheckoutPage";
import PaymentSuccess from "./pages/Customer/PaymentSuccess";
import MyOrders from "./pages/Customer/MyOrders"; 
import OrderDetails from "./pages/Customer/OrderDetails";

// Vendor Pages
import VendorDb from "./pages/Vendor/VendorDb";
import AddProducts from "./pages/Vendor/AddProducts";
import VendorProfile from "./pages/Vendor/VendorProfile";
import BannerRequest from "./pages/Vendor/BannerRequest";

// Admin Pages
import AdminHome from "./pages/Admin/AdminHome";
import AdminOrders from "./pages/Admin/AdminOrders"; 
import ApproveVendor from "./pages/Admin/ApproveVendor";
import BannerApproval from "./pages/Admin/BannerApproval";

// Components
import Navbar from "./component/Navbar";
import Footer from "./component/Footer";

// --- SCROLL TO TOP COMPONENT ---
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// --- LAYOUTS ---
const MainLayout = ({ cartCount, wishlistCount, user, setUser }) => {
  return (
    <>
      <Navbar 
        cartCount={cartCount} 
        wishlistCount={wishlistCount} 
        user={user} 
        setUser={setUser} 
      />
      <main className="min-h-screen">
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

const VendorLayout = ({ user }) => {
  if (!user || user.role?.toLowerCase() !== "vendor") {
    return <Navigate to="/login" replace />;
  }
  return (
    <div className="bg-white min-h-screen">
      <Outlet />
    </div>
  );
};

const AdminLayout = ({ user }) => {
  if (!user || user.role?.toLowerCase() !== "admin") {
    return <Navigate to="/login" replace />;
  }
  return (
    <div className="bg-slate-50 min-h-screen">
      <Outlet />
    </div>
  );
};

// --- MAIN APP COMPONENT ---
function App() {
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0); 
  const [isAppLoading, setIsAppLoading] = useState(true);

  const fetchWishlistCount = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/customer/wishlist", { withCredentials: true });
      const items = res.data.wishlist || [];
      setWishlistCount(items.length);
    } catch (err) {
      setWishlistCount(0);
    }
  }, []);

  const fetchCartCount = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/cart/getCart", { withCredentials: true });
      const count = res.data.cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;
      setCartCount(count);
    } catch (err) {
      setCartCount(0);
    }
  }, []);

  const refreshUserData = useCallback(() => {
    fetchWishlistCount();
    fetchCartCount();
  }, [fetchWishlistCount, fetchCartCount]);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
        refreshUserData();
      } catch (error) {
        console.error("Invalid session data", error);
        localStorage.removeItem("user");
      }
    }
    
    const timer = setTimeout(() => {
      setIsAppLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [refreshUserData]);

  return (
    <BrowserRouter>
      <ScrollToTop /> 
      
      {isAppLoading ? (
        <LoadingScreen />
      ) : (
        <>
          <Toaster 
            position="top-right" 
            toastOptions={{
              duration: 3000,
              style: {
                background: "#130229", 
                color: "#fff",
                borderRadius: "12px",
                fontSize: "14px",
                fontWeight: "bold"
              },
            }}
          />
          
          <Routes>
            {/* Customer Routes */}
            <Route element={
              <MainLayout 
                cartCount={cartCount} 
                wishlistCount={wishlistCount} 
                user={user} 
                setUser={setUser} 
              />
            }>
              <Route index element={<HomePage />} />
              <Route path="/homepage" element={<HomePage />} />
              <Route path="/shop" element={<Shop onCartChange={fetchCartCount} onWishlistChange={fetchWishlistCount} />} />
              <Route path="/shop/:category" element={<Shop onCartChange={fetchCartCount} onWishlistChange={fetchWishlistCount} />} />
              <Route path="/shop/new-arrivals" element={<NewArrival onCartChange={fetchCartCount} onWishlistChange={fetchWishlistCount} />} />
              <Route path="/shop/top-products" element={<TopRated onCartChange={fetchCartCount} onWishlistChange={fetchWishlistCount} />} />
              <Route path="/favorites" element={<Wishlist onCartChange={fetchCartCount} onWishlistChange={fetchWishlistCount} />} />
              <Route path="/product/:id" element={<SingleProduct onCartChange={fetchCartCount} onWishlistChange={fetchWishlistCount} />} />
              <Route path="/cart" element={<Cart onCartChange={fetchCartCount} />} />
              <Route path="/checkout" element={<CheckoutPage onCartChange={fetchCartCount} />} />
              <Route path="/payment-success" element={<PaymentSuccess onCartChange={fetchCartCount} />} />
              
              <Route path="/orders/me" element={<MyOrders />} />
              <Route path="/order/:id" element={<OrderDetails />} />
              
              <Route path="/profile" element={user ? <Profile user={user} setUser={setUser} /> : <Navigate to="/login" />} />
            </Route>

            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/ForgotPassword" element={<ForgotPassword />} />

            {/* Vendor Routes - Centralized via VendorDb */}
            <Route path="/vendor" element={<VendorLayout user={user} />}>
              <Route index element={<Navigate to="/vendor/dashboard" replace />} />
              
              {/* Dashboard, Inventory, and Orders all use the VendorDb component */}
              <Route path="dashboard" element={<VendorDb />} />
              <Route path="products" element={<VendorDb />} />
              <Route path="orders" element={<VendorDb />} />

              {/* Unique secondary pages */}
              <Route path="banners" element={<BannerRequest />} />
              <Route path="add-product" element={<AddProducts />} />
              <Route path="settings" element={<VendorProfile />} />
            </Route>

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout user={user} />}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminHome />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="order/:id" element={<OrderDetails />} />
              <Route path="verify-vendors" element={<ApproveVendor />} />
              <Route path="banner-requests" element={<BannerApproval />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </>
      )}
    </BrowserRouter>
  );
}

export default App;
=======
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
>>>>>>> f0508147ab85022abb8c8d1d3e42f06a4a0a0e30
