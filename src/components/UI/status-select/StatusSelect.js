import React from "react";
import classes from "./StatusSelect.module.scss";
const StatusSelect = () => {
    return (
        <select className={classes.select} onClick={(e) => e.stopPropagation()}>
            <option className={classes.option}>До діагностики</option>
            <option>Згода на ремонт</option>
            <option>Відставка</option>
            <option>В ремонті</option>
            <option>Чекаємо на запчастини</option>
            <option>Післяремонтні випробування</option>
            <option>До видання</option>
            <option>Отримано без оплати</option>
            <option>Завершено</option>
            <option>Відпущено без ремонту</option>
        </select>
    );
};

export default StatusSelect;
