import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Login from "./Screens/Login";
import Home from "./Screens/Home";
import Settings from "./Screens/Settings";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Photos from "./Screens/Photos";


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <div>
    <BrowserRouter>
      <Routes>
        <Route path={'/'} element={<Login/>}/>
        <Route path={'photos'} element={<Photos/>}/>
        <Route path={'home'} element={<Home/>}/>
        <Route path={'settings'} element={<Settings/>}/>
      </Routes>
    </BrowserRouter>
    <ToastContainer />
  </div>

);
