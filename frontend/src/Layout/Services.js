import React from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { MainNavbar } from '../Component/MainNavbar'
import FooterWeb from '../Component/FooterWeb'
import ScrollToTop from '../Component/ScrollToTop'
import '../Styles/services_layout.css'
const Services = () => {
  const location = useLocation();

  return (
    <div id="services_layout_wrap" className="full-view-unified">
        <ScrollToTop />
        <MainNavbar />
        
        <main className="services-content-unified">
                <Outlet/>
        </main>
        
        <FooterWeb />
    </div>
  )
}

export default Services