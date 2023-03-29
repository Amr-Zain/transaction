import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import App from './App';
import FirebaseContext from './contexts/firebase';
import { FieldValue ,auth } from "./lib/firebase";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <> 
    <FirebaseContext.Provider value={ { FieldValue ,auth} }>
      <App />
    </FirebaseContext.Provider>
  </>
);


