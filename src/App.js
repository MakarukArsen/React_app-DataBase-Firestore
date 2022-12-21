import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Clients from "./pages/clients/Clients";
import CreateOrder from "./pages/createOrder/CreateOrder";
import Order from "./pages/order/Order";
import OrderItem from "./pages/orderItem/OrderItem";
import "./styles/style.scss";
function App() {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<Order />} />
                <Route path="order/create-order" element={<CreateOrder />} />
                <Route path="order/:id" element={<OrderItem />} />
                <Route path="clients" element={<Clients />} />
            </Route>
        </Routes>
    );
}

export default App;
