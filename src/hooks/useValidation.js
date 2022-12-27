import React, { useEffect, useState } from "react";

const useValidation = (value, validations) => {
    const [isEmpty, setEmpty] = useState(true);
    const [minLengthError, setMinLengthError] = useState(false);
    const [lengthError, setLengthError] = useState(false);
    useEffect(() => {
        for (const validation in validations) {
            switch (validation) {
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

    return {
        isEmpty,
        lengthError,
        minLengthError,
    };
};

export default useValidation;
