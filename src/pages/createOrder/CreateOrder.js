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
    const deviceAccessories = useInput("", { isEmpty: true });
    const devicePassword = useInput("", { isEmpty: true, minLength: 4 });
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
                                            <div className={classes.input}>
                                                <Input
                                                    value={clientName.value}
                                                    onChange={(e) => clientName.onChange(e)}
                                                    onBlur={(e) => clientName.onBlur(e)}
                                                />
                                            </div>

                                            <p className={classes.error}>
                                                {clientName.isDirty && clientName.isEmpty
                                                    ? "Поле не може бути пустим"
                                                    : clientName.isDirty && clientName.minLengthError
                                                    ? "Мінімальна кількість символів 2"
                                                    : ""}
                                            </p>
                                        </div>
                                        <div className={classes.input__section}>
                                            <p>Телефон</p>
                                            <div className={classes.input}>
                                                <Input
                                                    value={clientPhone.value}
                                                    onChange={(e) => clientPhone.onChange(e)}
                                                    onBlur={(e) => clientPhone.onBlur(e)}
                                                />
                                            </div>

                                            <p className={classes.error}>
                                                {clientPhone.isDirty && clientPhone.isEmpty
                                                    ? "Поле не може бути пустим"
                                                    : clientPhone.isDirty && clientPhone.lengthError
                                                    ? "Кількість символів 10"
                                                    : ""}
                                            </p>
                                        </div>
                                        <div className={classes.input__section}>
                                            <p>Пошта</p>
                                            <div className={classes.input}>
                                                <Input value={clientEmail.value} onChange={(e) => clientEmail.onChange(e)} />
                                            </div>
                                        </div>
                                        <div className={classes.input__section}>
                                            <p>Адреса</p>
                                            <div className={classes.input}>
                                                <Input value={clientAddress.value} onChange={(e) => clientAddress.onChange(e)} />
                                            </div>
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
                                            <p>Виконавець замовлення</p>
                                            <div className={classes.input}>
                                                <Input value={orderExecutor.value} onChange={(e) => orderExecutor.onChange(e)} />
                                            </div>
                                        </div>
                                        <div className={classes.input__section}>
                                            <p>Термін виконання</p>
                                            <div className={classes.input}>
                                                <Input value={orderDeadline.value} onChange={(e) => orderDeadline.onChange(e)} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className={classes.form__content}>
                                <p className={classes.content__title}>Технічна інформація</p>
                                <div className={classes.techInfo}>
                                    <div className={classes.input__section}>
                                        <p>Тип девайса</p>
                                        <div className={classes.input}>
                                            <Input value={deviceType.value} onChange={(e) => deviceType.onChange(e)} />
                                        </div>
                                    </div>
                                    <div className={classes.input__section}>
                                        <p>Виробник</p>
                                        <div className={classes.input}>
                                            <Input value={deviceProducer.value} onChange={(e) => deviceProducer.onChange(e)} />
                                        </div>
                                    </div>
                                    <div className={classes.input__section}>
                                        <p>Модель</p>
                                        <div className={classes.input}>
                                            <Input value={deviceModel.value} onChange={(e) => deviceModel.onChange(e)} />
                                        </div>
                                    </div>
                                    <div className={classes.input__section}>
                                        <p>Стан пристрою</p>
                                        <div className={classes.input}>
                                            <Input value={deviceState.value} onChange={(e) => deviceState.onChange(e)} />
                                        </div>
                                    </div>
                                    <div className={classes.input__section}>
                                        <p>Несправність</p>
                                        <div className={classes.input}>
                                            <Input value={deviceBreakage.value} onChange={(e) => deviceBreakage.onChange(e)} />
                                        </div>
                                    </div>
                                    <div className={classes.input__section}>
                                        <p>IMEI / SN</p>
                                        <div className={classes.input}>
                                            <Input value={deviceImeiSn.value} onChange={(e) => deviceImeiSn.onChange(e)} />
                                        </div>
                                    </div>
                                    <div className={classes.input__section}>
                                        <p>Аксесуари</p>
                                        <div className={classes.input}>
                                            <Input
                                                value={deviceAccessories.value}
                                                onChange={(e) => deviceAccessories.onChange(e)}
                                                onBlur={() => deviceAccessories.onBlur()}
                                            />
                                        </div>
                                        <p className={classes.error}>
                                            {deviceAccessories.isDirty && deviceAccessories.isEmpty ? "Поле не може бути пустим" : ""}
                                        </p>
                                    </div>
                                    <div className={classes.input__section}>
                                        <p>Пароль</p>
                                        <div className={classes.input}>
                                            <Input
                                                value={devicePassword.value}
                                                onChange={(e) => devicePassword.onChange(e)}
                                                onBlur={() => devicePassword.onBlur()}
                                            />
                                        </div>
                                        <p className={classes.error}>
                                            {devicePassword.isDirty && devicePassword.isEmpty
                                                ? "Поле не може бути пустим"
                                                : devicePassword.isDirty && devicePassword.minLengthError
                                                ? "Мінімальна кількість символів 4"
                                                : ""}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className={classes.button}>
                                {console.log(clientName.inputValid)}
                                <Button
                                    disabled={!clientName.inputValid || !clientPhone.inputValid || !deviceAccessories || !devicePassword}
                                    onClick={handleSumbit}
                                    color="blue">
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
