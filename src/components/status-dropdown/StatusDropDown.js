import { format } from "date-fns";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import classes from "./StatusDropDown.module.scss";
import Modal from "../modals/Modal";
import PaymentTypeModal from "../modals/paymentTypeModal/PaymentTypeModal";

const StatusDropDown = ({ order, firebaseId }) => {
    const [active, setActive] = useState(false);
    const [chosenOption, setChosenOption] = useState(order.orderInfo.orderStatus);
    const [userName, setUserName] = useState("");
    const [isPaymentTypeModalActive, setPaymentTypeModalActive] = useState(false);

    const auth = getAuth();
    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserName(user.displayName);
            }
        });
    }, [auth.currentUser]);

    const handleClick = (e) => {
        e.stopPropagation();
        setActive(!active);
    };

    const updateOrder = async (e, status) => {
        e.stopPropagation();
        setActive(false);
        const startStatus = chosenOption;
        if (startStatus !== "Zakończone" && status === "Zakończone" && order.payments.length) {
            setPaymentTypeModalActive(true);
        }

        setChosenOption(status);
        const docRef = doc(db, "orders", firebaseId);
        await updateDoc(docRef, {
            "orderInfo.orderStatus": status,
            "orderInfo.orderUpdatedDate": format(new Date(), "H:mm dd.MM.yyy"),
            history: arrayUnion({
                techDate: Date.now(),
                date: format(new Date(), " H:mm .MM.yy"),
                message: `Оновлено статус: ${status}`,
                author: userName,
            }),
        });
    };
    return (
        <div className={classes.dropdown} onMouseLeave={() => setActive(false)}>
            <Modal
                isModalActive={isPaymentTypeModalActive}
                onClose={(e) => {
                    setPaymentTypeModalActive(false);
                    e.stopPropagation();
                }}>
                <PaymentTypeModal onClose={() => setPaymentTypeModalActive(false)} firebaseId={firebaseId} order={order} />
            </Modal>
            <div className={classes.header}>
                <p
                    onClick={handleClick}
                    className={`${classes.item} ${
                        chosenOption === "Do diagnozy"
                            ? classes.blue
                            : chosenOption === "Czekamy na zgodę"
                            ? classes.yellow
                            : chosenOption === "Zgoda na naprawę"
                            ? classes.cyan
                            : chosenOption === "Rezygnacja"
                            ? classes.red
                            : chosenOption === "W trakcie naprawy"
                            ? classes.blackGreen
                            : chosenOption === "Czekamy na części"
                            ? classes.orange
                            : chosenOption === "Testy po naprawie"
                            ? classes.blue
                            : chosenOption === "Do odbioru"
                            ? classes.green
                            : chosenOption === "Odebrane niezapłacone"
                            ? classes.violet
                            : chosenOption === "Zakończone"
                            ? classes.black
                            : chosenOption === "Wydane bez naprawy"
                            ? classes.red
                            : ""
                    }`}>
                    {chosenOption}
                </p>
            </div>
            {active ? (
                <div className={classes.body} onClick={(e) => e.stopPropagation()}>
                    <p className={classes.item + " " + classes.blue} onClick={(e) => updateOrder(e, "Do diagnozy")}>
                        Do diagnozy
                    </p>
                    <p className={classes.item + " " + classes.yellow} onClick={(e) => updateOrder(e, "Czekamy na zgodę")}>
                        Czekamy na zgodę
                    </p>
                    <p className={classes.item + " " + classes.cyan} onClick={(e) => updateOrder(e, "Zgoda na naprawę")}>
                        Zgoda na naprawę
                    </p>
                    <p className={classes.item + " " + classes.red} onClick={(e) => updateOrder(e, "Rezygnacja")}>
                        Rezygnacja
                    </p>
                    <p className={classes.item + " " + classes.blackGreen} onClick={(e) => updateOrder(e, "W trakcie naprawy")}>
                        W trakcie naprawy
                    </p>
                    <p className={classes.item + " " + classes.orange} onClick={(e) => updateOrder(e, "Czekamy na części")}>
                        Czekamy na części
                    </p>
                    <p className={classes.item + " " + classes.blue} onClick={(e) => updateOrder(e, "Testy po naprawie")}>
                        Testy po naprawie
                    </p>
                    <p className={classes.item + " " + classes.green} onClick={(e) => updateOrder(e, "Do odbioru")}>
                        Do odbioru
                    </p>
                    <p className={classes.item + " " + classes.violet} onClick={(e) => updateOrder(e, "Odebrane niezapłacone")}>
                        Odebrane niezapłacone
                    </p>
                    <p className={classes.item + " " + classes.black} onClick={(e) => updateOrder(e, "Zakończone")}>
                        Zakończone
                    </p>
                    <p className={classes.item + " " + classes.red} onClick={(e) => updateOrder(e, "Wydane bez naprawy")}>
                        Wydane bez naprawy
                    </p>
                </div>
            ) : (
                ""
            )}
        </div>
    );
};

export default StatusDropDown;
