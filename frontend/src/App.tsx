import {Routes, Route } from 'react-router-dom';

import Header from './Components/Header/Header'
import Connect from './Pages/Connect/Connect';
import Home from './Pages/Home/Home';

import { AuthContext } from './Context/AuthContext';

import './App.module.scss'
import { useContext } from 'react';
import NavBar from './Components/NavBar/NavBar';

function App() {

  const authContext = useContext(AuthContext)

  return (
    <>
      <Header />
      {authContext!.connected && <NavBar />}
      <Routes>
        <Route path='/' element={<Connect />} />
        <Route path='/myprofile' element={''} />
        <Route path='/home' element={<Home />} />
      </Routes>
    </>
  )
}

export default App
