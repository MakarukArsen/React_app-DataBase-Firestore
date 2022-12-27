import React from "react";
import classes from "./Header.module.scss";
import { NavLink } from "react-router-dom";
import TasksIcon from "../icons/TasksIcon";
import OrdersIcon from "../icons/OrdersIcon";
import PaymentsIcon from "../icons/PaymentsIcon";
import ClientsIcon from "../icons/ClientsIcon";
import StorageIcon from "../icons/StorageIcon";
const Header = () => {
    return (
        <div className={classes.header}>
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
                            <NavLink to="*" className={classes.navigate__link}>
                                <div className={classes.navigate__icon}>
                                    <StorageIcon />
                                </div>
                            </NavLink>
                        </li>
                    </ul>
                    <div className={classes.header__actions}>
                        <div className={classes.header__account}>
                            <img src={require("../../assets/acc.jpg")} alt="*" />
                            <p>Account</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;
