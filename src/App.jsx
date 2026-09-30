import React from 'react';
import { Routes, Route } from 'react-router-dom';

import { Toaster } from './components/ui/toaster';
import Addfooditem from './component/Addfooditem';
import Addemployee from './component/Addemployee';
import PaymentForm from './component/PaymentForm';
import Homepage from './component/Homepage';

import AdminLayout from './component/AdminLayout';

import Layout from './component/Frontend/Layout';
import Landingpage from './component/Frontend/Landingpage';
import About from './component/Frontend/About';
import Gallery from './component/Frontend/Gallery';
import Contact from './component/Frontend/Contact';
import FullGallery from './component/Frontend/FullGallery';
import FullMenu from './component/Frontend/FullMenu';

import MenuPage from './pages/MenuPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import MyOrdersPage from './pages/MyOrdersPage';
import AdminOrdersPage from './pages/AdminOrdersPage';
import AdminBookingsPage from './pages/AdminBookingsPage';

import { CartProvider } from './context/CartContext';

const App = () => {
  return (
    <CartProvider>
      <Toaster />

      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Landingpage />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/full-menu" element={<FullMenu />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-success" element={<OrderSuccessPage />} />
          <Route path="/my-orders" element={<MyOrdersPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/fullGallery" element={<FullGallery />} />
          <Route path="/contact" element={<Contact />} />
        </Route>

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Homepage />} />
          <Route path="food" element={<Addfooditem />} />
          <Route path="employee" element={<Addemployee />} />
          <Route path="payment" element={<PaymentForm />} />
          <Route path="orders" element={<AdminOrdersPage />} />
          <Route path="bookings" element={<AdminBookingsPage />} />
        </Route>
      </Routes>
    </CartProvider>
  );
};

export default App;
