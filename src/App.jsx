import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Pages
import BindAccountPage from "./pages/BindAccountPage";
import BindingResultPage from "./pages/BindingResultPage";
import DirectDebitPage from "./pages/DirectDebitPage";
import PaymentResultPage from "./pages/PaymentResultPage";
import LandingPage from "./pages/LandingPage";
import MenuPage from "./pages/MenuPage";
import CheckoutPage from "./pages/CheckoutPage";
import CartPage from "./pages/CartPage";
import OrderSuccess from "./pages/OrderSuccess";
import OrderFailed from "./pages/OrderFailed";
import OrderPending from "./pages/OrderPending";
import PaymentResult from "./pages/PaymentResult";

// Context
import { CartProvider } from "./context/CartContext";

function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
          {/* Landing & Menu */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/menu" element={<MenuPage />} />

          {/* Cart & Checkout */}
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />

          {/* Order Status */}
          <Route path="/ordersuccess" element={<OrderSuccess />} />
          <Route path="/orderfailed" element={<OrderFailed />} />
          <Route path="/orderpending" element={<OrderPending />} />

          {/* DANA Direct Debit Flow */}
          <Route path="/bind-account" element={<BindAccountPage />} />
          <Route path="/binding-result" element={<BindingResultPage />} />
          <Route path="/direct-debit" element={<DirectDebitPage />} />
          <Route path="/payment-result" element={<PaymentResultPage />} />
          <Route path="/payment-result" element={<PaymentResult />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
