import React from "react";
import { Link } from "react-router-dom";
import classes from "./Navbar.module.scss";
import TasksIcon from "../icons/TasksIcon";
import OrdersIcon from "../icons/OrdersIcon";
import PaymentsIcon from "../icons/PaymentsIcon";
import ClientsIcon from "../icons/ClientsIcon";
import StorageIcon from "../icons/StorageIcon";
const Navbar = () => {
    return (
        <div className={classes.navbar}>
            <div className="container">
                <ul className={classes.navbar__list}>
                    <li className={classes.navbar__li}>
                        <div className={classes.navbar__logo}>
                            <p>
                                <span>D</span>S
                            </p>
                        </div>
                    </li>
                    <li className={classes.navbar__li}>
                        <Link className={classes.navbar__link}>
                            <div className={classes.navbar__icon}>
                                <TasksIcon />
                            </div>
                        </Link>
                    </li>
                    <li className={classes.navbar__li}>
                        <Link to="/" className={classes.navbar__link}>
                            <div className={classes.navbar__icon}>
                                <OrdersIcon />
                            </div>
                        </Link>
                    </li>
                    <li className={classes.navbar__li}>
                        <Link className={classes.navbar__link}>
                            <div className={classes.navbar__icon}>
                                <PaymentsIcon />
                            </div>
                        </Link>
                    </li>
                    <li className={classes.navbar__li}>
                        <Link to="clients" className={classes.navbar__link}>
                            <div className={classes.navbar__icon}>
                                <ClientsIcon />
                            </div>
                        </Link>
                    </li>
                    <li className={classes.navbar__li}>
                        <Link className={classes.navbar__link}>
                            <div className={classes.navbar__icon}>
                                <StorageIcon />
                            </div>
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default Navbar;
