import React from "react";
import { getAllPostComments } from '../services/firebase'
function useComment(userId,photoDocId,commentsLen){
    const [comments , setComments] = React.useState([]);
    
    React.useEffect(()=>{
        function getPhotos(){
            getAllPostComments(userId,photoDocId,commentsLen).then((respose)=>{
                setComments(respose);
            }).catch(e=>{
                console.log(e);
            })
        }

        if(userId && commentsLen>0){
            getPhotos();
        }
    },[commentsLen]);
    return comments;
}
export default useComment;