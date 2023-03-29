import ReactDOM from 'react-dom'

function ComfirmDelete({overlayState,setOverlayState,hadelDelete}){

    if(!overlayState)return null;
    return(
        ReactDOM.createPortal(
            (<>
                <div onClick={()=>setOverlayState(false)} className="over" style={{
                    position: 'fixed',
                    left: '0',
                    top: '0',
                    width: '100%',
                    height: '100%',
                    zIndex:"250",
                    backgroundColor: 'rgb(0 0 0 / 60%)',
                    display: 'block'
                }}></div>
                <div className="overlay" style={{display: 'flex'}}>
                            <div onClick={hadelDelete}>
                                <button  className="unfollow">حذف</button>
                            </div>
                            <div onClick={()=>{setOverlayState(false)}}>
                                <button  className="cancel">الغاء</button>
                            </div>
                        </div>
            </>)
        ,document.getElementById('root3'))
    )
}

export default ComfirmDelete;