import React from 'react';
import logo from './logo.svg';
import './App.css';

function MainMenu (): JSX.Element {
    return      <div id="main-menu">
    <div className='main-menu-item'>
      <p>Clustering Submissions</p>
    </div>
    <div className='main-menu-item'>
      <p>Check {"&"} Regrade</p>
    </div>
  </div>
}

export  {MainMenu};
