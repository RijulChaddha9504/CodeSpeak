import "../index.css"
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-neutral-800 text-white py-4 px-8 fixed top-0 left-0 w-full shadow-lg z-50 flex justify-between items-center">
      <h1 className="text-xl font-bold">Property Tracker</h1>
      <div className="space-x-6">
        <Link to="/" className="text-neutral-400 hover:text-neutral-100 transition">Home</Link>
      </div>
    </nav>
  )
}

export default Navbar;

