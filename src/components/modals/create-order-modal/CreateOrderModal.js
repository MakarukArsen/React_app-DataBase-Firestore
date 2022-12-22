import React from "react";
import classes from "./CreateOrderModal.module.scss";
import Button from "../../UI/button/Button";
import { Link } from "react-router-dom";
const CreateOrderModal = ({ onClose }) => {
    return (
        <div className={classes.modal}>
            <h2 className={classes.title}>Замовлення створено</h2>
            <div className={classes.buttons}>
                <div className={classes.button}>
                    <Link to="/">
                        <Button color="black">Перейти до замовлень</Button>
                    </Link>
                </div>
                <div className={classes.button}>
                    <Button onClick={onClose} color="blue">
                        Створити ще одне замовлення
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CreateOrderModal;
