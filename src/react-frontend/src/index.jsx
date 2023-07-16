// import React from 'react';
// import ReactDOM from 'react-dom';

import {createRoot} from 'react-dom/client';

import {BrowserRouter} from 'react-router-dom';
import App from './App';

// ReactDOM.render(
//   <BrowserRouter>
//     <App />
//   </BrowserRouter>,
//   document.getElementById('root')
// );

const container = document.getElementById('ConsultEase-ReactJs-Root');
const root = createRoot(container); // createRoot(container!) if you use TypeScript
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>;

root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
);
