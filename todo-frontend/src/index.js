/* 
First JS module that contains the React component that replaces the element with ID root 
in the index.html file
*/

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import reducer from './Store/Reducer';
import axios from 'axios';

//sets base URL for APIs
axios.defaults.baseURL = "http://127.0.0.1:8000/api/";

//creating a root store for maintaining a central state
const store = createStore(reducer);

ReactDOM.render(
  <React.StrictMode>
    {/* below store = {store} will make store accessible to all the sub components of <Provider /> */}
    <Provider store = {store} > 
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
