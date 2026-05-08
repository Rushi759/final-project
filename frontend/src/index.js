import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import axios from 'axios';

// Global API Configuration
axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:8080';
axios.defaults.withCredentials = true;

const RootComponent = () => {
    useEffect(() => {
        document.title = "AgroGuru | Empowering Farmers";
        document.documentElement.setAttribute('data-theme', 'dark');
    }, []);

    return <App />;
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <RootComponent />
);

reportWebVitals();
