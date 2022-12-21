import React from "react";
import classes from "./Clients.module.scss";
const Clients = () => {
    return (
        <div className={classes.clients}>
            <div className={classes.clients__content}>
                <div className={classes.clients__header}></div>
                <div className={classes.clients__body}>
                    <table className={classes.table}>
                        <thead className={classes.table__header}>
                            <tr className={classes.table__row}>
                                <th className={classes.table__item}></th>
                            </tr>
                        </thead>
                        <tbody className={classes.table__body}>
                            <tr className={classes.table__row}>
                                <td className={classes.table__item}></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Clients;
