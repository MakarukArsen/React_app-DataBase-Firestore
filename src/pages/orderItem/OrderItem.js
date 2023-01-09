import { arrayUnion, doc, getDoc, onSnapshot, setDoc, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { db } from "../../firebase";
import classes from "./OrderItem.module.scss";
import EditIcon from "../../components/icons/EditIcon";
import PaymentsIcon from "../../components/icons/PaymentsIcon";
import Input from "../../components/UI/input/Input";
import useInput from "../../hooks/useInput";
import Button from "../../components/UI/button/Button";
import { format } from "date-fns";
import { v4 } from "uuid";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import StatusDropDown from "../../components/status-dropdown/StatusDropDown";
import Modal from "../../components/modals/Modal";
import PaymentModal from "../../components/modals/payment-modal/PaymentModal";
const OrderItem = () => {
    const [order, setOrder] = useState({});
    const [editMode, setEditMode] = useState(false);
    const [userName, setUserName] = useState("");
    const [isModalActive, setModalActive] = useState(false);

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
    const orderExecutor = useInput("");
    const orderDeadline = useInput("");

    // history
    const comment = useInput("");

    const match = useParams();
    const firebaseId = match.id;

    const auth = getAuth();
    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserName(user.displayName);
            }
        });
    }, [auth.currentUser]);

    useEffect(() => {
        const unsub = onSnapshot(doc(db, "orders", firebaseId), (doc) => {
            const data = doc.data();
            setOrder(data);
            setInputValues(data);
        });
        return () => {
            unsub();
        };
    }, []);

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
        orderDeadline.setValue(data.orderInfo.orderDeadline === "-" ? "" : data.orderInfo.orderDeadline);
    };

    const handleSumbit = async (e) => {
        e.preventDefault();
        const orderData = {
            id: order.id,
            fireBaseId: "",
            payment: order.payment,
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
                orderUpdatedDate: format(new Date(), "H:mm dd.MM.yyy"),
                orderStatus: order.orderInfo.orderStatus,
                orderType: order.orderInfo.orderType,
                orderAccepted: order.orderInfo.orderAccepted,
                orderExecutor: orderExecutor.value || "-",
                orderDeadline: orderDeadline.value || "-",
            },
        };
        const docRef = doc(db, "orders", firebaseId);
        await setDoc(docRef, orderData);
        setEditMode(false);
    };
    const createComment = async () => {
        const docRef = doc(db, "orders", firebaseId);
        await updateDoc(docRef, {
            history: arrayUnion({
                techDate: Date.now(),
                date: format(new Date(), " H:mm dd.MM.yy"),
                message: `Коментар: ${comment.value}`,
                author: userName,
            }),
        });
        comment.setValue("");
    };

    const { deviceInfo, clientInfo, orderInfo, history, payment } = order;
    return (
        <div className={classes.order}>
            <Modal isModalActive={isModalActive} onClose={() => setModalActive(false)}>
                <PaymentModal onClose={() => setModalActive(false)} firebaseId={firebaseId} />
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
                                    {Object.keys(payment).length
                                        ? payment.length > 1
                                            ? payment.reduce((acc, value) => acc + value.repairPrice, 0)
                                            : payment[0].repairPrice
                                        : "0.00"}{" "}
                                    PLN
                                </p>
                            </div>
                            <div className={classes.header__actions}>
                                <div onClick={() => setModalActive(true)} className={classes.actions__payment}>
                                    <PaymentsIcon />
                                </div>

                                <div onClick={() => setEditMode(!editMode)} className={classes.actions__edit}>
                                    <EditIcon />
                                </div>
                                <Link to="/">
                                    <div className={classes.actions__close}>
                                        <span></span>
                                    </div>
                                </Link>
                            </div>
                        </div>
                        {order.payment.length ? (
                            <div className={classes.order__payment}>
                                <h2 className={classes.title}>Price</h2>
                                <div className={classes.content}>
                                    <div className={classes.col}>
                                        <h3>Назва</h3>
                                        {payment.map((item) => (
                                            <p key={v4()}>{item.repairName}</p>
                                        ))}
                                    </div>
                                    <div className={classes.col}>
                                        <h3>Відпустив</h3>
                                        {payment.map((item) => (
                                            <p key={v4()}>{item.paymentAccepted}</p>
                                        ))}
                                    </div>
                                    <div className={classes.col}>
                                        <h3>Виконавець</h3>
                                        {payment.map((item) => (
                                            <p key={v4()}>{item.repairExecutor}</p>
                                        ))}
                                    </div>
                                    <div className={classes.col}>
                                        <h3>Собівартість</h3>
                                        {payment.map((item) => (
                                            <p key={v4()}>{item.repairCost} PLN</p>
                                        ))}
                                    </div>
                                    <div className={classes.col}>
                                        <h3>Ціна </h3>
                                        {payment.map((item) => (
                                            <p key={v4()}>{item.repairPrice} PLN</p>
                                        ))}
                                    </div>
                                    <div className={classes.col}>
                                        <h3>Тип оплати</h3>
                                        {payment.map((item) => (
                                            <p key={v4()}>{item.paymentType}</p>
                                        ))}
                                    </div>
                                    <div className={classes.col}>
                                        <h3>Гарантія дн.</h3>
                                        {payment.map((item) => (
                                            <p key={v4()}>{item.guarantee}</p>
                                        ))}
                                    </div>
                                    <div className={classes.col}>
                                        <h3>Дата</h3>
                                        {payment.map((item) => (
                                            <p key={v4()}>{item.date}</p>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            ""
                        )}
                        <div className={classes.order__content}>
                            <div className={classes.order__history}>
                                <h2 className={classes.history__title}>History</h2>
                                <div className={classes.history__input}>
                                    <Input placeholder="Leave a comment..." value={comment.value} onChange={(e) => comment.onChange(e)} />
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
                                                <Button onClick={handleSumbit} color="blue">
                                                    Submit
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    ""
                                )}
                                <div className={classes.order__info}>
                                    <div className={classes.order__column}>
                                        <h2 className={classes.order__title}>Інформація</h2>
                                        <div className={classes.orderInfo__content}>
                                            <div className={classes.order__row}>
                                                <h3 className={classes.orderInfo__title}>Тип пристрою</h3>
                                                {editMode ? (
                                                    <Input value={deviceType.value} onChange={(e) => deviceType.onChange(e)} />
                                                ) : (
                                                    <p className={classes.orderInfo__text}>{deviceInfo.deviceType}</p>
                                                )}
                                            </div>
                                            <div className={classes.order__row}>
                                                <h3 className={classes.orderInfo__title}>Виробник</h3>
                                                {editMode ? (
                                                    <Input value={deviceProducer.value} onChange={(e) => deviceProducer.onChange(e)} />
                                                ) : (
                                                    <p className={classes.orderInfo__text}>{deviceInfo.deviceProducer}</p>
                                                )}
                                            </div>
                                            <div className={classes.order__row}>
                                                <h3 className={classes.orderInfo__title}>Модель</h3>
                                                {editMode ? (
                                                    <Input value={deviceModel.value} onChange={(e) => deviceModel.onChange(e)} />
                                                ) : (
                                                    <p className={classes.orderInfo__text}>{deviceInfo.deviceModel}</p>
                                                )}
                                            </div>
                                            <div className={classes.order__row}>
                                                <h3 className={classes.orderInfo__title}>Технічний стан</h3>
                                                {editMode ? (
                                                    <Input value={deviceState.value} onChange={(e) => deviceState.onChange(e)} />
                                                ) : (
                                                    <p className={classes.orderInfo__text}>{deviceInfo.deviceState}</p>
                                                )}
                                            </div>
                                            <div className={classes.order__row}>
                                                <h3 className={classes.orderInfo__title}>Несправність</h3>
                                                {editMode ? (
                                                    <Input value={deviceBreakage.value} onChange={(e) => deviceBreakage.onChange(e)} />
                                                ) : (
                                                    <p className={classes.orderInfo__text}>{deviceInfo.deviceBreakage}</p>
                                                )}
                                            </div>
                                            <div className={classes.order__row}>
                                                <h3 className={classes.orderInfo__title}>IMEI / SN</h3>
                                                {editMode ? (
                                                    <Input value={deviceImeiSn.value} onChange={(e) => deviceImeiSn.onChange(e)} />
                                                ) : (
                                                    <p className={classes.orderInfo__text}>{deviceInfo.deviceImeiSn}</p>
                                                )}
                                            </div>
                                            <div className={classes.order__row}>
                                                <h3 className={classes.orderInfo__title}>Аксесуари</h3>
                                                {editMode ? (
                                                    <Input value={deviceAccessories.value} onChange={(e) => deviceAccessories.onChange(e)} />
                                                ) : (
                                                    <p className={classes.orderInfo__text}>{deviceInfo.deviceAccessories}</p>
                                                )}
                                            </div>
                                            <div className={classes.order__row}>
                                                <h3 className={classes.orderInfo__title}>Пароль</h3>
                                                {editMode ? (
                                                    <Input value={devicePassword.value} onChange={(e) => devicePassword.onChange(e)} />
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
                                                    <Input value={clientName.value} onChange={(e) => clientName.onChange(e)} />
                                                ) : (
                                                    <p className={classes.orderInfo__text}>{clientInfo.clientName}</p>
                                                )}
                                            </div>
                                            <div className={classes.order__row}>
                                                <h3 className={classes.orderInfo__title}>Телефон</h3>
                                                {editMode ? (
                                                    <Input value={clientPhone.value} onChange={(e) => clientPhone.onChange(e)} />
                                                ) : (
                                                    <p className={classes.orderInfo__text}>{clientInfo.clientPhone}</p>
                                                )}
                                            </div>
                                            <div className={classes.order__row}>
                                                <h3 className={classes.orderInfo__title}>Пошта</h3>
                                                {editMode ? (
                                                    <Input value={clientEmail.value} onChange={(e) => clientEmail.onChange(e)} />
                                                ) : (
                                                    <p className={classes.orderInfo__text}>{clientInfo.clientEmail}</p>
                                                )}
                                            </div>
                                            <div className={classes.order__row}>
                                                <h3 className={classes.orderInfo__title}>Адреса</h3>
                                                {editMode ? (
                                                    <Input value={clientAddress.value} onChange={(e) => clientAddress.onChange(e)} />
                                                ) : (
                                                    <p className={classes.orderInfo__text}>{clientInfo.clientAddress}</p>
                                                )}
                                            </div>
                                        </div>

                                        <h2 className={classes.orderInfo__title}>Додаткова інформація</h2>
                                        <div className={classes.orderInfo__content}>
                                            <div className={classes.order__row}>
                                                <h3 className={classes.orderInfo__title}>Статус</h3>
                                                <div className={classes.orderInfo__text}>
                                                    <StatusDropDown firebaseId={firebaseId} order={order} />
                                                </div>
                                            </div>
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
                                                    <Input value={orderExecutor.value} onChange={(e) => orderExecutor.onChange(e)} />
                                                ) : (
                                                    <p className={classes.orderInfo__text}>{orderInfo.orderExecutor}</p>
                                                )}
                                            </div>
                                            <div className={classes.order__row}>
                                                <h3 className={classes.orderInfo__title}>Термін виконання</h3>
                                                {editMode ? (
                                                    <Input value={orderDeadline.value} onChange={(e) => orderDeadline.onChange(e)} />
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
                    "loading"
                )}
            </div>
        </div>
    );
};

export default OrderItem;
