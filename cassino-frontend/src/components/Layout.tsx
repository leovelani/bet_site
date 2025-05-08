import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import "./Layout.css"; // CERTIFIQUE-SE QUE ESTE ARQUIVO EXISTE E ESTÁ SENDO IMPORTADO

const Layout: React.FC = () => {
  const location = useLocation();
  const hideNavbarRoutes = ["/"]; // Rotas onde o Navbar não deve aparecer
  const showNavbar = !hideNavbarRoutes.includes(location.pathname);

  return (
    <>
      {showNavbar && <Navbar />}
      {/* Aplica a classe CSS correta ao <main> */}
      <main className={showNavbar ? "main-content-with-navbar" : "main-content-no-navbar"}>
        <Outlet />
      </main>
    </>
  );
};

export default Layout;