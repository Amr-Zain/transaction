import { useEffect, useState } from "react";
import Select from "react-select";
import {
  deleteTransaction,
  getPersons,
  getTransactions,
  getTransactionsWithEg,
  getTransactionsWithoutEg,
} from "../services/firebase";
import ComfirmDelete from "./comfirm-delete.";
const ops = [
  { label: "الكل", name: "all", docId: "" },
  { label: "الكل السعوديه ", name: "SA", docId: "" },
  { label: "الكل مصر ", name: "EG", docId: "" },
];
function Balance() {
  const [options, setOptions] = useState([
    { label: "الكل", name: "all", docId: "" },
  ]);
  const [selected, setSelected] = useState({
    label: "الكل",
    name: "all",
    docId: "",
  });
  const [transactions, setTransactions] = useState([]);
  const [isPounds, setIsPounds] = useState(false);
  const [overlayState, setOverlayState] = useState(false);
  const [docId, setDocId] = useState("");
  const handleCategChange = async (item) => {
    setSelected(item);
    let trans;
    if (item.name === "SA") {
        trans = await getTransactionsWithoutEg();
      setTransactions(trans);
      return;
    } else if (item.name === 'EG') {
        trans = await getTransactionsWithEg(); //eg only
    }else{
        trans = await getTransactions({ name: item.name, docId: item.docId });
    }
    setTransactions(trans);
  };
  const hadelDelete = (docId) => {
    return async () => {
      await deleteTransaction(docId);
      setTransactions((prv) => prv.filter((trans) => trans.docId !== docId));
      setOverlayState(false);
    };
  };
  const TransactionList = transactions?.map((tran) => {
    return (
      <tr key={tran.docId} className="transaction">
        <td className="person-name">{tran.personName}</td>
        <td className="amount">
          {isPounds ? Number(tran.amount) * Number(tran.price) : tran.amount}
        </td>
        <td className="is-out">{tran.isOut ? "خارج" : "داخل"}</td>
        <td className="date">
          {new Intl.DateTimeFormat("en-US").format(tran.date)}
        </td>
        <td className="added-by">{tran.addedBy}</td>
        <td className="added-by">
          <div
            onClick={() => {
              setDocId(tran.docId);
              setOverlayState(true);
            }}
          >
            <div style={{cursor:'pointer'}}> حذف</div>
          </div>
        </td>
      </tr>
    );
  });
  let inSum = 0,
    outSum = 0;
  for (let i = 0; i < transactions.length; i++) {
    if (transactions[i].isOut) {
      if (isPounds)
        outSum +=
          Number(transactions[i].amount) * Number(transactions[i].price);
      else outSum += Number(transactions[i].amount);
    } else {
      if (isPounds)
        inSum += Number(transactions[i].amount) * Number(transactions[i].price);
      else inSum += Number(transactions[i].amount);
    }
  }
  useEffect(() => {
    const persons = async () => {
      const persons = getPersons();
      const trans = getTransactions({
        name: selected.label,
        docId: selected.docId,
      });
      const [result1, result2] = await Promise.all([persons, trans]);
      console.log(result1);
      setOptions([...ops, ...result1]);
      setTransactions(result2);
    };
    persons();
  }, []);
  return (
    <div>
      <div style={{ width: "90%", maxWidth: "22rem", margin: "0 auto" }}>
        <Select
          options={options}
          onChange={handleCategChange}
          value={selected}
          placeholder="person"
        />
      </div>
      <div
        style={{
          width: "22rem",
          maxWidth: "90%",
          textAlign: "start",
          margin: ".5rem auto",
        }}
      >
        <input
          type="checkbox"
          id="isOut"
          name="isOut"
          value={isPounds}
          onChange={(e) => {
            setIsPounds(e.target.checked);
          }}
        />
        <label style={{ margin: "0 .5rem" }} htmlFor="isOut">
          بالجنيه
        </label>
      </div>
      <table className="table" style={{ marginTop: "2rem", width: "55rem" }}>
        <thead>
          <tr>
            <th style={{ color: "white" }}>الاسم</th>
            <th style={{ color: "white" }}>المبلغ</th>
            <th style={{ color: "white" }}>النوع</th>
            <th style={{ color: "white" }}>التاريخ</th>
            <th style={{ color: "white" }}>المضيف</th>
            <th style={{ color: "white" }}>حذف</th>
          </tr>
        </thead>
        <tbody>
          {TransactionList}
          <tr>
            <td className="date">الاجمالي</td>
            <td className="added-by">{inSum - outSum}</td>
          </tr>
        </tbody>
      </table>
      <ComfirmDelete
        overlayState={overlayState}
        setOverlayState={setOverlayState}
        hadelDelete={hadelDelete(docId)}
      />
    </div>
  );
}

export default Balance;
