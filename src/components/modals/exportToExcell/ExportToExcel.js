import { collection, getDocs } from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import { useDownloadExcel } from "react-export-table-to-excel";
import { db } from "../../../firebase";
import Button from "../../UI/button/Button";
import { v4 } from "uuid";
import classes from "./ExportToExcel.module.scss";

const ExportToExcel = () => {
    const [orders, setOrders] = useState([]);

    const tableRef = useRef(null);

    useEffect(() => {
        getOrders();
    }, []);

    const getOrders = async () => {
        const ordersRef = collection(db, "orders");
        const snapshots = await getDocs(ordersRef);
        const ordersData = snapshots.docs.map((doc) => {
            const data = doc.data();
            return data;
        });
        ordersData.sort((a, b) => {
            return b.id - a.id;
        });
        setOrders(ordersData);
    };

    const { onDownload } = useDownloadExcel({
        currentTableRef: tableRef.current,
        filename: "Orders table",
        sheet: "Orders",
    });

    return (
        <div>
            <div className={classes.button}>
                <Button color="blue" onClick={onDownload}>
                    Download All Orders
                </Button>
            </div>
            <table ref={tableRef} className={classes.table}>
                <thead>
                    <tr>
                        <th>Id</th>
                        <td>Date</td>

                        <th>Name</th>
                        <th>Phone</th>
                        <th>Email</th>
                        <th>Address</th>

                        <th>Device Type</th>
                        <th>Producer</th>
                        <th>Model</th>
                        <th>Tech state</th>
                        <th>Breakage</th>
                        <th>IMEI</th>
                        <th>Accessories</th>
                        <th>Password</th>

                        <th>Order type</th>
                        <th>Order accepted</th>
                        <th>Order executor</th>
                        <th>Deadline</th>

                        <th>Payment name</th>
                        <th>Payment accepted</th>
                        <th>Payment executor</th>
                        <th>Repair cost</th>
                        <th>Repair price</th>
                        <th>Repair type</th>
                        <th>Repair guarantee</th>
                        <th>Repair date</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.length
                        ? orders.map((order) => {
                              const { clientInfo, deviceInfo, orderInfo, payment } = order;

                              return (
                                  <tr key={v4()}>
                                      <td>{order.id}</td>
                                      <td>{orderInfo.orderDate}</td>

                                      <td>{clientInfo.clientName}</td>
                                      <td>{clientInfo.clientPhone}</td>
                                      <td>{clientInfo.clientEmail}</td>
                                      <td>{clientInfo.clientAddress}</td>

                                      <td>{deviceInfo.deviceType}</td>
                                      <td>{deviceInfo.deviceProducer}</td>
                                      <td>{deviceInfo.deviceModel}</td>
                                      <td>{deviceInfo.deviceState}</td>
                                      <td>{deviceInfo.deviceBreakage}</td>
                                      <td>{deviceInfo.deviceImeiSn}</td>
                                      <td>{deviceInfo.deviceAccessories}</td>
                                      <td>{deviceInfo.devicePassword}</td>

                                      <td>{orderInfo.orderType}</td>
                                      <td>{orderInfo.orderAccepted}</td>
                                      <td>{orderInfo.orderExecutor}</td>
                                      <td>{orderInfo.orderDeadline}</td>

                                      <td>
                                          {payment.map((item) => (
                                              <div key={v4()}>{item.repairName}</div>
                                          ))}
                                      </td>
                                      <td>
                                          {payment.map((item) => (
                                              <div key={v4()}>{item.paymentAccepted}</div>
                                          ))}
                                      </td>
                                      <td>
                                          {payment.map((item) => (
                                              <div key={v4()}>{item.repairExecutor}</div>
                                          ))}
                                      </td>
                                      <td>
                                          {payment.map((item) => (
                                              <div key={v4()}>{item.repairCost}</div>
                                          ))}
                                      </td>
                                      <td>
                                          {payment.map((item) => (
                                              <div key={v4()}>{item.repairPrice}</div>
                                          ))}
                                      </td>
                                      <td>
                                          {payment.map((item) => (
                                              <div key={v4()}>{item.paymentType}</div>
                                          ))}
                                      </td>
                                      <td>
                                          {payment.map((item) => (
                                              <div key={v4()}>{item.repairGuarantee}</div>
                                          ))}
                                      </td>
                                      <td>
                                          {payment.map((item) => (
                                              <div key={v4()}>{item.date}</div>
                                          ))}
                                      </td>
                                  </tr>
                              );
                          })
                        : null}
                </tbody>
            </table>
        </div>
    );
};

export default ExportToExcel;
