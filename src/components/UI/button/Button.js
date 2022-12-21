import React from "react";
import classes from "./Button.module.scss";
const Button = ({ children, color, ...props }) => {
    return (
        <button
            {...props}
            className={`${classes.button} ${color === "white" ? classes.whiteButton : color === "blue" ? classes.blueButton : classes.blackButton} ${
                props.valid !== undefined && props.valid === "false" && classes.disabled
            } `}>
            <p className={classes.buttonText}>{children}</p>
        </button>
    );
};

export default Button;
