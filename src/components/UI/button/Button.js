import React from "react";
import classes from "./Button.module.scss";
const Button = ({ children, color, ...props }) => {
    console.log(props);
    return (
        <button
            {...props}
            className={`${classes.button} ${color === "white" ? classes.whiteButton : color === "blue" ? classes.blueButton : classes.blackButton} 
            ${props.disabled && classes.disabled} ${props.active && classes.active}`}>
            <p className={classes.buttonText}>{children}</p>
        </button>
    );
};

export default Button;
