import React from 'react'
import { Outlet } from 'react-router-dom'
import { MainNavbar } from '../Component/MainNavbar'
import "../Styles/Home_page_ui.css"
import FooterWeb from '../Component/FooterWeb'
import ScrollToTop from '../Component/ScrollToTop'
import ParticleBackground from '../Component/ParticleBackground'

function Main() {
  return (
   <>
    <ScrollToTop />
    <ParticleBackground />
    <MainNavbar/>
    <main className="main_content_wrapper">
        <Outlet/>
    </main>
    <FooterWeb />
   </>
  )
}

export default Main