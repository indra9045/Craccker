import React, { createContext, useState } from "react";

const UserContext = createContext()

export const UserProvider = ({ children }) => {
    const [userName, setUserName] = useState(null)
    const [userEmail,setUserEmail]=useState(null)

    const setUserN = (name) => {
        setUserName(name)
        
    }
    const setUserE=(email)=>{
        setUserEmail(email)
    }
    console.log("data from context",{userName,userEmail})
    return(
        <UserContext.Provider value={{userName,userEmail,setUserE,setUserN}}>
            {children}
        </UserContext.Provider>
    )
}
 export default UserContext;