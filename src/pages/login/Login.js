import React from "react";
import classes from "./Login.module.scss";
import useInput from "../../hooks/useInput";
import Input from "../../components/UI/input/Input";
import Button from "../../components/UI/button/Button";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
    const email = useInput("", { isEmpty: true, email: true });
    const password = useInput("", { isEmpty: true, minLength: 6 });

    const auth = getAuth();
    const navigate = useNavigate();
    const handleLogin = async (e) => {
        e.preventDefault();
        await signInWithEmailAndPassword(auth, email.value, password.value).then((user) => console.log(user));
        navigate("/orders");
    };
    return (
        <div className={classes.login}>
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
                <div className={classes.button}>
                    <Button disabled={!email.inputValid || !password.inputValid} onClick={handleLogin} color="blue">
                        Login
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default Login;
