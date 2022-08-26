import {Routes, Route } from 'react-router-dom';

import Header from './Components/Header/Header'
import Connect from './Pages/Connect/Connect';
import Home from './Pages/Home/Home';

import './App.module.scss'
import LogOut from './Pages/LogOut/LogOut';

function App() {

  return (
    <>
      <Header />
      <Routes>
        <Route path='/' element={<Connect />} />
        <Route path='/myprofile' element={''} />
        <Route path='/home' element={<Home />} />
        <Route path='/logout' element={<LogOut />} />
      </Routes>
    </>
  )
}

export default App
