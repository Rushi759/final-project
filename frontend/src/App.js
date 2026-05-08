import React, { useEffect } from 'react';
import './App.css';
import router from './Routers/Router';
import {  RouterProvider} from "react-router-dom";
import { ContextProvider } from './context/agroguru_context';

function App() {
  useEffect(() => {
    const reveal = () => {
      var reveals = document.querySelectorAll(".reveal");
      for (var i = 0; i < reveals.length; i++) {
        var windowHeight = window.innerHeight;
        var elementTop = reveals[i].getBoundingClientRect().top;
        var elementVisible = 150;
        if (elementTop < windowHeight - elementVisible) {
          reveals[i].classList.add("active");
        }
      }
    };
    window.addEventListener("scroll", reveal);
    reveal(); // Initial check
    return () => window.removeEventListener("scroll", reveal);
  }, []);

  return (
    <div className="App">
      <div className="mesh-bg"></div>
      <ContextProvider>
        <RouterProvider router={router}/>
      </ContextProvider>
    </div>
  );
}

export default App;