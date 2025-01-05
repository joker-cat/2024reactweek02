// import { StrictMode } from 'react' //嚴格模式引用
import { createRoot } from 'react-dom/client'
import './assets/scss/all.scss'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  // <StrictMode> //嚴格模式
    <App />
  // </StrictMode>,
)

/*
  在 React 18 中，React 的嚴格模式（Strict Mode）
  會導致某些函數在開發模式下被調用兩次，
  以幫助開發者識別和修復潛在的問題。
  這可能是你看到 console.log(baseUrl) 重複印出的原因。

  嚴格模式的這種行為只會在開發模式下發生，
  不會影響生產環境。
  你可以通過檢查你的 React 應用是否在嚴格模式下運行來確認這一點。

  以下是如何檢查和移除嚴格模式：

  檢查 index.jsx 或 index.js 文件： 
  檢查你的應用是否在嚴格模式下運行。
  通常，這是在 index.jsx 或 index.js 文件中設置的。
*/ 
