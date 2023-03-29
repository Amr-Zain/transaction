import { useState } from "react";
import AddPerson from "../components/add-person";
import AddTransaction from "../components/add-trans";
import Balance from "../components/balance";
import '../styles/dashboared.css';

const Dashboard =(()=>{
    const [ type, setType ] = useState('add-trans');
    return(<>
        <main className='main'>        
            <div className="choose">
                <div className= {`add-trans ${type ==='add-trans'?'active':''}`} onClick={()=>setType('add-trans')}>اضافه</div>
                <div className= {`person-balance ${type === 'person-balance' ?'active':''}`} onClick={()=>setType('person-balance')}>حساب شخص</div>
                <div className={`add-person ${type === 'add-person' ?'active':''}`} onClick={()=>setType('add-person')}>اضافه شخص</div>
            </div>
            <div className="choosed-container">
                {type === 'add-trans' && <AddTransaction />}                   
                {type === 'person-balance' && <Balance /> }
                {type === 'add-person' && <AddPerson /> }
            </div>
        </main>

    </>

)
})

export default Dashboard;