import { collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import classes from "./Clients.module.scss";
import { v4 } from "uuid";
const Clients = () => {
    const [clients, setClients] = useState([]);
    useEffect(() => {
        const getClients = async () => {
            const clientRef = collection(db, "clients");
            const snapshots = await getDocs(clientRef);
            const clientData = snapshots.docs.map((doc) => {
                const data = doc.data();
                return data;
            });
            setClients(clientData);
        };
        getClients();
    }, []);
    console.log(clients);
    return (
        <div className={classes.clients}>
            <div className={classes.clients__content}>
                <div className={classes.clients__header}></div>
                <div className={classes.clients__body}>
                    <table className={classes.table}>
                        <thead className={classes.table__header}>
                            <tr className={classes.table__row}>
                                <th className={classes.table__item}>Ім'я</th>
                                <th className={classes.table__item}>Телефон</th>
                                <th className={classes.table__item}>Пошта</th>
                                <th className={classes.table__item}>Адреса</th>
                            </tr>
                        </thead>
                        <tbody className={classes.table__body}>
                            {clients.length ? (
                                clients.map((client) => {
                                    return (
                                        <tr key={v4} className={classes.table__row}>
                                            <td className={classes.table__item}>{client.clientName}</td>
                                            <td className={classes.table__item}>{client.clientPhone}</td>
                                            <td className={classes.table__item}>{client.clientEmail}</td>
                                            <td className={classes.table__item}>{client.clientAddress}</td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td>loading</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Clients;
