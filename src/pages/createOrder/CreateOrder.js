import React, { useRef, useState } from "react";
import classes from "./CreateOrder.module.scss";
import Input from "../../components/UI/input/Input";
import useInput from "../../hooks/useInput";
import Button from "../../components/UI/button/Button";
import { db } from "../../firebase";
import { getDocs, addDoc, collection, query, where, startAt, orderBy, endAt } from "firebase/firestore";
import { format } from "date-fns";
import { Link, useNavigate } from "react-router-dom";
import Select from "../../components/UI/select/Select";
import useSelect from "../../hooks/useSelect";
import { getAuth } from "firebase/auth";
import { v4 } from "uuid";
import { deviceTypesAndProducers, deviceСondition } from "../../constants";
import DatePicker from "react-date-picker";

const CreateOrder = () => {
    const [clientOptions, setClientOptions] = useState([]);
    const [deviceTypeOptions, setDeviceTypeOptions] = useState([]);
    const [deviceProducerOptions, setDeviceProducerOptions] = useState([]);
    const [deviceStateOptions, setDeviceStateOptions] = useState([]);

    // Client info
    const clientName = useInput("", { isEmpty: true, minLength: 2 });
    const clientPhone = useInput("", { isEmpty: true });
    const clientEmail = useInput("");
    const clientAddress = useInput("");

    // Device info
    const deviceType = useInput("");
    const deviceProducer = useInput("");
    const deviceModel = useInput("");
    const deviceState = useInput("");
    const deviceBreakage = useInput("");
    const deviceImeiSn = useInput("");
    const deviceAccessories = useInput("", { isEmpty: true });
    const devicePassword = useInput("", { isEmpty: true });

    // Order info
    const orderType = useSelect({ defaultValue: "Ремонт", options: ["Ремонт", "Відновлення данних"] });
    const orderExecutor = useInput("");
    const [orderDeadline, setOrderDeadline] = useState("");

    const auth = getAuth();
    const navigate = useNavigate();

    const handleSumbit = async (e) => {
        e.preventDefault();
        const orderData = {
            id: "",
            firebaseId: "",
            payment: [],
            history: [
                {
                    techDate: Date.now(),
                    date: format(new Date(), " H:mm dd.MM.yy"),
                    message: "Замовлення створене",
                    author: auth.currentUser.displayName,
                },
            ],
            clientInfo: {
                clientName: clientName.value,
                clientPhone: clientPhone.value,
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
                deviceAccessories: deviceAccessories.value,
                devicePassword: devicePassword.value,
            },

            orderInfo: {
                orderDate: format(new Date(), "H:mm dd.MM.yyy"),
                orderUpdatedDate: "-",
                orderStatus: "До діагностики",
                orderType: orderType.value || "-",
                orderAccepted: auth.currentUser.displayName,
                orderExecutor: orderExecutor.value || "-",
                orderDeadline: orderDeadline === "" || orderDeadline === null ? "-" : orderDeadline?.toLocaleDateString(),
            },
        };

        await getDocs(collection(db, "orders"))
            .then((res) => {
                orderData.id = res.size + 1;
            })
            .catch((err) => console.log(err));

        const order = await addDoc(collection(db, "orders"), orderData);

        const clientData = {
            firebaseId: "",
            clientName: clientName.value.toLowerCase(),
            clientPhone: clientPhone.value,
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

        navigate(`/orders/${order.id}`);
    };

    const searchClient = async (value) => {
        const ref = collection(db, "clients");
        const q = query(ref, orderBy("clientPhone"), startAt(value.toLowerCase()), endAt(value.toLowerCase() + "\uf8ff"));
        if (value.length) {
            const snap = await getDocs(q);
            const data = snap.docs.map((item) => item.data());
            setClientOptions(data);
        } else {
            setClientOptions([]);
        }
    };

    const searchDeviceType = (value) => {
        const options = [];

        for (const key in deviceTypesAndProducers) {
            if (value.type === "click") {
                options.push(key);
                continue;
            }
            if (key.toLowerCase().includes(value.toLowerCase())) {
                options.push(key);
            }
        }
        return setDeviceTypeOptions(options);
    };

    const searchDeviceProducer = (value) => {
        const type = deviceType.value;
        const options = [];

        if (type === "PC" || type === "") return;

        if (value.type === "click") {
            deviceTypesAndProducers[type].forEach((producer) => {
                options.push(producer);
            });
            return setDeviceProducerOptions(options);
        }

        if (type === "Laptop" || type === "smartphone" || type === "Tablet") {
            deviceTypesAndProducers[type].forEach((producer) => {
                if (producer.toLowerCase().includes(value.toLowerCase())) {
                    options.push(producer);
                }
            });
            return setDeviceProducerOptions(options);
        }
    };
    const searchDeviceState = (value) => {
        const options = [];

        if (value.type === "click") {
            return setDeviceStateOptions(deviceСondition);
        }

        deviceСondition.forEach((condition) => {
            if (condition.toLowerCase().includes(value.toLowerCase())) {
                options.push(condition);
            }
        });
        return setDeviceStateOptions(options);
    };

    const fillInputs = (inputType, data) => {
        if (inputType === "client") {
            clientName.setValue(data.clientName);
            clientPhone.setValue(data.clientPhone);
            clientEmail.setValue(data.clientEmail);
            clientAddress.setValue(data.clientAddress);
            setClientOptions([]);
            return;
        }
        if (inputType === "deviceType") {
            deviceType.setValue(data);
            setDeviceTypeOptions([]);
            return;
        }
        if (inputType === "deviceProducer") {
            deviceProducer.setValue(data);
            setDeviceProducerOptions([]);
            return;
        }
        if (inputType === "deviceState") {
            deviceState.setValue(data);
            setDeviceStateOptions([]);
            return;
        }
    };

    return (
        <div className={classes.createOrder.value}>
            <div className="container">
                <div className={classes.createOrder__content}>
                    <div className={classes.createOrder__header}>
                        <div className={classes.header__info}>
                            <h1 className={classes.title}>Створити замовлення</h1>
                        </div>
                        <div className={classes.header__actions}>
                            <Link to="/orders">
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
                                    <h2 className={classes.content__title}>Клієнт</h2>
                                    <div className={classes.clientInfo}>
                                        <div className={classes.input__section}>
                                            <h3 className={classes.title}>Ім'я*</h3>
                                            <div className={classes.input}>
                                                <Input
                                                    value={clientName.value}
                                                    onChange={(e) => {
                                                        clientName.onChange(e);
                                                    }}
                                                    onBlur={() => {
                                                        clientName.onBlur();
                                                    }}
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
                                            <h3 className={classes.title}>Телефон*</h3>
                                            <div className={classes.input}>
                                                <Input
                                                    value={clientPhone.value}
                                                    onClick={(e) => searchClient(e.target.value)}
                                                    onChange={(e) => {
                                                        clientPhone.onChange(e);
                                                        searchClient(e.target.value);
                                                    }}
                                                    onBlur={() => {
                                                        clientPhone.onBlur();
                                                        setTimeout(() => {
                                                            setClientOptions([]);
                                                        }, 100);
                                                    }}
                                                />
                                            </div>

                                            {clientOptions.length ? (
                                                <ul className={classes.search}>
                                                    {clientOptions.map((client) => {
                                                        return (
                                                            <li
                                                                key={client.clientPhone}
                                                                onClick={() => fillInputs("client", client)}
                                                                className={classes.search__item}>
                                                                {client.clientName + " " + client.clientPhone}
                                                            </li>
                                                        );
                                                    })}
                                                </ul>
                                            ) : null}

                                            <p className={classes.error}>
                                                {clientPhone.isDirty && clientPhone.isEmpty ? "Поле не може бути пустим" : ""}
                                            </p>
                                        </div>
                                        <div className={classes.input__section}>
                                            <h3 className={classes.title}>Пошта</h3>
                                            <div className={classes.input}>
                                                <Input value={clientEmail.value} onChange={(e) => clientEmail.onChange(e)} />
                                            </div>
                                        </div>
                                        <div className={classes.input__section}>
                                            <h3 className={classes.title}>Адреса</h3>
                                            <div className={classes.input}>
                                                <Input value={clientAddress.value} onChange={(e) => clientAddress.onChange(e)} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className={classes.form__content}>
                                    <h2 className={classes.content__title}>Додаткова інформація</h2>
                                    <div className={classes.additionalInfo}>
                                        <div className={classes.input__section}>
                                            <h3 className={classes.title}>Тип замовлення</h3>
                                            <Select {...orderType} />
                                        </div>

                                        <div className={classes.input__section}>
                                            <h3 className={classes.title}>Виконавець замовлення</h3>
                                            <div className={classes.input}>
                                                <Input value={orderExecutor.value} onChange={(e) => orderExecutor.onChange(e)} />
                                            </div>
                                        </div>
                                        <div className={classes.input__section}>
                                            <h3 className={classes.title}>Термін виконання</h3>
                                            <DatePicker
                                                format="dd.MM.y"
                                                className={classes.input}
                                                onChange={setOrderDeadline}
                                                value={orderDeadline}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className={classes.form__content}>
                                <h2 className={classes.content__title}>Технічна інформація</h2>
                                <div className={classes.techInfo}>
                                    <div className={classes.techInfo__column}>
                                        <div className={classes.input__section}>
                                            <h3 className={classes.title}>Тип девайса</h3>
                                            <div className={classes.input}>
                                                <Input
                                                    value={deviceType.value}
                                                    onChange={(e) => {
                                                        deviceType.onChange(e);
                                                        searchDeviceType(e.target.value);
                                                    }}
                                                    onClick={searchDeviceType}
                                                    onBlur={() => {
                                                        setTimeout(() => {
                                                            setDeviceTypeOptions([]);
                                                        }, 100);
                                                    }}
                                                />
                                            </div>
                                            {deviceTypeOptions.length ? (
                                                <ul className={classes.search}>
                                                    {deviceTypeOptions.map((type) => {
                                                        return (
                                                            <li
                                                                key={v4()}
                                                                onClick={() => fillInputs("deviceType", type)}
                                                                className={classes.search__item}>
                                                                {type}
                                                            </li>
                                                        );
                                                    })}
                                                </ul>
                                            ) : null}
                                        </div>
                                        <div className={classes.input__section}>
                                            <h3 className={classes.title}>Виробник</h3>
                                            <div className={classes.input}>
                                                <Input
                                                    value={deviceProducer.value}
                                                    onChange={(e) => {
                                                        deviceProducer.onChange(e);
                                                        searchDeviceProducer(e.target.value);
                                                    }}
                                                    onClick={searchDeviceProducer}
                                                    onBlur={() => {
                                                        setTimeout(() => {
                                                            setDeviceProducerOptions([]);
                                                        }, 100);
                                                    }}
                                                />
                                            </div>
                                            {deviceProducerOptions.length ? (
                                                <ul className={classes.search}>
                                                    {deviceProducerOptions.map((producer) => {
                                                        return (
                                                            <li
                                                                key={v4()}
                                                                onClick={() => fillInputs("deviceProducer", producer)}
                                                                className={classes.search__item}>
                                                                {producer}
                                                            </li>
                                                        );
                                                    })}
                                                </ul>
                                            ) : null}
                                        </div>
                                        <div className={classes.input__section}>
                                            <h3 className={classes.title}>Модель</h3>
                                            <div className={classes.input}>
                                                <Input value={deviceModel.value} onChange={(e) => deviceModel.onChange(e)} />
                                            </div>
                                        </div>
                                        <div className={classes.input__section}>
                                            <h3 className={classes.title}>Стан пристрою</h3>
                                            <div className={classes.input}>
                                                <Input
                                                    value={deviceState.value}
                                                    onChange={(e) => {
                                                        deviceState.onChange(e);
                                                        searchDeviceState(e.target.value);
                                                    }}
                                                    onClick={searchDeviceState}
                                                    onBlur={() => {
                                                        setTimeout(() => {
                                                            setDeviceStateOptions([]);
                                                        }, 100);
                                                    }}
                                                />
                                            </div>
                                            {deviceStateOptions.length ? (
                                                <ul className={classes.search_above}>
                                                    {deviceStateOptions.map((state) => {
                                                        return (
                                                            <li
                                                                key={v4()}
                                                                onClick={() => fillInputs("deviceState", state)}
                                                                className={classes.search__item}>
                                                                {state}
                                                            </li>
                                                        );
                                                    })}
                                                </ul>
                                            ) : null}
                                        </div>
                                    </div>
                                    <div className={classes.techInfo__column}>
                                        <div className={classes.input__section}>
                                            <h3 className={classes.title}>Несправність</h3>
                                            <div className={classes.input}>
                                                <Input value={deviceBreakage.value} onChange={(e) => deviceBreakage.onChange(e)} />
                                            </div>
                                        </div>
                                        <div className={classes.input__section}>
                                            <h3 className={classes.title}>IMEI / SN</h3>
                                            <div className={classes.input}>
                                                <Input value={deviceImeiSn.value} onChange={(e) => deviceImeiSn.onChange(e)} />
                                            </div>
                                        </div>
                                        <div className={classes.input__section}>
                                            <h3 className={classes.title}>Аксесуари*</h3>
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
                                            <h3 className={classes.title}>Пароль*</h3>
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
                            </div>
                            <div className={classes.button}>
                                <Button
                                    disabled={
                                        !clientName.inputValid ||
                                        !clientPhone.inputValid ||
                                        !deviceAccessories.inputValid ||
                                        !devicePassword.inputValid
                                    }
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
