import { useState } from 'react'
import Test from './componenets/test'
import './App.css'


function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="app-container">
    <Test/>
    
    </div>
  )
}

export default App
