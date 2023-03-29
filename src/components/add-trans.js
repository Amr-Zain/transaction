import { useContext, useEffect, useState } from "react";
import Select from "react-select";
import { addTransaction, getPersons } from "../services/firebase";
import UserContext from "../contexts/UserContext";

function AddTransaction() {
  const [options, setOptions] = useState([]);
  const [selected, setSelected] = useState();
  const [state, setState] = useState({ amount: "",price:'', isOut:false,error: "" });
  const handleCategChange = async (item) => {
    setSelected(item);
  };
  const ActiveUser = useContext(UserContext);
  console.log(ActiveUser.email.split('@')[0])
  const handelAdd = async (e) => {
      e.preventDefault();
      if(!state.amount || !selected) {
        setState(prv=>({...prv, error:'ادخل كل الحقول'}))
        return;
      }
      if(!Number(state.amount) ){
        setState(prv=>({...prv, error:'ادخل رقم صحصح',amount:''}))
        return;
      }
      if(!Number(state.price) ){
        setState(prv=>({...prv, error:'ادخل رقم صحصح',price:''}))
        return;
      }
      const trans = await addTransaction({docId:selected.docId, name:selected.label,price: state.price, 
        addedBy: ActiveUser.email.split('@')[0], amount:state.amount,isOut:state.isOut});
        setState(prv=>({ amount: '', price:'', isOut:false,error:'تمت الاضافه' }))
    
  };
  useEffect(() => {
    const persons = async () => {
      const persons = await getPersons();
      setOptions(persons);
    };
    persons();
  }, []);
  console.log(state)
  return (
    <div className="add-trans">
      {state.error && <p>{state.error}</p>}
      <div style={{ width: "90%", maxWidth: "22rem", margin: "0 auto" }}>
        <Select
          placeholder={"الشخص"}
          options={options}
          onChange={handleCategChange}
          value={selected}
        />
      </div>
      <input
        type="text"
        name="amount"
        placeholder=" المبلغ بالريال"
        value={state.amount}
        onChange={(e) => {
          setState((prv) => ({ ...prv, amount: e.target.value, error: "" }));
        }}
      />
      <input
        type="text"
        name="amount"
        placeholder=" سعر الريال "
        value={state.price}
        onChange={(e) => {
          setState((prv) => ({ ...prv, price: e.target.value, error: "" }));
        }}
      />
      <div style={{width:'22rem',maxWidth:'90%',textAlign:'start'}}>
        <input
            type="checkbox"
            id="isOut"
            name="isOut"
            value={state.isOut}
            onChange={(e) => {
            setState((prv) => ({ ...prv, isOut: e.target.checked, error: "" }));
            }}
        />
        <label style={{margin:'0 .5rem'}} htmlFor="isOut">خارج</label>
      </div>
      <input type="submit" onClick={handelAdd} value={"تسجيل"} />
    </div>
  );
}

export default AddTransaction;
