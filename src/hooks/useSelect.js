import React, { useState } from "react";

const useSelect = (data) => {
    const [value, setValue] = useState(data.defaultValue);

    const onChange = (e) => {
        setValue(e.target.value);
    };
    return { value, onChange, options: data.options };
};

export default useSelect;
