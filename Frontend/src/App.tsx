import { BrowserRouter as Router, Routes, Route } from "react-router";
import Navbar from "./components/Navbar";
import Homepage from "./pages/Homepage";
import Landingpage from "./pages/Landingpage";

const App = () => {
   return (
      <Router>
         <div className="app">
            <Navbar></Navbar>
            <Routes>
               <Route path="/" element={<Landingpage />} />
               <Route path="/Home" element={<Homepage/>} />
            </Routes>
         </div>
      </Router>
   );
};

export default App;
