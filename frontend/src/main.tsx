import ReactDOM from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import { createStore } from 'redux'

import App from './App'
import './index.scss'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <BrowserRouter>
        <App />
    </BrowserRouter>
)
