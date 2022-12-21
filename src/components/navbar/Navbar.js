import React from "react";
import { Link } from "react-router-dom";
import classes from "./Navbar.module.scss";
const Navbar = () => {
    return (
        <div className={classes.navbar}>
            <div className="container">
                <ul className={classes.navbar__list}>
                    <li className={classes.navbar__li}>
                        <div className={classes.navbar__logo}>logo</div>
                    </li>
                    <li className={classes.navbar__li}>
                        <Link className={classes.navbar__link}>Завдання</Link>
                    </li>
                    <li className={classes.navbar__li}>
                        <Link to="/" className={classes.navbar__link}>
                            Замовлення
                        </Link>
                    </li>
                    <li className={classes.navbar__li}>
                        <Link className={classes.navbar__link}>Платежі</Link>
                    </li>
                    <li className={classes.navbar__li}>
                        <Link to="clients" className={classes.navbar__link}>
                            Клієнти
                        </Link>
                    </li>
                    <li className={classes.navbar__li}>
                        <Link className={classes.navbar__link}>Склад</Link>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default Navbar;
