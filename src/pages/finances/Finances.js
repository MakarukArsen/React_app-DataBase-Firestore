import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { v4 } from "uuid";
import { db } from "../../firebase";
import classes from "./Finances.module.scss";
import Select from "../../components/UI/select/Select";
import useSelect from "../../hooks/useSelect";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/loader/Loader";

const Finances = () => {
    const [orders, setOrders] = useState([]);
    const [lastVisibleOrder, setLastVisibleOrder] = useState("");
    const [payments, setPayments] = useState([]);

    const [ordersError, setOrdersError] = useState("");

    const paymentsDate = useSelect({
        defaultValue: "Цей місяць",
        options: ["Попередній місяць", "Цей місяць", "Попередній рік", "Цей рік", "Весь час"],
    });
    const paymentType = useSelect({ defaultValue: "all", options: ["cash", "card", "all"] });

    useEffect(() => {
        getPayments();
    }, [paymentsDate.value, paymentType.value]);

    const navigate = useNavigate();

    const setQuery = () => {
        const orderRef = collection(db, "orders");

        const year = new Date().getFullYear();
        const month = new Date().getMonth() + 1;

        if (paymentsDate.value === "Попередній місяць") {
            const startTime = Date.parse(`${month - 1 === 0 ? 12 : month - 1}.01.${month - 1 === 0 ? year - 1 : year}  00:00:00`);
            const endTime = Date.parse(`${month - 1 === 0 ? 12 : month - 1}.31.${month - 1 === 0 ? year - 1 : year} 23:59:59`);
            return query(
                orderRef,
                where("techData.isAnyPayments", "==", true),
                where("techData.techDate", ">=", startTime),
                where("techData.techDate", "<=", endTime)
            );
        }
        if (paymentsDate.value === "Цей місяць") {
            const startTime = Date.parse(`${month}.01.${year} 00:00:00`);
            const endTime = Date.parse(`${month}.31.${year} 23:59:59`);
            return query(
                orderRef,
                where("techData.isAnyPayments", "==", true),
                where("techData.techDate", ">=", startTime),
                where("techData.techDate", "<=", endTime)
            );
        }
        if (paymentsDate.value === "Попередній рік") {
            const startTime = Date.parse(`01.01.${year - 1} 00:00:00`);
            const endTime = Date.parse(`12.31.${year - 1} 23:59:59`);
            return query(
                orderRef,
                where("techData.isAnyPayments", "==", true),
                where("techData.techDate", ">=", startTime),
                where("techData.techDate", "<=", endTime)
            );
        }
        if (paymentsDate.value === "Цей рік") {
            const startTime = Date.parse(`01.01.${year} 00:00:00`);
            const endTime = Date.parse(`12.31.${year} 23:59:59`);
            return query(
                orderRef,
                where("techData.isAnyPayments", "==", true),
                where("techData.techDate", ">=", startTime),
                where("techData.techDate", "<=", endTime)
            );
        }
        return query(orderRef, where("techData.isAnyPayments", "==", true));
    };
    const q = setQuery();

    const getPayments = async () => {
        const snapshot = await getDocs(q);
        if (!snapshot.size) {
            setOrdersError("За даними фільтрами замовлення не знайдені");
        } else {
            setOrdersError("");
        }
        const orders = snapshot.docs.map((doc) => {
            const data = doc.data();
            data.firebaseId = doc.id;
            return data;
        });
        orders.sort((a, b) => b.id - a.id);

        let paymentsArrOfObj = [];
        const payments = snapshot.docs.map((order) => order.data().payments.forEach((payment) => paymentsArrOfObj.push(payment)));

        if (paymentType.value === "all") {
            setOrders(orders);
            setPayments(paymentsArrOfObj);
            return;
        }

        paymentsArrOfObj = [];
        const filteredOrders = orders?.filter((order) => order.techData.paymentType === paymentType.value);
        const filteredPayments = filteredOrders.map((order) => order.payments.forEach((payment) => paymentsArrOfObj.push(payment)));
        if (!filteredOrders.length) {
            setOrdersError("За даними фільтрами замовлення не знайдені");
        } else {
            setOrdersError("");
        }
        setOrders(filteredOrders);
        setPayments(paymentsArrOfObj);
    };

    const calcPayments = (payments, type) => {
        if (type === "costs") return payments.reduce((acc, value) => acc + value.repairCost, 0);
        if (type === "price") return payments.reduce((acc, value) => acc + value.repairPrice, 0);
        if (type === "income") return payments.reduce((acc, value) => acc + (value.repairPrice - value.repairCost), 0);
    };

    const navigateToOrder = (firebaseId) => {
        navigate(`/orders/${firebaseId}`);
    };

    return (
        <div className={classes.finances}>
            <div className="container">
                <div className={classes.finances__body}>
                    <div className={classes.finances__actions}>
                        <div className={classes.input}>
                            <p>Термін</p>
                            <Select {...paymentsDate} />
                        </div>
                        <div className={classes.input}>
                            <p>Тип оплати</p>
                            <Select {...paymentType} />
                        </div>
                    </div>
                    <div className={classes.finances__table}>
                        <table className={classes.table}>
                            <thead className={classes.table__header}>
                                <tr className={classes.table__row}>
                                    <th rowSpan="2" className={classes.table__item + " " + classes.table__item_big}>
                                        Загалом
                                    </th>
                                    <th className={classes.table__item}>Витрати PLN</th>
                                    <th className={classes.table__item}>Оплата клієнта PLN</th>
                                    <th className={classes.table__item}>Заробіток PLN</th>
                                </tr>
                                <tr className={classes.table__row}>
                                    <td className={classes.table__item}>{calcPayments(payments, "costs")}</td>
                                    <td className={classes.table__item}>{calcPayments(payments, "price")}</td>
                                    <td className={classes.table__item}>{calcPayments(payments, "income")}</td>
                                </tr>
                                <tr className={classes.table__row}>
                                    <th className={classes.table__item}>Замовлення</th>
                                    <th className={classes.table__item}>Витрати PLN</th>
                                    <th className={classes.table__item}>Оплата клієнта PLN</th>
                                    <th className={classes.table__item}>Заробіток PLN</th>
                                </tr>
                            </thead>
                            <tbody className={classes.table__body}>
                                {ordersError ? (
                                    <tr>
                                        <td>
                                            <h2 className={classes.ordersError}>{ordersError}</h2>
                                        </td>
                                    </tr>
                                ) : orders.length ? (
                                    orders.map((order) => {
                                        return (
                                            <tr onClick={() => navigateToOrder(order.firebaseId)} className={classes.table__row} key={v4()}>
                                                <td className={classes.table__item}>
                                                    #{order.id}. {order.orderInfo.orderDate.slice(6)}
                                                </td>
                                                <td className={classes.table__item}>{calcPayments(order.payments, "costs")}</td>
                                                <td className={classes.table__item}>{calcPayments(order.payments, "price")}</td>
                                                <td className={classes.table__item}>{calcPayments(order.payments, "income")}</td>
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
        </div>
    );
};

export default Finances;
