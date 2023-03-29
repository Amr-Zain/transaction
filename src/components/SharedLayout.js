import { Outlet } from "react-router-dom";
import Header from "./Header";
import Dashboard from "../pages/Dashboard";


function SharedLayout(){
    return (<>
                <Header />
                <Outlet />
            </>

    )

}
export default SharedLayout;