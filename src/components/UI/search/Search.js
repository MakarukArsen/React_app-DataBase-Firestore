import React from "react";
import SearchIcon from "../../icons/SearchIcon";
import classes from "./Search.module.scss";

const Search = ({ setValue, clear, ...props }) => {
    return (
        <label className={classes.label}>
            <SearchIcon className={classes.icon} />
            <input {...props} className={classes.input} type="search" placeholder="Пошук за ім'ям, телефоном, поштою, адресою"></input>
        </label>
    );
};

export default Search;
