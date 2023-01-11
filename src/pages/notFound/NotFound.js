import React from "react";
import Button from "../../components/UI/button/Button";
import classes from "./NotFound.module.scss";
import { Link } from "react-router-dom";
const NotFound = () => {
    return (
        <div className={classes.notFound}>
            <div className={classes.content}>
                <h1 className={classes.title}>OOPS... PAGE NOT FOUND</h1>
                <div className={classes.button}>
                    <Link to="orders">
                        <Button color="blue">Return to orders</Button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
