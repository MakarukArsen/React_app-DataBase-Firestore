import React from "react";
import classes from "./AuthModal.module.scss";
import Input from "../../UI/input/Input";
import Button from "../../UI/button/Button";
import { getAuth, signOut } from "firebase/auth";

const AuthModal = () => {
    const auth = getAuth();
    const handleLogOut = async (e) => {
        e.preventDefault();
        await signOut(auth);
    };
    return (
        <div className={classes.modal}>
            <form className={classes.form}>
                <h1 className={classes.title}>Logged in as {auth.currentUser.displayName}</h1>
                <div className={classes.buttons}>
                    <div className={classes.button}>
                        <Button onClick={handleLogOut} color="blue">
                            Logout
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default AuthModal;
