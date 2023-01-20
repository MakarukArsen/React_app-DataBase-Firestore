import React from "react";
import classes from "./Loader.module.scss";
const Loader = () => {
    return (
        <div className={classes.loader}>
            <div className={classes.spinner}></div>
            <p className={classes.text}>Loading...</p>
        </div>
    );
};

export default Loader;
