import { useState } from 'react'
import './assets/css/style.css'
import Headers from './components/Header'
import Main from './components/Main'
import Footer from './components/Footer'
import{ BrowserRouter, Routes, Route } from 'react-router-dom'
import Register from './components/Register'
import Login from './components/Login'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
        <Headers />
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
        <Footer />  
      </BrowserRouter>
      
  
      
      
    </>
  )
}

export default App
