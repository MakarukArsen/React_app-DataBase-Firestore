import React, { useEffect, useState } from "react";
import classes from "./Header.module.scss";
import { NavLink } from "react-router-dom";
import TasksIcon from "../icons/TasksIcon";
import OrdersIcon from "../icons/OrdersIcon";
import PaymentsIcon from "../icons/PaymentsIcon";
import ClientsIcon from "../icons/ClientsIcon";
import StorageIcon from "../icons/StorageIcon";
import Modal from "../modals/Modal";
import AuthModal from "../modals/auth-modal/AuthModal";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const Header = () => {
    const [isModalActive, setModalActive] = useState(false);
    const [userName, setUserName] = useState("LogIn");

    const auth = getAuth();
    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserName(user.displayName);
            }
        });
    }, [auth.currentUser]);

    return (
        <div className={classes.header}>
            <Modal isModalActive={isModalActive} onClose={() => setModalActive(false)}>
                <AuthModal onClose={() => setModalActive(false)} />
            </Modal>
            <div className="container">
                <div className={classes.header__content}>
                    <ul className={classes.navigate}>
                        <li>
                            <div className={classes.navigate__logo}>
                                <p>
                                    <span>D</span>S
                                </p>
                            </div>
                        </li>
                        <li>
                            <NavLink to="" className={classes.navigate__link}>
                                <div className={classes.navigate__icon}>
                                    <TasksIcon />
                                </div>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/" className={({ isActive }) => (isActive ? classes.navigate__link_active : classes.navigate__link)}>
                                <div className={classes.navigate__icon}>
                                    <OrdersIcon />
                                </div>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/" className={classes.navigate__link}>
                                <div className={classes.navigate__icon}>
                                    <PaymentsIcon />
                                </div>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/clients" className={({ isActive }) => (isActive ? classes.navigate__link_active : classes.navigate__link)}>
                                <div className={classes.navigate__icon}>
                                    <ClientsIcon />
                                </div>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/" className={classes.navigate__link}>
                                <div className={classes.navigate__icon}>
                                    <StorageIcon />
                                </div>
                            </NavLink>
                        </li>
                    </ul>
                    <div className={classes.header__actions}>
                        <div onClick={() => setModalActive(true)} className={classes.header__account}>
                            <img src={require("../../assets/acc.jpg")} alt="*" />
                            <p>{userName}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;
