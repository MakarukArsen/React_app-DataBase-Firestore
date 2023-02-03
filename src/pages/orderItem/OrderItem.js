import { arrayUnion, collection, doc, endAt, getDocs, onSnapshot, orderBy, query, setDoc, startAt, updateDoc, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { db } from "../../firebase";
import classes from "./OrderItem.module.scss";
import EditIcon from "../../components/icons/EditIcon";
import PaymentsIcon from "../../components/icons/PaymentsIcon";
import PdfIcon from "../../components/icons/PdfIcon";
import Input from "../../components/UI/input/Input";
import useInput from "../../hooks/useInput";
import Button from "../../components/UI/button/Button";
import { format } from "date-fns";
import { v4 } from "uuid";
import { getAuth } from "firebase/auth";
import StatusDropDown from "../../components/status-dropdown/StatusDropDown";
import Modal from "../../components/modals/Modal";
import PaymentModal from "../../components/modals/payment-modal/PaymentModal";
import Loader from "../../components/loader/Loader";
import DatePicker from "react-date-picker";
import { deviceTypesAndProducers, deviceСondition } from "../../constants";

const OrderItem = () => {
    const [order, setOrder] = useState({});
    const [editMode, setEditMode] = useState(false);
    const [paymentModal, setPaymentModal] = useState({ isActive: false, type: "create", payment: {} });

    const [clientOptions, setClientOptions] = useState([]);
    const [deviceTypeOptions, setDeviceTypeOptions] = useState([]);
    const [deviceProducerOptions, setDeviceProducerOptions] = useState([]);
    const [deviceStateOptions, setDeviceStateOptions] = useState([]);

    // client info
    const clientName = useInput("", { isEmpty: true, minLength: 2 });
    const clientPhone = useInput("", { isEmpty: true });
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
    const devicePassword = useInput("", { isEmpty: true });

    // additional info
    const orderExecutor = useInput("");
    const [orderDeadline, setOrderDeadline] = useState("");

    // history
    const comment = useInput("");

    const match = useParams();
    const firebaseId = match.id;

    const auth = getAuth();

    // Create comment on key Enter
    useEffect(() => {
        const onKeypress = (e) => {
            if (e.code === "Enter" && comment.value.length > 0 && comment.isFocused) {
                createComment();
            }
        };
        document.addEventListener("keypress", onKeypress);
        return () => {
            document.removeEventListener("keypress", onKeypress);
        };
    }, [comment]);

    // Realtime updates for history, status
    useEffect(() => {
        const unsub = onSnapshot(doc(db, "orders", firebaseId), (doc) => {
            const data = doc.data();
            setOrder(data);
            setInputValues(data);
        });
        return () => {
            unsub();
        };
    }, [editMode]);

    const setInputValues = (data) => {
        clientName.setValue(data.clientInfo.clientName === "-" ? "" : data.clientInfo.clientName);
        clientPhone.setValue(data.clientInfo.clientPhone === "-" ? "" : data.clientInfo.clientPhone);
        clientEmail.setValue(data.clientInfo.clientEmail === "-" ? "" : data.clientInfo.clientEmail);
        clientAddress.setValue(data.clientInfo.clientAddress === "-" ? "" : data.clientInfo.clientAddress);

        deviceType.setValue(data.deviceInfo.deviceType === "-" ? "" : data.deviceInfo.deviceType);
        deviceProducer.setValue(data.deviceInfo.deviceProducer === "-" ? "" : data.deviceInfo.deviceProducer);
        deviceModel.setValue(data.deviceInfo.deviceModel === "-" ? "" : data.deviceInfo.deviceModel);
        deviceState.setValue(data.deviceInfo.deviceState === "-" ? "" : data.deviceInfo.deviceState);
        deviceBreakage.setValue(data.deviceInfo.deviceBreakage === "-" ? "" : data.deviceInfo.deviceBreakage);
        deviceImeiSn.setValue(data.deviceInfo.deviceImeiSn === "-" ? "" : data.deviceInfo.deviceImeiSn);
        deviceAccessories.setValue(data.deviceInfo.deviceAccessories === "-" ? "" : data.deviceInfo.deviceAccessories);
        devicePassword.setValue(data.deviceInfo.devicePassword === "-" ? "" : data.deviceInfo.devicePassword);

        orderExecutor.setValue(data.orderInfo.orderExecutor === "-" ? "" : data.orderInfo.orderExecutor);
    };

    const editOrder = async (e) => {
        e.preventDefault();

        const orderData = {
            id: order.id,
            techData: order.techData,
            firebaseId: "",
            payments: order.payments,
            history: order.history,
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
                orderDate: order.orderInfo.orderDate,
                orderStatus: order.orderInfo.orderStatus,
                orderType: order.orderInfo.orderType,
                orderAccepted: order.orderInfo.orderAccepted,
                orderExecutor: orderExecutor.value || "-",
                orderDeadline:
                    orderDeadline === null ? "-" : orderDeadline === "" ? order.orderInfo.orderDeadline : orderDeadline?.toLocaleDateString(),
            },
        };

        // Updating order
        const orderRef = doc(db, "orders", firebaseId);
        await setDoc(orderRef, orderData);

        // Creating comment order edited
        await updateDoc(orderRef, {
            history: arrayUnion({
                techDate: Date.now(),
                date: format(new Date(), " H:mm dd.MM.yy"),
                message: "Замовлення відредаговано",
                author: auth.currentUser.displayName,
            }),
        });

        const clientData = {
            firebaseId: "",
            clientName: clientName.value.toLowerCase(),
            clientPhone: clientPhone.value,
            clientEmail: clientEmail.value || "-",
            clientAddress: clientAddress.value || "-",
        };

        // Updating client
        const clientsRef = collection(db, "clients");
        const q = query(clientsRef, where("clientPhone", "==", order.clientInfo.clientPhone));
        const querySnapshot = await getDocs(q);
        const client = querySnapshot.docs.map((doc) => {
            const data = doc.data();
            data.firebaseId = doc.id;
            return data;
        });

        const clientRef = doc(db, "clients", client[0].firebaseId);
        await setDoc(clientRef, clientData);
        setEditMode(false);
    };

    const createComment = async () => {
        if (comment.value.length === 0) return;
        const docRef = doc(db, "orders", firebaseId);
        await updateDoc(docRef, {
            history: arrayUnion({
                techDate: Date.now(),
                date: format(new Date(), " H:mm dd.MM.yy"),
                message: `Коментар: ${comment.value}`,
                author: auth.currentUser.displayName,
            }),
        });
        comment.setValue("");
    };

    const clientsDropDown = async (value) => {
        const ref = collection(db, "clients");
        const q = query(ref, orderBy("clientPhone"), startAt(value.toLowerCase()), endAt(value.toLowerCase() + "\uf8ff"));
        if (value.length >= 3) {
            const snap = await getDocs(q);
            const data = snap.docs.map((item) => item.data());
            setClientOptions(data);
        } else {
            setClientOptions([]);
        }
    };

    const deviceTypeDropDown = (value) => {
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

    const deviceProducerDropDown = (value) => {
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

    const deviceStateDropDown = (value) => {
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
    const { deviceInfo, clientInfo, orderInfo, history, payments } = order;

    return (
        <div className={classes.order}>
            <Modal isModalActive={paymentModal.isActive} onClose={() => setPaymentModal({ isActive: false })}>
                <PaymentModal
                    onClose={() => setPaymentModal({ isActive: false })}
                    firebaseId={firebaseId}
                    payment={paymentModal.payment}
                    techData={order.techData}
                    type={paymentModal.type}
                />
            </Modal>
            <div className="container">
                {Object.keys(order).length ? (
                    <div className={classes.order__body}>
                        <div className={classes.order__header}>
                            <div className={classes.header__info}>
                                <div className={classes.header__column}>
                                    <p className={classes.orderId}>Замовлення #{order.id}</p>
                                    <p className={classes.orderDate}>{order.orderInfo.orderDate}</p>
                                </div>
                                <p className={classes.orderPrice}>
                                    {Object.keys(payments).length
                                        ? payments.length > 1
                                            ? payments.reduce((acc, value) => acc + value.repairPrice, 0)
                                            : payments[0].repairPrice
                                        : "0.00"}{" "}
                                    PLN
                                </p>
                            </div>
                            <div className={classes.header__actions}>
                                <div className={classes.statusDropDown}>
                                    <StatusDropDown firebaseId={firebaseId} order={order} />
                                </div>
                                <div className={classes.actions__row}>
                                    <div className={classes.actions__pdf}>
                                        <Link to="pdf" state={{ orderData: order }}>
                                            <PdfIcon />
                                        </Link>
                                    </div>
                                    <div onClick={() => setPaymentModal({ isActive: true, type: "create" })} className={classes.actions__payment}>
                                        <PaymentsIcon />
                                    </div>

                                    <div onClick={() => setEditMode(!editMode)} className={classes.actions__edit}>
                                        <EditIcon />
                                    </div>
                                    <Link to="/orders">
                                        <div className={classes.actions__close}>
                                            <span></span>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        </div>
                        {order.payments.length ? (
                            <div className={classes.order__payment}>
                                <div className={classes.payment__row}>
                                    <h2 className={classes.title}>Платежі</h2>
                                    {order.techData.paymentType !== null ? (
                                        <p className={classes.paymentType}>Тип оплати {order.techData.paymentType}</p>
                                    ) : null}
                                </div>
                                <table className={classes.table}>
                                    <thead className={classes.table__thead}>
                                        <tr className={classes.table__row}>
                                            <th className={classes.table__item}>Назва</th>
                                            <th className={classes.table__item}>Відпустив</th>
                                            <th className={classes.table__item}>Виконавець</th>
                                            <th className={classes.table__item}>Собівартість PLN</th>
                                            <th className={classes.table__item}>Ціна PLN</th>
                                            <th className={classes.table__item}>Гарантія мс.</th>
                                            <th className={classes.table__item}>Дата</th>
                                        </tr>
                                    </thead>
                                    <tbody className={classes.table__tbody}>
                                        {order.payments.map((payment) => {
                                            return (
                                                <tr
                                                    key={v4()}
                                                    className={classes.table__row}
                                                    onClick={() => setPaymentModal({ isActive: true, type: "edit", payment: payment })}>
                                                    <td className={classes.table__item}>{payment.repairName}</td>
                                                    <td className={classes.table__item}>{payment.paymentAccepted}</td>
                                                    <td className={classes.table__item}>{payment.repairExecutor}</td>
                                                    <td className={classes.table__item}>{payment.repairCost}</td>
                                                    <td className={classes.table__item}>{payment.repairPrice}</td>
                                                    <td className={classes.table__item}>{payment.repairGuarantee}</td>
                                                    <td className={classes.table__item}>{payment.date}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        ) : null}
                        <div className={classes.order__content}>
                            <div className={classes.order__history}>
                                <h2 className={classes.history__title}>History</h2>
                                <div className={classes.history__input}>
                                    <Input
                                        placeholder="Leave a comment..."
                                        onFocus={() => comment.onFocus()}
                                        onBlur={() => comment.onBlur()}
                                        value={comment.value}
                                        onChange={(e) => comment.onChange(e)}
                                    />
                                    <div className={classes.history__submitComment}>
                                        <Button onClick={createComment} color="blue">
                                            Submit
                                        </Button>
                                    </div>
                                </div>
                                <div className={classes.history__comments}>
                                    {history
                                        .sort((a, b) => b.techDate - a.techDate)
                                        ?.map((item) => {
                                            return (
                                                <div key={v4()} className={classes.comment}>
                                                    <p className={classes.message}>{item.message}</p>
                                                    <div className={classes.submessage}>
                                                        <p className={classes.date}>{item.date}</p>
                                                        <p className={classes.author}>{item.author}</p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                </div>
                            </div>
                            <div className={classes.order__column}>
                                {editMode ? (
                                    <div className={classes.order__editMode}>
                                        <h2 className={classes.title}>Режим редагування</h2>
                                        <div className={classes.buttons}>
                                            <div className={classes.button}>
                                                <Button onClick={() => setEditMode(false)} color="red">
                                                    Cancel
                                                </Button>
                                            </div>
                                            <div className={classes.button}>
                                                <Button
                                                    disabled={
                                                        !clientName.inputValid ||
                                                        !clientPhone.inputValid ||
                                                        !deviceAccessories.inputValid ||
                                                        !devicePassword.inputValid
                                                    }
                                                    onClick={editOrder}
                                                    color="blue">
                                                    Завершити
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ) : null}
                                <div className={classes.order__info}>
                                    <div className={classes.order__column}>
                                        <h2 className={classes.order__title}>Інформація</h2>
                                        <div className={classes.orderInfo__content}>
                                            <div className={classes.order__row}>
                                                <h3 className={classes.orderInfo__title}>Тип пристрою</h3>
                                                {editMode ? (
                                                    <div className={classes.input__section}>
                                                        <div className={classes.input}>
                                                            <Input
                                                                value={deviceType.value}
                                                                onChange={(e) => {
                                                                    deviceType.onChange(e);
                                                                    deviceTypeDropDown(e.target.value);
                                                                }}
                                                                onClick={deviceTypeDropDown}
                                                                onBlur={() => {
                                                                    setTimeout(() => {
                                                                        setDeviceTypeOptions([]);
                                                                    }, 100);
                                                                }}
                                                            />
                                                        </div>
                                                        {deviceTypeOptions.length ? (
                                                            <ul className={classes.dropdown}>
                                                                {deviceTypeOptions.map((type) => {
                                                                    return (
                                                                        <li
                                                                            key={v4()}
                                                                            onClick={() => fillInputs("deviceType", type)}
                                                                            className={classes.dropdown__item}>
                                                                            {type}
                                                                        </li>
                                                                    );
                                                                })}
                                                            </ul>
                                                        ) : null}
                                                    </div>
                                                ) : (
                                                    <p className={classes.orderInfo__text}>{deviceInfo.deviceType}</p>
                                                )}
                                            </div>
                                            <div className={classes.order__row}>
                                                <h3 className={classes.orderInfo__title}>Виробник</h3>
                                                {editMode ? (
                                                    <div className={classes.input__section}>
                                                        <div className={classes.input}>
                                                            <Input
                                                                value={deviceProducer.value}
                                                                onChange={(e) => {
                                                                    deviceProducer.onChange(e);
                                                                    deviceProducerDropDown(e.target.value);
                                                                }}
                                                                onClick={deviceProducerDropDown}
                                                                onBlur={() => {
                                                                    setTimeout(() => {
                                                                        setDeviceProducerOptions([]);
                                                                    }, 100);
                                                                }}
                                                            />
                                                        </div>
                                                        {deviceProducerOptions.length ? (
                                                            <ul className={classes.dropdown}>
                                                                {deviceProducerOptions.map((producer) => {
                                                                    return (
                                                                        <li
                                                                            key={v4()}
                                                                            onClick={() => fillInputs("deviceProducer", producer)}
                                                                            className={classes.dropdown__item}>
                                                                            {producer}
                                                                        </li>
                                                                    );
                                                                })}
                                                            </ul>
                                                        ) : null}
                                                    </div>
                                                ) : (
                                                    <p className={classes.orderInfo__text}>{deviceInfo.deviceProducer}</p>
                                                )}
                                            </div>
                                            <div className={classes.order__row}>
                                                <h3 className={classes.orderInfo__title}>Модель</h3>
                                                {editMode ? (
                                                    <div className={classes.input__section}>
                                                        <div className={classes.input}>
                                                            <Input value={deviceModel.value} onChange={(e) => deviceModel.onChange(e)} />
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <p className={classes.orderInfo__text}>{deviceInfo.deviceModel}</p>
                                                )}
                                            </div>
                                            <div className={classes.order__row}>
                                                <h3 className={classes.orderInfo__title}>Технічний стан</h3>
                                                {editMode ? (
                                                    <div className={classes.input__section}>
                                                        <div className={classes.input}>
                                                            <Input
                                                                value={deviceState.value}
                                                                onChange={(e) => {
                                                                    deviceState.onChange(e);
                                                                    deviceStateDropDown(e.target.value);
                                                                }}
                                                                onClick={deviceStateDropDown}
                                                                onBlur={() => {
                                                                    setTimeout(() => {
                                                                        setDeviceStateOptions([]);
                                                                    }, 100);
                                                                }}
                                                            />
                                                        </div>
                                                        {deviceStateOptions.length ? (
                                                            <ul className={classes.dropdown}>
                                                                {deviceStateOptions.map((state) => {
                                                                    return (
                                                                        <li
                                                                            key={v4()}
                                                                            onClick={() => fillInputs("deviceState", state)}
                                                                            className={classes.dropdown__item}>
                                                                            {state}
                                                                        </li>
                                                                    );
                                                                })}
                                                            </ul>
                                                        ) : null}
                                                    </div>
                                                ) : (
                                                    <p className={classes.orderInfo__text}>{deviceInfo.deviceState}</p>
                                                )}
                                            </div>
                                            <div className={classes.order__row}>
                                                <h3 className={classes.orderInfo__title}>Несправність</h3>
                                                {editMode ? (
                                                    <div className={classes.input__section}>
                                                        <div className={classes.input}>
                                                            <Input value={deviceBreakage.value} onChange={(e) => deviceBreakage.onChange(e)} />
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <p className={classes.orderInfo__text}>{deviceInfo.deviceBreakage}</p>
                                                )}
                                            </div>
                                            <div className={classes.order__row}>
                                                <h3 className={classes.orderInfo__title}>IMEI / SN</h3>
                                                {editMode ? (
                                                    <div className={classes.input__section}>
                                                        <div className={classes.input}>
                                                            <Input value={deviceImeiSn.value} onChange={(e) => deviceImeiSn.onChange(e)} />
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <p className={classes.orderInfo__text}>{deviceInfo.deviceImeiSn}</p>
                                                )}
                                            </div>
                                            <div className={classes.order__row}>
                                                <h3 className={classes.orderInfo__title}>Аксесуари</h3>
                                                {editMode ? (
                                                    <div className={classes.input__section}>
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
                                                ) : (
                                                    <p className={classes.orderInfo__text}>{deviceInfo.deviceAccessories}</p>
                                                )}
                                            </div>
                                            <div className={classes.order__row}>
                                                <h3 className={classes.orderInfo__title}>Пароль</h3>
                                                {editMode ? (
                                                    <div className={classes.input__section}>
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
                                                ) : (
                                                    <p className={classes.orderInfo__text}>{deviceInfo.devicePassword}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className={classes.order__column}>
                                        <h2 className={classes.orderInfo__title}>Клієнт</h2>
                                        <div className={classes.orderInfo__content}>
                                            <div className={classes.order__row}>
                                                <h3 className={classes.orderInfo__title}>Ім'я</h3>
                                                {editMode ? (
                                                    <div className={classes.input__section}>
                                                        <div className={classes.input}>
                                                            <Input
                                                                value={clientName.value}
                                                                onChange={(e) => clientName.onChange(e)}
                                                                onBlur={() => clientName.onBlur()}
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
                                                ) : (
                                                    <p className={classes.orderInfo__text}>{clientInfo.clientName}</p>
                                                )}
                                            </div>
                                            <div className={classes.order__row}>
                                                <h3 className={classes.orderInfo__title}>Телефон</h3>
                                                {editMode ? (
                                                    <div className={classes.input__section}>
                                                        <div className={classes.input}>
                                                            <Input
                                                                value={clientPhone.value}
                                                                onClick={(e) => clientsDropDown(e.target.value)}
                                                                onChange={(e) => {
                                                                    clientPhone.onChange(e);
                                                                    clientsDropDown(e.target.value);
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
                                                            <ul className={classes.dropdown}>
                                                                {clientOptions.map((client) => {
                                                                    return (
                                                                        <li
                                                                            key={client.clientPhone}
                                                                            onClick={() => fillInputs("client", client)}
                                                                            className={classes.dropdown__item}>
                                                                            {client.clientName + " " + client.clientPhone}
                                                                        </li>
                                                                    );
                                                                })}
                                                            </ul>
                                                        ) : null}
                                                        <p className={classes.error}>
                                                            {clientPhone.isDirty && clientPhone.isEmpty
                                                                ? "Поле не може бути пустим"
                                                                : clientPhone.isDirty && clientPhone.lengthError
                                                                ? "Кількість символів 10"
                                                                : ""}
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <p className={classes.orderInfo__text}>{clientInfo.clientPhone}</p>
                                                )}
                                            </div>
                                            <div className={classes.order__row}>
                                                <h3 className={classes.orderInfo__title}>Пошта</h3>
                                                {editMode ? (
                                                    <div className={classes.input__section}>
                                                        <div className={classes.input}>
                                                            <Input value={clientEmail.value} onChange={(e) => clientEmail.onChange(e)} />
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <p className={classes.orderInfo__text}>{clientInfo.clientEmail}</p>
                                                )}
                                            </div>
                                            <div className={classes.order__row}>
                                                <h3 className={classes.orderInfo__title}>Адреса</h3>
                                                {editMode ? (
                                                    <div className={classes.input__section}>
                                                        <div className={classes.input}>
                                                            <Input value={clientAddress.value} onChange={(e) => clientAddress.onChange(e)} />
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <p className={classes.orderInfo__text}>{clientInfo.clientAddress}</p>
                                                )}
                                            </div>
                                        </div>

                                        <h2 className={classes.orderInfo__title}>Додаткова інформація</h2>
                                        <div className={classes.orderInfo__content}>
                                            <div className={classes.order__row}>
                                                <h3 className={classes.orderInfo__title}>Тип замовлення</h3>
                                                <p className={classes.orderInfo__text}>{orderInfo.orderType}</p>
                                            </div>
                                            <div className={classes.order__row}>
                                                <h3 className={classes.orderInfo__title}>Прийняв замовлення</h3>
                                                <p className={classes.orderInfo__text}>{orderInfo.orderAccepted}</p>
                                            </div>
                                            <div className={classes.order__row}>
                                                <h3 className={classes.orderInfo__title}>Виконавець замовлення</h3>
                                                {editMode ? (
                                                    <div className={classes.input__section}>
                                                        <div className={classes.input}>
                                                            <Input value={orderExecutor.value} onChange={(e) => orderExecutor.onChange(e)} />
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <p className={classes.orderInfo__text}>{orderInfo.orderExecutor}</p>
                                                )}
                                            </div>
                                            <div className={classes.order__row}>
                                                <h3 className={classes.orderInfo__title}>Термін виконання</h3>
                                                {editMode ? (
                                                    <div className={classes.input__section}>
                                                        <div className={classes.input}>
                                                            <DatePicker
                                                                dayPlaceholder={
                                                                    orderInfo.orderDeadline.length > 1 ? orderInfo.orderDeadline.slice(0, 2) : "- -"
                                                                }
                                                                monthPlaceholder={
                                                                    orderInfo.orderDeadline.length > 1 ? orderInfo.orderDeadline.slice(3, 5) : "- -"
                                                                }
                                                                yearPlaceholder={
                                                                    orderInfo.orderDeadline.length > 1
                                                                        ? orderInfo.orderDeadline.slice(6, 10)
                                                                        : "- - - -"
                                                                }
                                                                format="dd.MM.y"
                                                                onChange={setOrderDeadline}
                                                                value={orderDeadline}
                                                            />
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <p className={classes.orderInfo__text}>{orderInfo.orderDeadline}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <Loader />
                )}
            </div>
        </div>
    );
};

export default OrderItem;
