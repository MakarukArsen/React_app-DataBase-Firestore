import React, { useEffect, useState } from "react";
import classes from "./Orders.module.scss";
import { Link } from "react-router-dom";
import { db } from "../../firebase";
import { getDocs, collection, query, where, orderBy, limit, startAt, endAt } from "firebase/firestore";
import { v4 } from "uuid";
import { useNavigate } from "react-router-dom";
import StatusDropDown from "../../components/status-dropdown/StatusDropDown";
import Button from "../../components/UI/button/Button";
import useInput from "../../hooks/useInput";
import Search from "../../components/UI/search/Search";
import ExportToExcel from "../../components/modals/exportToExcell/ExportToExcel";
import Modal from "../../components/modals/Modal";
import Loader from "../../components/loader/Loader";

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [orderType, setOrderType] = useState("all");
    const [ordersLimit, setOrdersLimit] = useState(30);
    const [isExcelModalActive, setExcelModalActive] = useState(false);

    const navigate = useNavigate();
    const search = useInput("");

    // Lazy Loading
    useEffect(() => {
        setOrdersLimit(30);
        if (orderType === "all") getOrders();
        if (orderType === "repair") getRepairOrders();
        if (orderType === "dataRecovery") getDataRecoveryOrders();
    }, [orderType]);

    useEffect(() => {
        window.addEventListener("scroll", loadNewData);
        return () => window.removeEventListener("scroll", loadNewData);
    });

    useEffect(() => {
        getOrders();
    }, [search.value]);

    const loadNewData = () => {
        if (document.body.scrollHeight <= window.innerHeight + window.scrollY + 100) {
            setOrdersLimit(ordersLimit + 20);
            if (orderType === "all") getOrders();
            if (orderType === "repair") getRepairOrders();
            if (orderType === "dataRecovery") getDataRecoveryOrders();
        }
    };
    // ----------------

    const getOrders = async () => {
        // Searched orders
        if (search.value.length > 2) {
            const ref = collection(db, "orders");
            const q = query(
                ref,
                orderBy("clientInfo.clientPhone"),
                orderBy("id", "desc"),
                limit(ordersLimit),
                startAt(search.value.toLowerCase()),
                endAt(search.value.toLowerCase() + "\uf8ff")
            );
            const snap = await getDocs(q);
            const data = snap.docs.map((item) => item.data());
            setOrders(data);
        } else {
            // All orders
            const ordersRef = collection(db, "orders");
            const q = query(ordersRef, orderBy("id", "desc"), limit(ordersLimit));
            const snapshots = await getDocs(q);
            const ordersData = snapshots.docs.map((doc) => {
                const data = doc.data();
                data.firebaseId = doc.id;
                return data;
            });
            setOrders(ordersData);
        }
    };

    const getRepairOrders = async () => {
        const ordersRef = collection(db, "orders");
        const q = query(ordersRef, where("orderInfo.orderType", "==", "Ремонт"), orderBy("id", "desc"), limit(ordersLimit));
        const querySnapshot = await getDocs(q);
        const ordersRepair = querySnapshot.docs.map((doc) => {
            const data = doc.data();
            data.firebaseId = doc.id;
            return data;
        });
        setOrders(ordersRepair);
    };

    const getDataRecoveryOrders = async () => {
        const ordersRef = collection(db, "orders");
        const q = query(ordersRef, where("orderInfo.orderType", "==", "Відновлення данних"), orderBy("id", "desc"), limit(ordersLimit));
        const querySnapshot = await getDocs(q);
        const ordersDataRecovery = querySnapshot.docs.map((doc) => {
            const data = doc.data();
            data.firebaseId = doc.id;
            return data;
        });
        setOrders(ordersDataRecovery);
    };

    const openOrderPage = (firebaseId) => {
        navigate(firebaseId);
    };
    return (
        <div className={classes.order}>
            <Modal isModalActive={isExcelModalActive} onClose={() => setExcelModalActive(false)}>
                <ExportToExcel onClose={() => setExcelModalActive(false)} />
            </Modal>
            <div className={classes.order__content}>
                <div className={classes.order__actions}>
                    <div className="container">
                        <div className={classes.orderActions}>
                            <div className={classes.actions__search}>
                                <Search value={search.value} onChange={(e) => search.onChange(e)} />
                            </div>
                            <div className={classes.actions__buttons}>
                                <div className={classes.button}>
                                    <Button active={(orderType === "all").toString()} onClick={() => setOrderType("all")} color="black">
                                        Всі
                                    </Button>
                                </div>
                                <div className={classes.button}>
                                    <Button active={(orderType === "repair").toString()} onClick={() => setOrderType("repair")} color="black">
                                        Ремонт
                                    </Button>
                                </div>
                                <div className={classes.button}>
                                    <Button
                                        active={(orderType === "dataRecovery").toString()}
                                        onClick={() => setOrderType("dataRecovery")}
                                        color="black">
                                        Відновлення данних
                                    </Button>
                                </div>
                                <div className={classes.button}>
                                    <Button onClick={() => setExcelModalActive(true)} color="blue">
                                        Excel
                                    </Button>
                                </div>
                                <div className={classes.button}>
                                    <Link to="create-order">
                                        <Button color="blue">Create order</Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={classes.order__table}>
                    <table className={classes.table}>
                        <thead className={classes.table__header}>
                            <tr className={classes.table__row}>
                                <th className={classes.table__item}>Замовлення</th>
                                {/* <th className={classes.table__item}>Оновлено</th> */}
                                <th className={classes.table__item}>Статус</th>
                                <th className={classes.table__item}>Клієнт</th>
                                {/* <th className={classes.table__item}>Прийняв замовлення</th> */}
                                {/* <th className={classes.table__item}>Виконав замовлення</th> */}
                                <th className={classes.table__item}>Вартість</th>
                                <th className={classes.table__item}>Тип</th>
                                <th className={classes.table__item}>Виробник</th>
                                <th className={classes.table__item}>Модель</th>
                                {/* <th className={classes.table__item}>Стан</th> */}
                                {/* <th className={classes.table__item}>Несправність</th> */}
                                {/* <th className={classes.table__item + " " + classes.nowrap}>IMEI / SN</th> */}
                            </tr>
                        </thead>
                        <tbody className={classes.table__body}>
                            {orders.length ? (
                                orders.map((order) => {
                                    const { clientInfo, orderInfo, deviceInfo, payment } = order;
                                    return (
                                        <tr onClick={() => openOrderPage(order.firebaseId)} key={v4()} className={classes.table__row}>
                                            <td className={classes.table__item}>
                                                <span>#{order.id}</span> <br /> {orderInfo.orderDate}
                                            </td>
                                            {/* <td className={classes.table__item}>{orderInfo.orderUpdatedDate}</td> */}
                                            <td className={classes.table__item + " " + classes.nowrap}>
                                                <StatusDropDown firebaseId={order.firebaseId} order={order}></StatusDropDown>
                                            </td>
                                            <td className={classes.table__item}>
                                                {clientInfo.clientName}
                                                <br />
                                                {clientInfo.clientPhone}
                                            </td>
                                            {/* <td className={classes.table__item}>{orderInfo.orderAccepted}</td> */}
                                            {/* <td className={classes.table__item}>{orderInfo.orderExecutor}</td> */}
                                            <td className={classes.table__item}>
                                                {Object.keys(payment).length
                                                    ? payment.length > 1
                                                        ? `${payment.reduce((acc, value) => acc + value.repairPrice, 0)} PLN`
                                                        : `${payment[0].repairPrice} PLN`
                                                    : "-"}
                                            </td>
                                            <td className={classes.table__item}>{orderInfo.orderType}</td>
                                            <td className={classes.table__item}>{deviceInfo.deviceType}</td>
                                            <td className={classes.table__item}>{deviceInfo.deviceProducer}</td>
                                            <td className={classes.table__item}>{deviceInfo.deviceModel}</td>
                                            {/* <td className={classes.table__item}>{deviceInfo.deviceState}</td> */}
                                            {/* <td className={classes.table__item}>{deviceInfo.deviceBreakage}</td> */}
                                            {/* <td className={classes.table__item}>{deviceInfo.deviceImeiSn}</td> */}
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td>
                                        <Loader />
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
export default Orders;