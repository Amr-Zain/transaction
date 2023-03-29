
import { Link } from "react-router-dom"
import "../styles/notAvailable.css"
import { HOME } from "../constants/Routes"
export default function NotAvailble(){

    return(
        <div >
            <h3 className="message">Sorry, this page isn't available.</h3>
            <p className="not-avail-p">The link you followed may be broken, or the page may have been removed. <Link className="back" to={HOME}>Go back.</Link> </p>
        </div>
    )
}