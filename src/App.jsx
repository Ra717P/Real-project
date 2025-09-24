import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import MenuPage from "./pages/MenuPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderSuccess from "./pages/OrderSuccess";
import OrderFailed from "./pages/OrderFailed";
import OrderPending from "./pages/OrderPending";
import CartPage from "./pages/CartPage";
import { CartProvider } from "./context/CartContext"; // ✅ provider cart

function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/ordersuccess" element={<OrderSuccess />} />
          <Route path="/orderfailed" element={<OrderFailed />} />
          <Route path="/orderpending" element={<OrderPending />} />
          <Route path="/cart" element={<CartPage />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
