import { motion } from "framer-motion";

const sectors = [
   {
      title: "Speak Your Code",
      text: "Use your voice to write and explore code in real time.",
      img: "./src/assets/two-men-speaking-data-science.png",
   },
   {
      title: "Visual Grid Editor",
      text: "Navigate code blocks in a clean, structured layout.",
      img: "./src/assets/our-grid-layout.png",
   },
   {
      title: "Inspired by Research",
      text: "Built on ideas from Penn State’s Grid Editor study — reimagined with voice and AI for greater accessibility.",
      img: "./src/assets/original-paper-research.png",
   },
];

const Landingpage = () => {
   return (
      <div className="min-h-screen bg-neutral-900 pt-16">
         <div className="text-center px-6 py-12">
            <p className="text-6xl text-white max-w-6xl mx-auto">
               Code with Voice. Navigate with Clarity.
            </p>
         </div>

         {sectors.map((sector, index) => (
            <div
               key={index}
               className={`flex flex-col md:flex-row ${
                  index % 2 !== 0 ? "md:flex-row-reverse" : ""
               } w-full bg-neutral-${
                  index % 2 === 0 ? "100" : "200"
               } py-12 px-6 items-center`}
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
                  {sector.title === "Inspired by Research" ? (
                     <a
                        href="https://www.psu.edu/news/information-sciences-and-technology/story/new-coding-tool-could-aid-computer-programmers-who-are"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-3xl text-blue-400 font-semibold mb-4 inline-block hover:underline"
                     >
                        {sector.title}
                     </a>
                  ) : (
                     <h2 className="text-3xl text-white font-semibold mb-4">
                        {sector.title}
                     </h2>
                  )}

                  <p className="text-white text-3xl mb-6">{sector.text}</p>
               </div>
            </div>
         ))}
      </div>
   );
};

export default Landingpage;
