import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './styles/globals.scss';
import App from './App';
import UserContextProvider from './context/user';
import BillContextProvider from './context/bill';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <UserContextProvider>
      <BillContextProvider>
        <App />
      </BillContextProvider>
    </UserContextProvider>
  </React.StrictMode>
);
