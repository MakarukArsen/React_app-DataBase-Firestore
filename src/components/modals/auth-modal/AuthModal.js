import React from "react";
import classes from "./AuthModal.module.scss";
import useInput from "../../../hooks/useInput";
import Input from "../../UI/input/Input";
import Button from "../../UI/button/Button";
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";

const AuthModal = () => {
    const email = useInput("", { isEmpty: true, email: true });
    const password = useInput("", { isEmpty: true, minLength: 6 });

    const auth = getAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        await signInWithEmailAndPassword(auth, email.value, password.value).then((user) => console.log(user));
    };
    const handleLogOut = async (e) => {
        e.preventDefault();
        await signOut(auth);
    };
    return (
        <div className={classes.modal}>
            <form className={classes.form}>
                <div className={classes.input}>
                    <Input value={email.value} onChange={(e) => email.onChange(e)} onBlur={() => email.onBlur()} placeholder="email" />
                </div>
                <p className={classes.error}>
                    {email.isDirty && email.isEmpty ? "Поле не може бути пустим" : email.isDirty && email.emailError ? "Невірно вказаний email" : ""}
                </p>
                <div className={classes.input}>
                    <Input value={password.value} onChange={(e) => password.onChange(e)} onBlur={() => password.onBlur()} placeholder="password" />
                </div>
                <p className={classes.error}>
                    {password.isDirty && password.isEmpty
                        ? "Поле не може бути пусте"
                        : password.isDirty && password.minLengthError
                        ? "Пароль повинен має містити хоча б 4 символи"
                        : ""}
                </p>
                <div className={classes.buttons}>
                    <div className={classes.button}>
                        <Button onClick={handleLogin} disabled={!email.inputValid || !password.inputValid} color="blue">
                            Login
                        </Button>
                    </div>
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
