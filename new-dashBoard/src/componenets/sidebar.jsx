import React from 'react'
import { useState } from 'react'
import { MdHomeMax } from "react-icons/md"
import { IoMenu } from "react-icons/io5";
import { MdSpaceDashboard } from "react-icons/md";
import { FaMap } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { FiLogOut } from "react-icons/fi";
import { Link } from "react-router-dom";

import './sidebar.css'


function Sidebar() {
const [show, setShow] = React.useState(false);
  return (
     

      <div className={show?'sidebar1':'sidebar'}>
            
            <div className='sidebar-items'>
                 <div className='sidebar-menu' >
                      {show? <><RxCross2 onClick={()=>{setShow(!show)}}/> <h6>Welcome</h6></> :<IoMenu onClick={()=>{setShow(!show)}}/>}
                  </div>

                  <Link to="/"><div className='sidebar-icons'>
                  <MdSpaceDashboard />
                 {show?<span className='sidebar-icon-text'>Dashboard</span>:""}
                  </div>
                  </Link>
                  <Link to="/Home"> <div className='sidebar-icons'>
                        <MdHomeMax/>
                        {show?<span className='sidebar-icon-text'>Home</span>:""} 
                  </div>

                  </Link>
                  <Link to="/map">
                  <div className='sidebar-icons' title='view on map'>
                       <FaMap />
                        {show?<span className='sidebar-icon-text'>Map</span>:""}
                  </div>
                  </Link>
          
                  <div className='logout-btn'>
                  <FiLogOut />
                  {show?<span className='sidebar-icon-text'>Logout</span>:""}
                  </div>
            </div>
           
        </div>
        
       
      
  )
}

export default Sidebar
