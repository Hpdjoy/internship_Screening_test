import React from 'react'
import { useState } from 'react'
import { MdHomeMax } from "react-icons/md"
import { IoMenu } from "react-icons/io5";
import { MdSpaceDashboard } from "react-icons/md";
import { FaMap } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import './sidebar.css'


function Sidebar() {
const [show, setShow] = React.useState(false);
  return (
     

      <div className={show?'sidebar1':'sidebar'}>
            
            <div className='sidebar-items'>
                 <div className='sidebar-menu' >
                      {show? <RxCross2 onClick={()=>{setShow(!show)}}/> :<IoMenu onClick={()=>{setShow(!show)}}/>}
                  </div>

                  <div className='sidebar-icons'>
                  <MdSpaceDashboard />
                 {show?<span className='sidebar-icon-text'>Dashboard</span>:""}
                  </div>
                  <div className='sidebar-icons'>
                        <MdHomeMax/>
                        {show?<span className='sidebar-icon-text'>Home</span>:""} 
                  </div>
                  <div className='sidebar-icons'>
                       <FaMap />
                        {show?<span className='sidebar-icon-text'>Map</span>:""}
                  </div>
            </div>
        </div>
        
       
      
  )
}

export default Sidebar
