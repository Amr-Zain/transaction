import React from "react"
import './styles/App.css';
import {BrowserRouter as Router , Routes,Route,Navigate} from "react-router-dom"
//import Login from "./pages/Login"
import * as PATHS from './constants/Routes'
import UserContext from "./contexts/UserContext";
import useAuthUserListener from "./hooks/useAthUserListener"
import useActiveUser from "./hooks/useActiveUser"
import SharedLayout from './components/SharedLayout'
//import FirebaseContext from './contexts/firebase'

const Login = React.lazy(() => import('./pages/Login'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const NotAvailable = React.lazy(() => import('./pages/NotAvailable'));

function App() {
  const user = useAuthUserListener();
  //const {auth} = React.useContext(FirebaseContext);
  //const currUser = auth.currentUser;
  const { activeUserData:userData } = useActiveUser(user?.uid)
  
  return (<div>
          <UserContext.Provider value={user}>
            <Router>
              <React.Suspense fallback={<h3>Loading</h3>} >
                <Routes>
                  {
                  user?
                  <>
                    <Route path="/" element={<SharedLayout />}>
                      <Route path = {PATHS.HOME} element ={<Dashboard />}/> 
                      <Route path="*" element ={<NotAvailable/>}/>
                    </Route>
                    
                    <Route path={PATHS.LOGIN} element={<Navigate replace to={PATHS.HOME} />} />
                  </>
                  : 
                  <>
                    <Route path={PATHS.LOGIN} element={<Login/>} />
                    <Route path={PATHS.HOME} element={<Navigate replace to={PATHS.LOGIN} />} />
                    <Route path="/" element={<SharedLayout />}>
                      <Route path="*" element ={<NotAvailable/>}/>
                    </Route>
                  </>
                  }

                </Routes>
              </React.Suspense>
            </Router>
            
          </UserContext.Provider>
          </div>
    
  );
}

export default App;
