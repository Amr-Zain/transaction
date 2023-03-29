import { FieldValue } from '../lib/firebase';
import { collection, getDocs,query,where,limit,doc,updateDoc,
    arrayUnion, arrayRemove,addDoc,getDoc ,increment,deleteDoc} from 'firebase/firestore';
import { async } from '@firebase/util';



export async function doesUsernameExist(username) {
    
    const usersColl = collection(FieldValue,'users');

    const q = query( usersColl , where('username', '==', username.toLowerCase()) );
    
    const result = await getDocs(q);
    return result.docs.length >0;  
}
export async function getUserByUsername(username) {
    
    const usersColl = collection(FieldValue,'users');

    const q = query( usersColl , where('username', '==', username.toLowerCase()) );
    
    const result = await getDocs(q);
    if(result.docs.length >0){
        return {...result.docs[0].data() ,docId:result.docs[0].id} 
    }else{
        return null;
    }
}

export async function getUserByUserId(userId){
    const usersColl = collection(FieldValue,'users');
    const q = query( usersColl , where('userId','==',userId ));
    const result = await getDocs(q);
    const user = result.docs.map(user=>{return{...user.data(),docId:user.id}})
    return user;
}

export async function getSuggestedProfiles(userId, following) {
        
        const usersColl = collection(FieldValue,'users');
        const q = query( usersColl ,limit(10));
        const result = await getDocs(q);
        const profiles = result.docs?.map((user) => ({
            ...user.data(),
            docId: user.id
            })).filter(data=>data.userId !==userId&&!following.includes(data.userId ));

        return profiles;
}

export async function updateFollowing(
    loggedInUserDocId,
    profileId, 
    isFollowingProfile 
){

    const userProfileDoc = doc(FieldValue, "users", loggedInUserDocId);
    await updateDoc(userProfileDoc, {
        following: isFollowingProfile?
                    arrayRemove(profileId)
                    :
                    arrayUnion(profileId)
    });
}

export async function updateFollowers(
    profileDocId, 
    loggedInUserId, 
    isFollowingProfile 
){
    const suggestedProfileDoc = doc(FieldValue, "users", profileDocId);
    await updateDoc(suggestedProfileDoc, {
        followers: isFollowingProfile?
                    arrayRemove(loggedInUserId)
                    :
                    arrayUnion(loggedInUserId)
    });

}

export async function getFollowingPhotos(userId,following){
    
    const potosColl = collection(FieldValue,'photos');
    const q = query( potosColl , where('userId','in',following ));
    const respose = await getDocs(q);
    
    
    const followingUserphotos = respose.docs.map((photo)=>{
        return{
            ...photo.data(),
            docId:photo.id
            }
    })
    const photos = await Promise.all( followingUserphotos.map(async(photo)=>{
        let didLike = false;
        if (photo.likes.includes(userId)) {
            didLike = true;
        }
        const user = await getUserByUserId(photo.userId);
        const { username,docId:imgUserDocId } = user[0];
        return {...photo , didLike, username,imgUserDocId};
    }));

    return photos;
}

export async function getAllPostComments(userId,imgDocId,commentsLen){
    const commentsColl = collection(FieldValue,'comments');
    const q = query( commentsColl , where('photoDocId','==', imgDocId),limit(commentsLen)); 
    const respose = await getDocs(q);
    const comments = respose.docs.map(comment=>{
        
        return {...comment.data(),docId:comment.id}
    })
    let didLike =false;
    return await Promise.all (comments.map(comment=>{
        if(comment.likes.includes(userId)){
            didLike = true;
        }
        return {...comment,didLike}
    }))
    
}
export async function triggleLike(imgDocId,userId,liked){
    
    const photoDoc = doc(FieldValue, "photos", imgDocId);
    await updateDoc(photoDoc, {
        likes: liked?
                    arrayRemove(userId)
                    :
                    arrayUnion(userId)
    });
}
export async function triggleCommentLike(commentDocId,userId,liked){
    const commentDoc = doc(FieldValue, "comments", commentDocId);
    console.log(commentDocId);
    console.log(userId);
    console.log(liked);
    await updateDoc(commentDoc, {
        likes: liked?
                    arrayRemove(userId)
                    :
                    arrayUnion(userId)
    });
}


export async function createComment(userName,comment,imgDocId){
    const commentsRef = collection(FieldValue,'comments');
                addDoc(commentsRef, {
                    username: userName.toLowerCase(),
                    text:comment,
                    replies: 0,
                    likes: [],
                    photoDocId:imgDocId,
                    dateCreated: Date.now()
                })
    const photoDoc = doc(FieldValue, "photos", imgDocId);
    await updateDoc(photoDoc, {
        comments: increment(1)
    });
}



export async function getReplies(commentDocId,userId,repliesLen){

    const repliesColl = collection(FieldValue,'comments');
    const q = query( repliesColl , where('commentDocId', '==',commentDocId),limit(repliesLen));//but limit 
    const result = await getDocs(q);
    
    return await Promise.all (result.docs.map((reply)=>{
        let didLike =false;
        if (reply.data().likes.includes(userId)) {
            didLike = true;
        }
        return {...reply.data(),didLike,docId:reply.id}
    }))
}
export async function createReply(loggedinUsername,comment,commentRepliedDocId){
    const commentsRef = collection(FieldValue,'comments');
                addDoc(commentsRef, {
                    username: loggedinUsername.toLowerCase(),
                    text:comment,
                    likes: [],
                    commentDocId:commentRepliedDocId,
                    dateCreated: Date.now()
                })

    const commentDoc = doc(FieldValue, "comments", commentRepliedDocId);
    await updateDoc(commentDoc, {
        replies: increment(1)
    });
}
export async function getProfilPhotos(userId){
    
    const potosColl = collection(FieldValue,'photos');
    const q = query( potosColl , where('userId','==', userId ));
    const respose = await getDocs(q);
    
    
    const ProfilePhotos = respose.docs.map((photo)=>{
        return{
            ...photo.data(),
            docId:photo.id
            }
    })
    return ProfilePhotos;

}


export async function deleteCommentDoc(docId,imgDocId,repliesComments){
    await deleteDoc(doc(FieldValue, "comments", docId));
    const photoDoc = doc(FieldValue, "photos", imgDocId);
    await updateDoc(photoDoc, {
        comments: increment(-1)
    });
    if(repliesComments.length>0){
        repliesComments.forEach(async(reply)=>{
            await deleteDoc(doc(FieldValue,"comments",reply.docId));
        });
    }
}
export async function deleteReplyDoc(docId,CommentDocId){
    await deleteDoc(doc(FieldValue, "comments", docId));
    const photoDoc = doc(FieldValue, "comments", CommentDocId);
    await updateDoc(photoDoc, {
        replies: increment(-1)
    });

}
export async function getUsersLiked(ids){
    return await Promise.all( ids.map(async(id)=>{
        const user = await getUserByUserId(id);
        return { ...user, docId:user.id }
    }))
}

/* --------new --------------- */
export async function doesPersonExist(name){
    const usersColl = collection(FieldValue,'person');

    const q = query( usersColl , where('name', '==', name.toLowerCase()) );
    
    const result = await getDocs(q);
    return result.docs.length >0;  
}
export async function addPerson(name){
    const personRef = collection(FieldValue,'person');
    const personDoc = addDoc(personRef, {
                    name: name.toLowerCase(),
                });
    return personDoc
}
export async function getPersons(){
    const personRef = collection(FieldValue,'person');
    const q = query( personRef );
    const result = await getDocs(q);
    const personDocs = result.docs.map(user=>{return{...user.data(),docId:user.id, label:user.data().name}})
    return personDocs;
}
export async function getTransactions({ name, docId }){
    console.log({ name, docId })
    const transactionRef = collection(FieldValue,'transaction');
    var q ;
    if(name === 'all'  || name === 'الكل'){
        q = query( transactionRef );
    }else{
        q = query( transactionRef, where('personDocId', '==', docId));
    }
    const result = await getDocs(q);
    const transactions = result.docs.map(trans=>{return{ ...trans.data(),docId:trans.id }})
    
    transactions.sort(( t1,t2 ) => t1.date - t2.date)
    return transactions;
}
export async function getTransactionsWithoutEg(){
    const transactionRef = collection(FieldValue,'transaction');
    const q = query( transactionRef );
    const result = await getDocs(q);
    let transactions = result.docs.map(trans=>{return{ ...trans.data(),docId:trans.id }})
    transactions = transactions.filter(t=>(t.personDocId !== 'HeIk34GsJUMLOiUTvdGg' && t.personDocId !=='LcdYDybgy2xQnpkdw1pA') );
    transactions.sort(( t1,t2 ) => t1.date - t2.date);
    console.log(transactions)
    return transactions;
}
export async function getTransactionsWithEg(){
    const transactionRef = collection(FieldValue,'transaction');
    const q = query( transactionRef );
    const result = await getDocs(q);
    let transactions = result.docs.map(trans=>{return{ ...trans.data(),docId:trans.id }})
    transactions = transactions.filter(t=>(t.personDocId === 'HeIk34GsJUMLOiUTvdGg' || t.personDocId ==='LcdYDybgy2xQnpkdw1pA') );
    transactions.sort(( t1,t2 ) => t1.date - t2.date);
    console.log(transactions)
    return transactions;
}
export async function addTransaction({ docId, name, addedBy, amount, price, isOut }){
    const transactionRef = collection(FieldValue,'transaction');
    const personDoc = addDoc(transactionRef, {
                    personName: name.toLowerCase(),
                    personDocId: docId,
                    addedBy,
                    amount: Number(amount),
                    price: Number(price),
                    isOut,
                    date: Date.now()
                });
    return personDoc
}
export async function deleteTransaction(docId){
    await deleteDoc(doc(FieldValue, "transaction", docId));
}