import React from 'react'
import { Button } from './ui/button'

const Footer = () => {
  return (
    <div className='my-auto text-center bg-repeat p-2 relative' style={{backgroundImage:"url('grass.svg')",backgroundSize:"64px 64px"}}>
        <img src="ParrotVibe.gif" alt="" className='mx-auto absolute left-0 right-0 size-16 bottom-9/10' />
        <p>Created By Sagar Shinde <a className='hover:underline' href="https://github.com/TrickyNoodle">@TrickyNoodle</a></p>
    </div>
  )
}

export default Footer