import React from 'react'
import Signup from './pages/Signup'
import Login from './pages/Login'
import { Routes,Route } from 'react-router-dom'

function App() {

  return (
    <div>
      {/* <h1>hello</h1> */}
      <Routes>
        {/* <Route path="/" element={<Home />} /> */}
        <Route path="/Signup" element={<Signup />} />
        <Route path="/Login" element={<Login />} />
      </Routes>
    </div>
    
  )
}

export default App
