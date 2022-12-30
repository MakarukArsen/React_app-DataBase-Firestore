import React, { useEffect, useState } from "react";
import classes from "./Order.module.scss";
import { Link } from "react-router-dom";
import { db } from "../../firebase";
import { getDocs, collection, query, where } from "firebase/firestore";
import { v4 } from "uuid";
import { useNavigate } from "react-router-dom";
import StatusDropDown from "../../components/status-dropdown/StatusDropDown";
import Button from "../../components/UI/button/Button";
import Search from "../../components/UI/search/Search";
import useInput from "../../hooks/useInput";
const Order = () => {
    const [orders, setOrders] = useState([]);
    const [orderType, setOrderType] = useState("all");

    const navigate = useNavigate();
    const search = useInput("", {});

    useEffect(() => {
        if (orderType === "all") getOrders();
        if (orderType === "repair") getRepairOrders();
        if (orderType === "dataRecovery") getDataRecoveryOrders();
    }, [orderType]);

    const getOrders = async () => {
        const ordersRef = collection(db, "orders");
        const snapshots = await getDocs(ordersRef);
        const ordersData = snapshots.docs.map((doc) => {
            const data = doc.data();
            data.firebaseId = doc.id;
            return data;
        });
        ordersData.sort((a, b) => {
            return b.id - a.id;
        });
        setOrders(ordersData);
    };

    const getRepairOrders = async () => {
        const ordersRef = collection(db, "orders");
        const q = query(ordersRef, where("orderInfo.orderType", "==", "Ремонт"));
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
        const q = query(ordersRef, where("orderInfo.orderType", "==", "Відновлення данних"));
        const querySnapshot = await getDocs(q);
        const ordersDataRecovery = querySnapshot.docs.map((doc) => {
            const data = doc.data();
            data.firebaseId = doc.id;
            return data;
        });
        setOrders(ordersDataRecovery);
    };

    function filterOrders() {
        const filteredOrders = orders.filter((item) => {
            const clientInfo = Object.values(item.clientInfo).join("");
            if (clientInfo.toLowerCase().includes(search.value.toLowerCase())) return item;
        });
        return filteredOrders;
    }

    const filteredOrders = filterOrders();

    const openOrderPage = (firebaseId) => {
        navigate(`order/${firebaseId}`);
    };

    return (
        <div className={classes.order}>
            <div className={classes.order__content}>
                <div className={classes.order__actions}>
                    <div className="container">
                        <div className={classes.orderActions}>
                            <div className={classes.actions__search}>
                                <Search value={search.value} onChange={(e) => search.onChange(e)} />
                            </div>
                            <div className={classes.actions__buttons}>
                                <div className={classes.button}>
                                    <Button active={orderType === "all"} onClick={() => setOrderType("all")} color="black">
                                        Всі
                                    </Button>
                                </div>
                                <div className={classes.button}>
                                    <Button active={orderType === "repair"} onClick={() => setOrderType("repair")} color="black">
                                        Ремонт
                                    </Button>
                                </div>
                                <div className={classes.button}>
                                    <Button active={orderType === "dataRecovery"} onClick={() => setOrderType("dataRecovery")} color="black">
                                        Відновлення данних
                                    </Button>
                                </div>
                                <div className={classes.button}>
                                    <Link to="order/create-order">
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
                                <th className={classes.table__item}>Вартість PLN</th>
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
                                filteredOrders.length ? (
                                    filteredOrders.map((order) => {
                                        const { clientInfo, orderInfo, deviceInfo } = order;
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
                                                <td className={classes.table__item}>600,00</td>
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
                                        <td>нема результатів</td>
                                    </tr>
                                )
                            ) : (
                                <tr>
                                    <td>loading</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
export default Order;
