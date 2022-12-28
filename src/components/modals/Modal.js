import React, { useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import classes from "./Modal.module.scss";
const modalRootElement = document.querySelector("#modal");
const Modal = ({ children, isModalActive, onClose }) => {
    const element = useMemo(() => document.createElement("div"), []);

    useEffect(() => {
        modalRootElement.appendChild(element);
        isModalActive ? (document.body.style.overflow = "hidden") : (document.body.style.overflow = "auto");
        return () => {
            modalRootElement.removeChild(element);
            document.body.style.overflow = "auto";
        };
    }, [isModalActive]);

    if (isModalActive) {
        return createPortal(
            <>
                <div onClick={onClose} className={classes.modal__background}></div>
                <div className={classes.modal__content}>{children}</div>
            </>,
            element
        );
    }
    return null;
};

export default Modal;
