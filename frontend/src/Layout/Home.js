import React from 'react'
import Login from '../Pages/User/Login'
import ScrollToTop from '../Component/ScrollToTop'

function Home() {
  return (
    <div>
      <ScrollToTop />
      <Login/>
    </div>
  )
}

export default Home