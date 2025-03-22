import { BrowserRouter as Router, Routes, Route } from "react-router";
import Navbar from "./components/Navbar";
import Homepage from "./pages/Homepage";

const App = () => {
  return (
    <Router>
      <div className="app">
        <Navbar></Navbar>
        <Routes>
          <Route path="/" element={<Homepage />} />

        </Routes>
      </div>
    </Router>
  )
}

export default App