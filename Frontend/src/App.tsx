import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router";
import Navbar from "./components/Navbar";
import Homepage from "./pages/Homepage";
import Landingpage from "./pages/Landingpage";
import "./hideScrollbar.css"
import { PageWrapper } from "./components/PageWrapper";
import { AnimatePresence } from "framer-motion";
const App = () => {
   return (
      <Router>
         <div className="app bg-neutral-900">
            <Navbar></Navbar>
            <AnimatedRoutes/>  
         </div>
      </Router>
   );
};

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes key={location.pathname} location={location}>
        <Route path="/" element={<PageWrapper><Landingpage /></PageWrapper>} />
        <Route path="/Home" element={<PageWrapper>< Homepage/></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  );
}


export default App;
