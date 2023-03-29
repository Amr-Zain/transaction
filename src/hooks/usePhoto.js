import React from "react";
import { getFollowingPhotos } from '../services/firebase'
function usePhoto(userId,following){
    const [photos , setPhotos] = React.useState([]);
    
    React.useEffect(()=>{
        async function getPhotos(){
            const respose = await getFollowingPhotos(userId,following)
            setPhotos(respose);
        }

        if(userId && following.length >0){
            getPhotos();
        }
    },[userId,following]);
    
    return photos;
}
export default usePhoto;