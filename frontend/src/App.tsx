import {Routes, Route } from 'react-router-dom';

import Header from './Components/Header/Header'
import Connect from './Pages/Connect/Connect';
import Home from './Pages/Home/Home';

import './App.module.scss'

function App() {

  return (
    <>
    <Header />
    <Routes>
      <Route path='/' element={<Connect />} />
      <Route path='/profile' element={''} />
      <Route path='/posts' element={<Home />} />
    </Routes>
    </>
  )
}

export default App
