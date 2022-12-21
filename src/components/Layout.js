import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./header/Header";
import Navbar from "./navbar/Navbar";

const Layout = () => {
    return (
        <div className="wrapper">
            <header className="header">
                <Header />
            </header>
            <Navbar />
            <main className="main">
                <Outlet />
            </main>
            <footer className="footer">footer</footer>
        </div>
    );
};

export default Layout;
