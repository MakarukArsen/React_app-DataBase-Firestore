import { useEffect, useState } from "react";

const useValidation = (value, validations) => {
    const [isEmpty, setEmpty] = useState(true);
    const [minLengthError, setMinLengthError] = useState(false);
    const [lengthError, setLengthError] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const [inputValid, setInputValid] = useState(false);

    useEffect(() => {
        for (const validation in validations) {
            switch (validation) {
                case "email":
                    const re =
                        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                    !re.test(value) ? setEmailError(true) : setEmailError(false);
                    break;
                case "minLength":
                    value.length < validations[validation] ? setMinLengthError(true) : setMinLengthError(false);
                    break;
                case "length":
                    value.length !== validations[validation] ? setLengthError(true) : setLengthError(false);
                    break;
                case "isEmpty":
                    value ? setEmpty(false) : setEmpty(true);
                    break;
            }
        }
    }, [value]);
    useEffect(() => {
        if (isEmpty || minLengthError || lengthError || emailError) {
            setInputValid(false);
        } else setInputValid(true);
    }, [isEmpty, minLengthError, lengthError, emailError]);
    return {
        isEmpty,
        lengthError,
        minLengthError,
        emailError,
        inputValid,
    };
};

export default useValidation;
