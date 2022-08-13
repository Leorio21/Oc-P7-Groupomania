import {Routes, Route } from 'react-router-dom';

import Header from './Components/Header/Header'
import Connect from './Container/Connect/Connect';

import './App.module.scss'

function App() {

  return (
    <>
    <Header />
    <Routes>
      <Route path='/' element={<Connect />} />
      <Route path='/profile' element={''} />
      <Route path='/posts' element={''} />
    </Routes>
    </>
  )
}

export default App
