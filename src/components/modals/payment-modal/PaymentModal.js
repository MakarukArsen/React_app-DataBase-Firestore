import { format } from "date-fns";
import { getAuth } from "firebase/auth";
import { arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import React from "react";
import { v4 } from "uuid";
import { db } from "../../../firebase";
import useInput from "../../../hooks/useInput";
import useSelect from "../../../hooks/useSelect";
import Button from "../../UI/button/Button";
import Input from "../../UI/input/Input";
import Select from "../../UI/select/Select";
import classes from "./PaymentModal.module.scss";

const PaymentModal = ({ firebaseId, onClose, payment, techData, type }) => {
    const auth = getAuth();

    const repairName = useInput(type === "edit" ? payment.repairName : "", { isEmpty: true });
    const repairExecutor = useSelect({ defaultValue: type === "edit" ? payment.repairExecutor : "Роман", options: ["Роман", "Арсен"] });
    const repairCost = useInput(type === "edit" ? payment.repairCost : "");
    const repairPrice = useInput(type === "edit" ? payment.repairPrice : "", { isEmpty: true });
    const repairGuarantee = useInput(type === "edit" ? payment.repairGuarantee : "");

    const addPayment = async (e) => {
        e.preventDefault();
        const docRef = doc(db, "orders", firebaseId);
        await updateDoc(docRef, {
            techData: {
                techDate: techData.techDate,
                isAnyPayments: true,
                paymentType: techData.paymentType,
            },
            payments: arrayUnion({
                repairName: repairName.value,
                paymentAccepted: auth.currentUser.displayName,
                repairExecutor: repairExecutor.value,
                repairCost: +repairCost.value,
                repairPrice: +repairPrice.value,
                repairGuarantee: repairGuarantee.value || "-",
                date: format(new Date(), "H:mm dd.MM.yy"),
                id: v4(),
            }),
            history: arrayUnion({
                techDate: Date.now(),
                date: format(new Date(), "H:mm dd.MM.yy"),
                message: `Добавлений платіж: ${repairName.value} - ${repairPrice.value} PLN`,
                author: auth.currentUser.displayName,
            }),
        });
        onClose();
    };

    const updatePayment = async (e) => {
        e.preventDefault();
        const docRef = doc(db, "orders", firebaseId);
        const snapshot = await getDoc(docRef);
        const paymentData = snapshot.data().payments;
        const filteredPaymentData = paymentData.filter((item) => {
            return item.id !== payment.id;
        });
        filteredPaymentData.push({
            repairName: repairName.value,
            paymentAccepted: auth.currentUser.displayName,
            repairExecutor: repairExecutor.value,
            repairCost: +repairCost.value,
            repairPrice: +repairPrice.value,
            repairGuarantee: repairGuarantee.value || "-",
            date: format(new Date(), "H:mm dd.MM.yy"),
            id: v4(),
        });
        await updateDoc(docRef, {
            payments: filteredPaymentData,
            history: arrayUnion({
                techDate: Date.now(),
                date: format(new Date(), "H:mm dd.MM.yy"),
                message: `Платіж відредаговано: ${repairName.value} - ${repairPrice.value} PLN`,
                author: auth.currentUser.displayName,
            }),
        });
        onClose();
    };
    return (
        <div className={classes.modal}>
            <div className={classes.payment}>
                <h2 className={classes.title}>{type === "edit" ? "Редагування платежу" : "Добавити платіж"}</h2>
                <form className={classes.form}>
                    <div className={classes.inputSection}>
                        <h3>Назва ремонту</h3>
                        <div className={classes.input}>
                            <Input value={repairName.value} onChange={(e) => repairName.onChange(e)} onBlur={() => repairName.onBlur()} />
                        </div>
                        <p className={classes.error}>{repairName.isDirty && repairName.isEmpty ? "Поле не може бути пустим" : ""}</p>
                    </div>
                    <div className={classes.row}>
                        <div className={classes.inputSection}>
                            <h3>Відпустив</h3>
                            <p className={classes.text}>{auth.currentUser.displayName}</p>
                        </div>
                        <div className={classes.inputSection}>
                            <h3>Виконавець</h3>
                            <Select {...repairExecutor} />
                        </div>
                    </div>
                    <div className={classes.row}>
                        <div className={classes.inputSection}>
                            <h3>Собівартість ремонту</h3>
                            <div className={classes.input}>
                                <Input value={repairCost.value} onChange={(e) => repairCost.onChange(e)} type="number" />
                            </div>
                        </div>
                        <div className={classes.inputSection}>
                            <h3>Ціна для клієнта</h3>
                            <div className={classes.input}>
                                <Input
                                    value={repairPrice.value}
                                    onChange={(e) => repairPrice.onChange(e)}
                                    type="number"
                                    onBlur={() => repairPrice.onBlur()}
                                />
                            </div>
                            <p className={classes.error}>{repairPrice.isDirty && repairPrice.isEmpty ? "Поле не може бути пустим" : ""}</p>
                        </div>
                    </div>
                    <div className={classes.inputSection}>
                        <h3>Гарантія мс.</h3>
                        <div className={classes.input}>
                            <Input value={repairGuarantee.value} onChange={(e) => repairGuarantee.onChange(e)} type="number" />
                        </div>
                    </div>
                    <div className={classes.button}>
                        <Button
                            onClick={type === "edit" ? updatePayment : addPayment}
                            disabled={!repairName.inputValid || !repairPrice.inputValid}
                            color="blue">
                            {type === "edit" ? "Редагувати" : "Завершити"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PaymentModal;
