import React from 'react'
import Sidebar from './sidebar'
import Stat from './Stat'
import './test.css'

const Test = () => {
  return (
    <>  
    <div className="app-container">
    
    
    <div className="main-content">
      <div className='header'><h1>Electric Vehicle Analytics Dashboard</h1>
    </div>

     <div className='analytics-container'>

  <Stat/>
  
     </div>


    </div>
    </div>
</>
  )
}

export default Test
