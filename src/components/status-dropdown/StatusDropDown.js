import { format } from "date-fns";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import classes from "./StatusDropDown.module.scss";
const StatusDropDown = ({ order, firebaseId }) => {
    const [active, setActive] = useState(false);
    const [chosenOption, setChosenOption] = useState(order.orderInfo.orderStatus);
    const [userName, setUserName] = useState("");

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
            <div className={classes.header}>
                <p
                    onClick={handleClick}
                    className={`${classes.item} ${
                        chosenOption === "До діагностики"
                            ? classes.blue
                            : chosenOption === "Чекаєм на згоду"
                            ? classes.yellow
                            : chosenOption === "Відставка"
                            ? classes.red
                            : chosenOption === "В ремонті"
                            ? classes.orange
                            : chosenOption === "Чекаємо на запчастини"
                            ? classes.yellow
                            : chosenOption === "Післяремонтні випробування"
                            ? classes.orange
                            : chosenOption === "До видання"
                            ? classes.green
                            : chosenOption === "Отримано без оплати"
                            ? classes.violet
                            : chosenOption === "Завершено"
                            ? classes.black
                            : chosenOption === "Відпущено без ремонту"
                            ? classes.red
                            : ""
                    }`}>
                    {chosenOption}
                </p>
            </div>
            {active ? (
                <div className={classes.body} onClick={(e) => e.stopPropagation()}>
                    <p className={classes.item + " " + classes.blue} onClick={(e) => updateOrder(e, "До діагностики")}>
                        До діагностики
                    </p>
                    <p className={classes.item + " " + classes.yellow} onClick={(e) => updateOrder(e, "Чекаєм на згоду")}>
                        Чекаєм на згоду
                    </p>
                    <p className={classes.item + " " + classes.red} onClick={(e) => updateOrder(e, "Відставка")}>
                        Відставка
                    </p>
                    <p className={classes.item + " " + classes.orange} onClick={(e) => updateOrder(e, "В ремонті")}>
                        В ремонті
                    </p>
                    <p className={classes.item + " " + classes.yellow} onClick={(e) => updateOrder(e, "Чекаємо на запчастини")}>
                        Чекаємо на запчастини
                    </p>
                    <p className={classes.item + " " + classes.orange} onClick={(e) => updateOrder(e, "Післяремонтні випробування")}>
                        Післяремонтні випробування
                    </p>
                    <p className={classes.item + " " + classes.green} onClick={(e) => updateOrder(e, "До видання")}>
                        До видання
                    </p>
                    <p className={classes.item + " " + classes.violet} onClick={(e) => updateOrder(e, "Отримано без оплати")}>
                        Отримано без оплати
                    </p>
                    <p className={classes.item + " " + classes.black} onClick={(e) => updateOrder(e, "Завершено")}>
                        Завершено
                    </p>
                    <p className={classes.item + " " + classes.red} onClick={(e) => updateOrder(e, "Відпущено без ремонту")}>
                        Відпущено без ремонту
                    </p>
                </div>
            ) : (
                ""
            )}
        </div>
    );
};

export default StatusDropDown;
