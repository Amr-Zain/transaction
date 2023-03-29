import { useState } from "react";
import { addPerson, doesPersonExist } from "../services/firebase";

function AddPerson() {
    const [state, setState ] = useState({name:'',error:''});
    const handelAdd = async(e)=>{
        e.preventDefault();
        if(await doesPersonExist(state.name)){
            setState({ name:'', error:'هذا الاسم موجود بالفعل' });
            return;
        }
        const person = await addPerson(state.name);
        console.log(person)
        setState({name: state.name, error:'تمت الاضافه'});
    }
    return ( <form className="add-person">
                {state.error && <p>{state.error}</p>}
                <input 
                    type='text'
                    name="name"
                    placeholder="الاسم"
                    value= {state.name}
                    onChange={(e)=>{setState({name:e.target.value, error:''})}}
                />
                <input 
                    type='submit'
                    onClick={handelAdd}
                    value={"تسجيل"}
                />
    </form> );
}

export default AddPerson;