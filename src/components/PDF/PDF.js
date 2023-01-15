import React, { useRef } from "react";
import classes from "./PDF.module.scss";
import { PDFExport } from "@progress/kendo-react-pdf";
import { useLocation } from "react-router-dom";
import Button from "../UI/button/Button";

const PDF = () => {
    const location = useLocation();
    const { orderData } = location.state;

    const pdfExportComponent = useRef(null);
    const handleClick = (e) => {
        e.preventDefault();
        pdfExportComponent.current.save();
    };

    const { clientInfo, deviceInfo, orderInfo } = orderData;

    return (
        <div className={classes.body}>
            <div className={classes.pdf}>
                <PDFExport ref={pdfExportComponent} paperSize="A4">
                    <div className={classes.container}>
                        <div className={classes.body}>
                            <div className={classes.header}>
                                <div className={classes.title}>
                                    <h1>Potwierdzenie przyjęcia sprzętu</h1>
                                    <p>
                                        Zlecenie <span># {orderData.id}</span> dnia <span>{orderInfo.orderDate}</span>
                                    </p>
                                </div>
                                <div className={classes.serviceInfo}>
                                    <p>
                                        <span>DIGITAL SERWIS</span>
                                    </p>
                                    <p>ul. Nieszawska 3d</p>
                                    <p>03-382 Warszawa</p>
                                    <p>
                                        <span>tel. 733 555 033</span>
                                    </p>
                                    <p>info@digitalserwis.pl</p>
                                </div>
                                <div className={classes.logo}>
                                    <img src={require("../../assets/logo.jpg")} />
                                </div>
                            </div>
                            <table className={classes.table}>
                                <tbody>
                                    <tr className={classes.table__row}>
                                        <th className={classes.table__title}>Dane klienta</th>
                                        <td className={classes.table__text}>{`${clientInfo.clientName}, ${clientInfo.clientPhone}`}</td>
                                    </tr>
                                    <tr className={classes.table__row}>
                                        <th className={classes.table__title}>Urządzenie</th>
                                        <td
                                            className={
                                                classes.table__text
                                            }>{`${deviceInfo.deviceType}: ${deviceInfo.deviceProducer} ${deviceInfo.deviceModel}`}</td>
                                    </tr>
                                    <tr className={classes.table__row}>
                                        <th className={classes.table__title}>Stan</th>
                                        <td className={classes.table__text}>{deviceInfo.deviceState}</td>
                                    </tr>
                                    <tr className={classes.table__row}>
                                        <th className={classes.table__title}>Akcesoria</th>
                                        <td className={classes.table__text}>{deviceInfo.deviceAccessories}</td>
                                    </tr>
                                    <tr className={classes.table__row}>
                                        <th className={classes.table__title}>Usterka</th>
                                        <td className={classes.table__text}>{deviceInfo.deviceBreakage}</td>
                                    </tr>
                                </tbody>
                            </table>
                            <div className={classes.serviceRules}>
                                <h2 className={classes.serviceRules__title}>Regulamin serwisu:</h2>
                                <ol className={classes.serviceRules__list}>
                                    <li className={classes.serviceRules__text}>
                                        Podczas przyjmowania urządzeń do serwisu zostaje wydany dowód przyjęcia w dwóch egzemplarzach
                                    </li>
                                    <li className={classes.serviceRules__text}>
                                        Serwis nie ponosi winy za utratę danych lub oprogramowania i dokonuje archiwizacji tylko na wyraźną prośbę
                                        klienta.
                                    </li>
                                    <li className={classes.serviceRules__text}>
                                        Sprzęt zostanie zdiagnozowany tylko pod kątem usterki podanej przez klienta
                                    </li>
                                    <li className={classes.serviceRules__text}>
                                        Serwis nie odpowiada za legalność oprogramowania i danych zawartych na nośnikach dostarczonych przez klienta
                                        do serwisu
                                    </li>
                                    <li className={classes.serviceRules__text}>
                                        Czas naprawy płatnej oraz gwarancyjnej wynosi od 1 do 14 dni roboczych od chwili zaakceptowana przez klienta
                                        kosztów usługi serwisowej. Czas ten może ulec wydłużeniu na skutek zmiennej dostępności części, niezależnej od
                                        serwisu. Czas naprawy może również uleć zmianie w wyniku wykrycia przez serwis zatajonych informacji o
                                        zalaniu, ingerencji osób postronnych lub innych przyczyn komplikujących naprawę.
                                    </li>
                                    <li className={classes.serviceRules__text}>
                                        Serwis zastrzega sobie prawo zwrotu klientowi nienaprawionego sprzętu w przypadku braku dostępnych części lub
                                        wystąpienia innych czynników niezależnych od serwisu.
                                    </li>
                                    <li className={classes.serviceRules__text}>
                                        W przypadku naprawy płatnej, jeżeli nie uzgodniono inaczej, wymieniony element zostanie zutylizowany przez
                                        serwis.
                                    </li>
                                    <li className={classes.serviceRules__text}>
                                        W przypadku nieodebrania przez klienta sprzętu po 30 dniach od wykonania naprawy, naliczana jest opłata
                                        magazynowa w wysokości 5zł brutto za każdy dzień. Po upływie 60 dni nieodebrany sprzęt ulega przepadkowi i
                                        jest uznawany jako porzucony przez właściciela w rozumieniu Art, 180 Kodeksu Cywilnego oraz na podstawie Art.
                                        181 Kodeksu Cywilnego.
                                    </li>
                                    <li className={classes.serviceRules__text}>
                                        Wycena każdego zlecenia zostaje określona indywidualnie po rozpoznaniu usterki. W przypadku rezygnacji z
                                        naprawy po przyjęciu sprzętu do serwisu klient nie zostanie obciążony kosztem diagnozy. W przypadku rezygnacji
                                        z naprawy po uzgodnieniu kosztów i potrzebnych części, klient zostanie obciążony kosztem dotychczasowego
                                        postępowania oraz zamówionych lub zakupionych części. Po zaakceptowaniu kosztów usługi niniejsze zlecenie
                                        naprawy stanowi umowę o dzieło na wykonanie tej naprawy.
                                    </li>
                                    <li className={classes.serviceRules__text}>
                                        Dowód przyjęcia sprzętu jest jedynym dokumentem pozwalającym na odbiór sprzętu z serwisu.
                                    </li>
                                    <li className={classes.serviceRules__text}>
                                        Warunkiem rozpatrzenia reklamacji są nienaruszone plomby gwarancyjne. Ślady uszkodzeń mechanicznych,
                                        chemicznych, termicznych itp. dyskwalifikują sprzęt z naprawy gwarancyjnej udzielonej przez serwis. Klient
                                        dostarcza osobiście lub pokrywa koszt transportu sprzętu do serwisu.
                                    </li>
                                    <li className={classes.serviceRules__text}>
                                        Klient wyraża zgodę na przetwarzanie danych osobowych zgodnie z Ustawą z dn. 29.08.1997 Dz.U. Nr 02.101.926
                                    </li>
                                    <li className={classes.serviceRules__text}>
                                        Każdy klient oddający sprzęt do serwisu jest zobowiązany do zapoznania się niniejszym regulaminem. Oddając
                                        sprzęt do naprawy klient dobrowolnie akceptuje powyższe postanowienia. Regulamin jest zarazem umową, na
                                        podstawie której świadczona jest usługa naprawy i reguluje prawa i obowiązki wynikające z tego tytułu.
                                        Wszelkie inne postanowienia muszą być przedstawione w formie pisemnej i zaakceptowane przez obie strony
                                    </li>
                                </ol>
                            </div>

                            <div className={classes.signature}>
                                <div className={classes.signature__column + " " + classes.signature__column_left}>
                                    <p className={classes.signature__text}>Potwierdzam przyjęcie sprzętu</p>
                                    <p className={classes.signature__text}>
                                        <span>Data</span>: {orderInfo.orderDate}
                                    </p>
                                </div>
                                <div className={classes.signature__column + " " + classes.signature__column_right}>
                                    <p className={classes.signature__text}>Akceptuje regulamin serwisu</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </PDFExport>
            </div>
            <div className={classes.button}>
                <Button color="blue" onClick={handleClick}>
                    Create PDF
                </Button>
            </div>
        </div>
    );
};

export default PDF;
