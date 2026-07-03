import { Route, Routes } from 'react-router-dom';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import AdminOrders from './pages/admin/AdminOrders';
import AdminProducts from './pages/admin/AdminProducts';
import AdminLogin, { FraudDashboardPage } from './pages/admin/FraudDashboard';
import MLMetrics from './pages/admin/MLMetrics';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Help from './pages/Help';
import Home from './pages/Home';
import Login from './pages/Login';
import OrderConfirmation from './pages/OrderConfirmation';
import ProductDetail from './pages/ProductDetail';
import Products from './pages/Products';
import Register from './pages/Register';

function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-8">{children}</main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/help" element={<Help />} />
            <Route path="/orders/:id" element={<OrderConfirmation />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/fraud" element={<FraudDashboardPage />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
            <Route path="/admin/ml-metrics" element={<MLMetrics />} />
            <Route path="/admin/products" element={<AdminProducts />} />
          </Routes>
        </Layout>
      </CartProvider>
    </AuthProvider>
  );
}
