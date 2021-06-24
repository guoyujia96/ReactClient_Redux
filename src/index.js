import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { BrowserRouter } from "react-router-dom"
// import memoryUtils from './utils/memoryUtils'
// import storageUtils from './utils/storageUtils'
import { Provider } from "react-redux"
import store from "./redux/store"

// const user = storageUtils.getUser()
// memoryUtils.user = user

// 读取local中保存的user，保存到内存中
ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);
