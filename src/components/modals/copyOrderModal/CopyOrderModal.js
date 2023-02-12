import { format } from "date-fns";
import { getAuth } from "firebase/auth";
import { addDoc, collection, getCountFromServer } from "firebase/firestore";
import React, { useState } from "react";
import DatePicker from "react-date-picker";
import { useNavigate } from "react-router-dom";
import { db } from "../../../firebase";
import useInput from "../../../hooks/useInput";
import Button from "../../UI/button/Button";
import Input from "../../UI/input/Input";
import classes from "./CopyOrderModal.module.scss";

const CopyOrderModal = ({ onClose, order }) => {
    const [orderDeadline, setOrderDeadline] = useState("");
    const orderExecutor = useInput("");
    const deviceBreakage = useInput("");

    const auth = getAuth();
    const navigate = useNavigate();

    const { clientInfo, deviceInfo, orderInfo } = order;

    const handleCopy = async (e) => {
        e.preventDefault();

        const createSearchArray = (arr) => {
            const resultArray = [];
            arr.forEach((item) => {
                for (let i = 1; i < item.length + 1; i++) {
                    resultArray.push(item.toLowerCase().substring(0, i));
                }
            });
            return resultArray;
        };

        const orderData = {
            id: "",
            techData: {
                techDate: Date.now(),
                isAnyPayments: false,
                paymentType: null,
                searchArray: createSearchArray([
                    clientInfo.clientName,
                    clientInfo.clientPhone,
                    deviceInfo.deviceType,
                    deviceInfo.deviceProducer,
                    deviceInfo.deviceModel,
                ]),
            },
            payments: [],
            history: [
                {
                    techDate: Date.now(),
                    date: format(new Date(), " H:mm dd.MM.yy"),
                    message: "Замовлення створене",
                    author: auth.currentUser.displayName,
                },
            ],
            clientInfo: {
                clientName: clientInfo.clientName,
                clientPhone: clientInfo.clientPhone,
                clientEmail: clientInfo.clientEmail || "-",
                clientAddress: clientInfo.clientAddress || "-",
            },

            deviceInfo: {
                deviceType: deviceInfo.deviceType || "-",
                deviceProducer: deviceInfo.deviceProducer || "-",
                deviceModel: deviceInfo.deviceModel || "-",
                deviceState: deviceInfo.deviceState || "-",
                deviceBreakage: deviceBreakage.value || "-",
                deviceImeiSn: deviceInfo.deviceImeiSn || "-",
                deviceAccessories: deviceInfo.deviceAccessories,
                devicePassword: deviceInfo.devicePassword,
            },

            orderInfo: {
                orderDate: format(new Date(), "H:mm dd.MM.yy"),
                orderStatus: "До діагностики",
                orderType: orderInfo.orderType || "-",
                orderAccepted: auth.currentUser.displayName,
                orderExecutor: orderExecutor.value || "-",
                orderDeadline: orderDeadline === "" || orderDeadline === null ? "-" : orderDeadline?.toLocaleDateString(),
            },
        };

        await getCountFromServer(collection(db, "orders"))
            .then((res) => {
                orderData.id = res.data().count + 1;
            })
            .catch((err) => console.log(err));

        const order = await addDoc(collection(db, "orders"), orderData);

        navigate(`/orders/${order.id}`);
        window.location.reload();
    };

    return (
        <div className={classes.modal}>
            <h1 className={classes.modal__title}>Копіювати замовлення</h1>
            <form className={classes.modal__form}>
                <div className={classes.input__section}>
                    <h2 className={classes.input__title}>Несправність</h2>
                    <div className={classes.input}>
                        <Input value={deviceBreakage.value} onChange={(e) => deviceBreakage.onChange(e)} />
                    </div>
                </div>
                <div className={classes.input__section}>
                    <h2 className={classes.input__title}>Виконавець</h2>
                    <div className={classes.input}>
                        <Input value={orderExecutor.value} onChange={(e) => orderExecutor.onChange(e)} />
                    </div>
                </div>
                <div className={classes.input__section}>
                    <h2 className={classes.input__title}>Термін виконання</h2>
                    <DatePicker format="dd.MM.y" className={classes.input} onChange={setOrderDeadline} value={orderDeadline} />
                </div>
                <div className={classes.button}>
                    <Button onClick={handleCopy} color={"blue"}>
                        Копіювати
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default CopyOrderModal;
