import React, { useEffect, useState } from "react";
import classes from "./CreateOrder.module.scss";
import Input from "../../components/UI/input/Input";
import useInput from "../../hooks/useInput";
import Button from "../../components/UI/button/Button";
import { db } from "../../firebase";
import { getDocs, addDoc, collection, query, where } from "firebase/firestore";
import { useDispatch } from "react-redux";
import { format } from "date-fns";
import Modal from "../../components/modals/Modal";
import CreateOrderModal from "../../components/modals/create-order-modal/CreateOrderModal";
import { Link } from "react-router-dom";
import Select from "../../components/UI/select/Select";
import useSelect from "../../hooks/useSelect";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const CreateOrder = () => {
    const [isModalActive, setModalActive] = useState(false);
    const [userName, setUserName] = useState("");

    // client info
    const clientName = useInput("", { isEmpty: true, minLength: 2 });
    const clientPhone = useInput("", { isEmpty: true, length: 10 });
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

    const orderType = useSelect({ defaultValue: "Ремонт", options: ["Ремонт", "Відновлення данних"] });
    const orderExecutor = useInput("");
    const orderDeadline = useInput("");

    const dispatch = useDispatch();
    const auth = getAuth();

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

        orderExecutor.clear();
        orderDeadline.clear();
    };

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserName(user.displayName);
            }
        });
    }, [auth.currentUser]);

    const handleSumbit = async (e) => {
        e.preventDefault();
        const orderData = {
            id: "",
            fireBaseId: "",
            history: [
                {
                    techDate: Date.now(),
                    date: format(new Date(), " H:mm dd.MM.yy"),
                    message: "Замовлення створене",
                    author: userName,
                },
            ],
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
                orderDate: format(new Date(), "H:mm dd.MM.yyy"),
                orderUpdatedDate: "-",
                orderStatus: "До діагностики",
                orderType: orderType.value || "-",
                orderAccepted: userName,
                orderExecutor: orderExecutor.value || "-",
                orderDeadline: orderDeadline.value || "-",
            },
        };

        await getDocs(collection(db, "orders"))
            .then((res) => {
                orderData.id = res.size + 1;
            })
            .catch((err) => console.log(err));

        await addDoc(collection(db, "orders"), orderData);

        const clientData = {
            fireBaseId: "",
            clientName: clientName.value || "-",
            clientPhone: clientPhone.value || "-",
            clientEmail: clientEmail.value || "-",
            clientAddress: clientAddress.value || "-",
        };
        const docRef = collection(db, "clients");
        const q = query(docRef, where("clientPhone", "==", clientData.clientPhone));
        const querySnapshot = await getDocs(q);
        const clients = querySnapshot.docs.map((doc) => doc.data());

        if (!clients.length) {
            await addDoc(docRef, clientData);
        }
        clearInputs();
        setModalActive(true);
    };

    return (
        <div className={classes.createOrder}>
            <Modal isModalActive={isModalActive} onClose={() => setModalActive(false)}>
                <CreateOrderModal onClose={() => setModalActive(false)} />
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
                                            <Input
                                                value={clientName.value}
                                                onChange={(e) => clientName.onChange(e)}
                                                onBlur={(e) => clientName.onBlur(e)}
                                            />
                                            {clientName.isDirty && clientName.isEmpty ? <p className={classes.error}>Поле не може бути пусте</p> : ""}
                                        </div>
                                        <div className={classes.input__section}>
                                            <p>Телефон</p>
                                            <Input
                                                value={clientPhone.value}
                                                onChange={(e) => clientPhone.onChange(e)}
                                                onBlur={(e) => clientPhone.onBlur(e)}
                                            />
                                        </div>
                                        <div className={classes.input__section}>
                                            <p>Пошта</p>
                                            <Input value={clientEmail.value} onChange={(e) => clientEmail.onChange(e)} />
                                        </div>
                                        <div className={classes.input__section}>
                                            <p>Адреса</p>
                                            <Input value={clientAddress.value} onChange={(e) => clientAddress.onChange(e)} />
                                        </div>
                                    </div>
                                </div>
                                <div className={classes.form__content}>
                                    <p className={classes.content__title}>Додаткова інформація</p>
                                    <div className={classes.additionalInfo}>
                                        <div className={classes.input__section}>
                                            <p>Тип замовлення</p>
                                            <Select {...orderType} />
                                        </div>

                                        <div className={classes.input__section}>
                                            <p>Виконавець замовлення</p>{" "}
                                            <Input value={orderExecutor.value} onChange={(e) => orderExecutor.onChange(e)} />
                                        </div>
                                        <div className={classes.input__section}>
                                            <p>Термін виконання</p> <Input value={orderDeadline.value} onChange={(e) => orderDeadline.onChange(e)} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className={classes.form__content}>
                                <p className={classes.content__title}>Технічна інформація</p>
                                <div className={classes.techInfo}>
                                    <div className={classes.input__section}>
                                        <p>Тип девайса</p> <Input value={deviceType.value} onChange={(e) => deviceType.onChange(e)} />
                                    </div>
                                    <div className={classes.input__section}>
                                        <p>Виробник</p> <Input value={deviceProducer.value} onChange={(e) => deviceProducer.onChange(e)} />
                                    </div>
                                    <div className={classes.input__section}>
                                        <p>Модель</p> <Input value={deviceModel.value} onChange={(e) => deviceModel.onChange(e)} />
                                    </div>
                                    <div className={classes.input__section}>
                                        <p>Стан пристрою</p> <Input value={deviceState.value} onChange={(e) => deviceState.onChange(e)} />
                                    </div>
                                    <div className={classes.input__section}>
                                        <p>Несправність</p> <Input value={deviceBreakage.value} onChange={(e) => deviceBreakage.onChange(e)} />
                                    </div>
                                    <div className={classes.input__section}>
                                        <p>IMEI / SN</p> <Input value={deviceImeiSn.value} onChange={(e) => deviceImeiSn.onChange(e)} />
                                    </div>
                                    <div className={classes.input__section}>
                                        <p>Аксесуари</p> <Input value={deviceAccessories.value} onChange={(e) => deviceAccessories.onChange(e)} />
                                    </div>
                                    <div className={classes.input__section}>
                                        <p>Пароль</p> <Input value={devicePassword.value} onChange={(e) => devicePassword.onChange(e)} />
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
