import { collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import classes from "./Clients.module.scss";
import { v4 } from "uuid";
import { Link } from "react-router-dom";
import Button from "../../components/UI/button/Button";
import useInput from "../../hooks/useInput";
import Search from "../../components/UI/search/Search";
import Loader from "../../components/loader/Loader";

const Clients = () => {
    const [clients, setClients] = useState([]);

    const search = useInput("");

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

    const filterClients = () => {
        const filteredClients = clients.filter((item) => {
            const clientInfo = Object.values(item).join("");
            if (clientInfo.toLowerCase().includes(search.value.toLowerCase())) return item;
        });
        return filteredClients;
    };

    const filteredClients = filterClients();
    return (
        <div className={classes.clients}>
            <div className={classes.clients__content}>
                <div className={classes.clients__actions}>
                    <div className={classes.actions__search}>
                        <Search value={search.value} onChange={(e) => search.onChange(e)} />
                    </div>
                    <div className={classes.actions__buttons}>
                        <div className={classes.button}>
                            <Link to="/order/create-order">
                                <Button color="blue">Create order</Button>
                            </Link>
                        </div>
                    </div>
                </div>
                <div className={classes.clients__body}>
                    <table className={classes.table}>
                        <thead className={classes.table__header}>
                            <tr className={classes.table__row}>
                                <th className={classes.table__item}>Ім'я</th>
                                <th className={classes.table__item}>Телефон</th>
                                <th className={classes.table__item}>Email</th>
                                <th className={classes.table__item}>Address</th>
                            </tr>
                        </thead>
                        <tbody className={classes.table__body}>
                            {filteredClients.length ? (
                                filteredClients.map((client) => {
                                    return (
                                        <tr key={v4()} className={classes.table__row}>
                                            <td className={classes.table__item}>{client.clientName}</td>
                                            <td className={classes.table__item}>{client.clientPhone}</td>
                                            <td className={classes.table__item}>{client.clientEmail}</td>
                                            <td className={classes.table__item}>{client.clientAddress}</td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td>
                                        <Loader />
                                    </td>
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
