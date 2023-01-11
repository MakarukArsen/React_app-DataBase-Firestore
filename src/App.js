import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import { useNavigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Clients from "./pages/clients/Clients";
import CreateOrder from "./pages/createOrder/CreateOrder";
import Login from "./pages/login/Login";
import NotFound from "./pages/notFound/NotFound";
import Order from "./pages/order/Order";
import OrderItem from "./pages/orderItem/OrderItem";
import "./styles/style.scss";

function App() {
    const auth = getAuth();
    const navigate = useNavigate();

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (!user) {
                navigate("/login");
            }
        });
    }, [auth.currentUser]);

    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route path="orders" element={<Order />} />
                <Route path="orders/create-order" element={<CreateOrder />} />
                <Route path="orders/:id" element={<OrderItem />} />
                <Route path="clients" element={<Clients />} />
            </Route>
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}

export default App;
