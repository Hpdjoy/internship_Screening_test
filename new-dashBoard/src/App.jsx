import { useState } from 'react'
import Test from './componenets/test'
import Home from './componenets/Home'
import Map from './componenets/Map'
import { Route, Routes } from 'react-router-dom'
import Sidebar from './componenets/sidebar'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="app-container">
      <Sidebar/>
    <Routes>
      <Route path="/" element={<Test/>} />
      <Route path="/Home" element={<Home/>} />
      <Route path="/map" element={<Map/>} />
    </Routes>
    </div>
  )
}

export default App
