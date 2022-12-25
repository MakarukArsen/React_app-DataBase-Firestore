import React from "react";
import { v4 } from "uuid";
import classes from "./Select.module.scss";
const Select = ({ value, onChange, options }) => {
    return (
        <select className={classes.select} onChange={onChange} value={value}>
            {options.map((item) => {
                return (
                    <option className={classes.option} key={v4()} value={item}>
                        {item}
                    </option>
                );
            })}
        </select>
    );
};

export default Select;
