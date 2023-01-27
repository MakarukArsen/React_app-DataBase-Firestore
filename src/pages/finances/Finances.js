import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { v4 } from "uuid";
import { db } from "../../firebase";
import classes from "./Finances.module.scss";
import Select from "../../components/UI/select/Select";
import useSelect from "../../hooks/useSelect";
const Finances = () => {
    const [orders, setOrders] = useState([]);
    const [payments, setPayments] = useState([]);

    const paymentsDate = useSelect({
        defaultValue: "Цей місяць",
        options: ["Попередній місяць", "Цей місяць", "Попередній рік", "Цей рік", "Весь час"],
    });
    const paymentType = useSelect({ defaultValue: "all", options: ["cash", "card", "all"] });

    useEffect(() => {
        getPayments();
    }, [paymentsDate.value, paymentType.value]);

    const setQuery = () => {
        const orderRef = collection(db, "orders");

        const year = new Date().getFullYear();
        const month = new Date().getMonth() + 1;

        if (paymentsDate.value === "Попередній місяць") {
            const startTime = Date.parse(`${month - 1 === 0 ? 12 : month - 1}.01.${month - 1 === 0 ? year - 1 : year}`);
            const endTime = Date.parse(`${month - 1 === 0 ? 12 : month - 1}.31.${month - 1 === 0 ? year - 1 : year}`);
            return query(
                orderRef,
                where("techData.isAnyPayments", "==", true),
                where("techData.techDate", ">=", startTime),
                where("techData.techDate", "<=", endTime)
            );
        }
        if (paymentsDate.value === "Цей місяць") {
            const startTime = Date.parse(`${month}.01.${year}`);
            const endTime = Date.parse(`${month}.31.${year}`);
            return query(
                orderRef,
                where("techData.isAnyPayments", "==", true),
                where("techData.techDate", ">=", startTime),
                where("techData.techDate", "<=", endTime)
            );
        }
        if (paymentsDate.value === "Попередній рік") {
            const startTime = Date.parse(`01.01.${year - 1}`);
            const endTime = Date.parse(`12.31.${year - 1}`);
            return query(
                orderRef,
                where("techData.isAnyPayments", "==", true),
                where("techData.techDate", ">=", startTime),
                where("techData.techDate", "<=", endTime)
            );
        }
        if (paymentsDate.value === "Цей рік") {
            const startTime = Date.parse(`01.01.${year}`);
            const endTime = Date.parse(`12.31.${year}`);
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
        const orders = snapshot.docs.map((order) => order.data());
        const paymentsArrOfObj = [];
        const payments = snapshot.docs.map((order) => order.data().payments.forEach((payment) => paymentsArrOfObj.push(payment)));

        if (paymentType.value === "all") {
            setOrders(orders);
            setPayments(paymentsArrOfObj);
            return;
        }

        const filteredOrders = orders?.filter((order) => order.payments?.every((payment) => payment.paymentType === paymentType.value));
        const filteredPayments = paymentsArrOfObj?.filter((payment) => payment.paymentType === paymentType.value);

        setOrders(filteredOrders);
        setPayments(filteredPayments);
    };

    const calcPayments = (payments, type) => {
        if (type === "costs") return payments.reduce((acc, value) => acc + value.repairCost, 0);
        if (type === "price") return payments.reduce((acc, value) => acc + value.repairPrice, 0);
        if (type === "income") return payments.reduce((acc, value) => acc + (value.repairPrice - value.repairCost), 0);
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
                                {orders.length
                                    ? orders.map((order) => {
                                          return (
                                              <tr className={classes.table__row} key={v4()}>
                                                  <td className={classes.table__item}>#{order.id}</td>
                                                  <td className={classes.table__item}>{calcPayments(order.payments, "costs")}</td>
                                                  <td className={classes.table__item}>{calcPayments(order.payments, "price")}</td>
                                                  <td className={classes.table__item}>{calcPayments(order.payments, "income")}</td>
                                              </tr>
                                          );
                                      })
                                    : null}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Finances;
