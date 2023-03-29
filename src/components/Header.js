import React from "react";
import FirebaseContext from '../contexts/firebase'
import { Link , useNavigate} from 'react-router-dom'
import * as PATHS from '../constants/Routes'
import '../styles/header.css'

import { signOut } from "firebase/auth";
function Header(){

    const { auth } = React.useContext(FirebaseContext);
    const navigate = useNavigate();
    //const user =  auth.currentUser;
    /* if(user){
        
    } */
    
    
    return (<header>
                <div className="header-container">
                    <div className="logo ">
                            <Link  to={PATHS.LOGIN} >
                                <button
                                    style={{marginRight:'1rem',padding:'.25rem .5rem'}}
                                    className="signout"
                                    onClick={() => {
                                        signOut(auth).then(() => {
                                            navigate(PATHS.LOGIN);
                                        }).catch((e) => {
                                        console.log(e);
                                        });
                                    }}
                                >
                                    تسجيل الخروج
                                </button>
                            </Link>
                    </div>
                    <div className="user">
                            <Link className="home"to={PATHS.HOME}>
                            <svg aria-label="Home" className="_ab6-" color="#262626" fill="#262626" 
                                height="24" role="img" viewBox="0 0 24 24" width="24">
                                <path d="M22 23h-6.001a1 1 0 01-1-1v-5.455a2.997 2.997 0 
                                10-5.993 0V22a1 1 0 01-1 1H2a1 1 0 01-1-1V11.543a1.002 1.002 0 
                                01.31-.724l10-9.543a1.001 1.001 0 011.38 0l10 9.543a1.002 1.002 0 
                                01.31.724V22a1 1 0 01-1 1z"></path></svg>
                                
                            </Link>
                                
                            
                    </div>
                </div>
                
            </header>)
}
export default Header;


