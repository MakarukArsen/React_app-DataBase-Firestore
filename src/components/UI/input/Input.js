import React from "react";
import classes from "./Input.module.scss";
const Input = ({ ...props }) => {
    return <input {...props} autoComplete="new-password" className={classes.input}></input>;
};

export default Input;
