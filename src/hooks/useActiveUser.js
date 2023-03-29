import React from "react";
import { getUserByUserId } from"../services/firebase"

function useActiveUser(id){
    
    const [activeUser,setActiveUser] = React.useState(null);
    
    React.useEffect(()=>{
        async function getUserDataById(id){
            const [response] = await getUserByUserId(id);
            setActiveUser(response);
        }
        if(id){
            getUserDataById(id);
        }
    },[id]);
    return {activeUserData:activeUser}
}
export default useActiveUser;