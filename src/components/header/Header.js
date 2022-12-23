import React from "react";
import classes from "./Header.module.scss";
const Header = () => {
    return (
        <div className={classes.header}>
            <div className="container">
                <div className={classes.header__content}>
                    <div className={classes.header__info}>
                        <h1 className={classes.header__title}>Header</h1>
                    </div>
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
