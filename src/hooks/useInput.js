import { useState } from "react";
import useValidation from "./useValidation";

const useInput = (initialValue, validations) => {
    const [value, setValue] = useState(initialValue);
    const [isDirty, setDirty] = useState(false);
    const valid = useValidation(value, validations);
    const [isFocused, setFocus] = useState(false);

    const onChange = (e) => {
        setValue(e.target.value);
    };

    const onFocus = () => {
        setFocus(true);
    };

    const onBlur = () => {
        setDirty(true);
        setFocus(false);
    };

    const clear = () => {
        setValue("");
    };
    return {
        value,
        isDirty,
        isFocused,
        onChange,
        onFocus,
        onBlur,
        clear,
        setValue,
        ...valid,
    };
};

export default useInput;
