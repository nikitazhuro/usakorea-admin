import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import App, { Context } from './App';
import { BrowserRouter } from 'react-router-dom';
import User from './store/User';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Context.Provider value={{
    user: new User(),
  }}
  >
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Context.Provider>
);
