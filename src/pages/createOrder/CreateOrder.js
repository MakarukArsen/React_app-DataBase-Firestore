import React, { useState } from "react";
import classes from "./CreateOrder.module.scss";
import Input from "../../components/UI/input/Input";
import useInput from "../../hooks/useInput";
import Button from "../../components/UI/button/Button";
import { db } from "../../firebase";
import { getDocs, addDoc, collection } from "firebase/firestore";
import { useDispatch } from "react-redux";
import { addOrder } from "../../store/sllices/ordersSlice";
import { format } from "date-fns";
import Modal from "../../components/modals/Modal";
import CreateOrderModal from "../../components/modals/create-order-modal/CreateOrderModal";
import { Link } from "react-router-dom";

const CreateOrder = () => {
    // client info
    const clientName = useInput("");
    const clientPhone = useInput("");
    const clientEmail = useInput("");
    const clientAddress = useInput("");
    // tech info
    const deviceType = useInput("");
    const deviceProducer = useInput("");
    const deviceModel = useInput("");
    const deviceState = useInput("");
    const deviceBreakage = useInput("");
    const deviceImeiSn = useInput("");
    const deviceAccessories = useInput("");
    const devicePassword = useInput("");
    // additional info

    const orderType = useInput("");
    const orderAccepted = useInput("");
    const orderExecutor = useInput("");
    const orderDeadline = useInput("");

    const dispatch = useDispatch();

    const clearInputs = () => {
        clientName.clear();
        clientPhone.clear();
        clientEmail.clear();
        clientAddress.clear();
        deviceType.clear();
        deviceProducer.clear();
        deviceModel.clear();
        deviceState.clear();
        deviceBreakage.clear();
        deviceImeiSn.clear();
        deviceAccessories.clear();
        devicePassword.clear();
        orderType.clear();
        orderAccepted.clear();
        orderExecutor.clear();
        orderDeadline.clear();
    };
    const handleSumbit = async (e) => {
        e.preventDefault();
        const orderData = {
            id: "",
            fireBaseId: "",
            clientInfo: {
                clientName: clientName.value || "-",
                clientPhone: clientPhone.value || "-",
                clientEmail: clientEmail.value || "-",
                clientAddress: clientAddress.value || "-",
            },

            deviceInfo: {
                deviceType: deviceType.value || "-",
                deviceProducer: deviceProducer.value || "-",
                deviceModel: deviceModel.value || "-",
                deviceState: deviceState.value || "-",
                deviceBreakage: deviceBreakage.value || "-",
                deviceImeiSn: deviceImeiSn.value || "-",
                deviceAccessories: deviceAccessories.value || "-",
                devicePassword: devicePassword.value || "-",
            },

            orderInfo: {
                orderDate: format(new Date(), "dd.MM.yyy"),
                orderStatus: "До діагностики",
                orderType: orderType.value || "-",
                orderAccepted: orderAccepted.value || "-",
                orderExecutor: orderExecutor.value || "-",
                orderDeadline: orderDeadline.value || "-",
            },
        };

        await getDocs(collection(db, "orders"))
            .then((res) => {
                orderData.id = res.size + 1;
            })
            .catch((err) => console.log(err));

        await addDoc(collection(db, "orders"), orderData)
            .then((res) => {
                dispatch(addOrder(orderData));
            })
            .catch((err) => console.log(err));

        clearInputs();
    };

    return (
        <div className={classes.createOrder}>
            <Modal>
                <CreateOrderModal />
            </Modal>
            <div className="container">
                <div className={classes.createOrder__content}>
                    <div className={classes.createOrder__header}>
                        <div className={classes.header__info}>
                            <p>Створити замовлення</p>
                        </div>
                        <div className={classes.header__actions}>
                            <Link to="/">
                                <div className={classes.actions__close}>
                                    <span></span>
                                </div>
                            </Link>
                        </div>
                    </div>
                    <div className={classes.createOrder__body}>
                        <form className={classes.form}>
                            <div className={classes.row}>
                                <div className={classes.form__content}>
                                    <p className={classes.content__title}>Клієнт</p>
                                    <div className={classes.clientInfo}>
                                        <div className={classes.input__section}>
                                            <p>Ім'я</p>
                                            <Input {...clientName} />
                                        </div>
                                        <div className={classes.input__section}>
                                            <p>Телефон</p>
                                            <Input {...clientPhone} />
                                        </div>
                                        <div className={classes.input__section}>
                                            <p>Пошта</p>
                                            <Input {...clientEmail} />
                                        </div>
                                        <div className={classes.input__section}>
                                            <p>Адреса</p>
                                            <Input {...clientAddress} />
                                        </div>
                                    </div>
                                </div>
                                <div className={classes.form__content}>
                                    <p className={classes.content__title}>Додаткова інформація</p>
                                    <div className={classes.additionalInfo}>
                                        <div className={classes.input__section}>
                                            <p>Тип замовлення</p> <Input {...orderType} />
                                        </div>
                                        <div className={classes.input__section}>
                                            <p>Прийняв замовлення</p> <Input {...orderAccepted} />
                                        </div>
                                        <div className={classes.input__section}>
                                            <p>Виконавець замовлення</p> <Input {...orderExecutor} />
                                        </div>
                                        <div className={classes.input__section}>
                                            <p>Термін виконання</p> <Input {...orderDeadline} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className={classes.form__content}>
                                <p className={classes.content__title}>Технічна інформація</p>
                                <div className={classes.techInfo}>
                                    <div className={classes.input__section}>
                                        <p>Тип девайса</p> <Input {...deviceType} />
                                    </div>
                                    <div className={classes.input__section}>
                                        <p>Виробник</p> <Input {...deviceProducer} />
                                    </div>
                                    <div className={classes.input__section}>
                                        <p>Модель</p> <Input {...deviceModel} />
                                    </div>
                                    <div className={classes.input__section}>
                                        <p>Стан пристрою</p> <Input {...deviceState} />
                                    </div>
                                    <div className={classes.input__section}>
                                        <p>Несправність</p> <Input {...deviceBreakage} />
                                    </div>
                                    <div className={classes.input__section}>
                                        <p>IMEI / SN</p> <Input {...deviceImeiSn} />
                                    </div>
                                    <div className={classes.input__section}>
                                        <p>Аксесуари</p> <Input {...deviceAccessories} />
                                    </div>
                                    <div className={classes.input__section}>
                                        <p>Пароль</p> <Input {...devicePassword} />
                                    </div>
                                </div>
                            </div>
                            <div className={classes.button}>
                                <Button onClick={handleSumbit} color="blue">
                                    Завершити
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateOrder;
