import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ClusterApp } from './ClusterApp';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';

ReactDOM.render(
  // <React.StrictMode>
  //   <App />
  // </React.StrictMode>,

  <Router>
    <Routes>
      <Route path="" element={<App/>}></Route>
      <Route path="cluster" element={<ClusterApp/>}></Route>
      <Route path="/debug" element={<div />}></Route>
    </Routes>
  </Router>,

  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
