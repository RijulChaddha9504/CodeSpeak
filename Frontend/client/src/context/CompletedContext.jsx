import { useContext, useState, createContext } from 'react'; 

const CompletedContext = createContext();

export const CompletedProvider = ({ children }) => { 
  const [completed, setCompleted] = useState(false); 

  return (
    <CompletedContext.Provider value={{completed, setCompleted }}>
      {children}
    </CompletedContext.Provider>
  )
}

export const useCompleted = () => {
  const context = useContext(CompletedContext); 
  if (context === undefined) { 
    throw new Error('useCompleted must be used within a CompletedProvider');
  }
  return context; 
}