import React from 'react';
import * as ReactDOM from 'react-dom/client';
import {BrowserRouter} from "react-router-dom";
import './index.css';
import App from './pages/App';
import reportWebVitals from './reportWebVitals';

export default App

ReactDOM.hydrateRoot(
    document.getElementById('root') as HTMLElement,
    <React.StrictMode>
        <BrowserRouter basename={"react-18"}>
            <App/>
        </BrowserRouter>
    </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
