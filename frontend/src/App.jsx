import React from "react";
import { Outlet } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Importa o CSS das notificações

import Header from "./components/Header";
import Footer from "./components/Footer";

/**
 * Layout principal com o ToastContainer adicionado
 */
export default function App() {
  return (
    <div className="flex flex-col min-h-screen bg-brand-background">
      <Header />
      
      {/* O Container fica aqui, invisível até ser chamado */}
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}