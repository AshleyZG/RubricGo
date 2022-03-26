import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ClusterApp } from './ClusterApp';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
// import { Page1, Page2, Page3 } from './Test';
function ContentRouter(){
  return (
    <Router>
    <Routes>
      <Route path="" element={<App/>}></Route>
      <Route path="cluster" element={<ClusterApp/>}></Route>
      <Route path="/debug" element={<div />}></Route>
      {/* <Route path='p1' element={<Page1/>}></Route>
      <Route path='p2' element={<Page2/>}></Route>
      <Route path='p3' element={<Page3/>}></Route> */}
    </Routes>
  </Router>
  )
}

function Sidebar(){
  return (<div>
    <h1>Sidebar</h1>
  </div>)
}

function Layout(){
  return (<div>
    <Sidebar/>
    <ContentRouter/>
  </div>)
}

ReactDOM.render(
  <React.StrictMode>
    <Layout />
  </React.StrictMode>,

  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
