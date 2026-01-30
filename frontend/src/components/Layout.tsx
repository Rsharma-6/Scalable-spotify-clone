import React, { type ReactNode } from 'react'
import Sidebar from './Sidebar.tsx'
import Navbar from './Navbar.tsx'
import Player from './Player.tsx'

interface LayoutProps {
  children: ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className='h-screen'>
      <div className='h-[90%] flex'>
        <Sidebar />
        <div className='w-[100%] m-2 px-6 pt-4 rounded-xl bg-[#1c1a1a] text-white overflow-auto lg:w-[75%] lg:ml-0'>
          <Navbar />
          {children}
        </div>
      </div>
      <Player/>
    </div>
  )
}

export default Layout
