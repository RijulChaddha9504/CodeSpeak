import React from 'react'
import { motion } from "framer-motion";


const sectors = [
  {
    title: "Coding Made Accessible",
    text: "Coding made available for the visually impaired",
    img: "https://placehold.co/600x400",
  },
  {
    title: "Create",
    text: "Code with the assistance of your voice",
    img: "https://placehold.co/600x400",
  },
  {
    title: "Live Feedback",
    text: "Receive live feedback on changes made, suggestions, and corrections",
    img: "https://placehold.co/600x400",
  },

];

const Landingpage = () => {
  return (
    <div className="min-h-screen bg-neutral-900 pt-16">
      <div className="text-center px-6 py-12">

        <p className="text-6xl text-white max-w-6xl mx-auto">
          Your Journey Of Programming Starts Here
        </p>
      </div>

      {sectors.map((sector, index) => (
        <div
          key={index}
          className={`flex flex-col md:flex-row ${index % 2 !== 0 ? "md:flex-row-reverse" : ""} w-full bg-neutral-${index % 2 === 0 ? "100" : "200"} py-12 px-6 items-center`}
        >
          <motion.img
            src={sector.img}
            alt={sector.title}
            className="w-full md:w-1/2 h-64 object-cover rounded-xl shadow-md"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          />

          <div className="w-full md:w-1/2 mt-6 md:mt-0 md:px-12 text-left">
            <h2 className="text-3xl text-white font-semibold mb-4">{sector.title}</h2>
            <p className="text-white mb-6">{sector.text}</p>
            <button className="bg-blue-600 text-white px-5 py-2 rounded-xl hover:bg-blue-700 transition">
              Learn More
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Landingpage