import { doc, updateDoc } from "firebase/firestore";
import React, { useState } from "react";
import { db } from "../../../firebase";
import Button from "../../UI/button/Button";
import classes from "./PaymentTypeModal.module.scss";

const PaymentTypeModal = ({ onClose, firebaseId, order }) => {
    const [paymentType, setPaymentType] = useState(null);

    const handleSubmit = async () => {
        const orderRef = doc(db, "orders", firebaseId);
        await updateDoc(orderRef, {
            techData: {
                techDate: order.techData.techDate,
                isAnyPayments: order.techData.isAnyPayments,
                paymentType: paymentType,
            },
        });
        onClose();
    };

    const repairCost = order.payments.reduce((acc, value) => acc + value.repairCost, 0);
    const repairPrice = order.payments.reduce((acc, value) => acc + value.repairPrice, 0);
    const repairIncome = order.payments.reduce((acc, value) => acc + (value.repairPrice - value.repairCost), 0);

    const { clientInfo, deviceInfo } = order;
    return (
        <div className={classes.modal}>
            <h1 className={classes.modal__title}>Виберіть метод оплати</h1>
            <div className={classes.modal__body}>
                <div className={classes.modal__row}>
                    <p>Замовелння #{order.id}</p>
                    <p>
                        Клієнт: {clientInfo.clientName} {clientInfo.clientPhone}
                    </p>
                </div>
                <div className={classes.modal__row}>
                    <p>Пристрій: {deviceInfo.deviceType}</p>
                    <p>Виробник: {deviceInfo.deviceProducer}</p>
                    <p>Модель: {deviceInfo.deviceModel}</p>
                </div>
                <div className={classes.modal__row}>
                    <p>Собівартість: {repairCost}</p>
                    <p>Ціна: {repairPrice}</p>
                    <p>Заробіток: {repairIncome}</p>
                </div>
                <div className={classes.modal__row}>
                    <div className={classes.modal__inputSection}>
                        <h3>Метод оплати</h3>
                        <div className={classes.modal__row}>
                            <label className={classes.modal__label_radio}>
                                <input className={classes.modal__radio} onChange={() => setPaymentType("cash")} type="radio" name="radio" />
                                Готівка
                            </label>
                            <label className={classes.modal__label_radio}>
                                <input className={classes.modal__radio} onChange={() => setPaymentType("card")} type="radio" name="radio" />
                                Карта
                            </label>
                        </div>
                    </div>
                </div>
                <div className={classes.modal__submit}>
                    <Button color="blue" disabled={paymentType === null} onClick={handleSubmit}>
                        Завершити
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default PaymentTypeModal;
