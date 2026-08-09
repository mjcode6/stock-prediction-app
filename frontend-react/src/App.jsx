import { useState } from 'react'
import './assets/css/style.css'
import Headers from './components/Header'
import Main from './components/Main'
import Footer from './components/Footer'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Headers />
      <Main />
      <Footer />   
    </>
  )
}

export default App
