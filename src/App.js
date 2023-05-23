import Header from "./Header";
import CreateNew from "./CreateNew";
import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";

function App() {
  const [ownerList, setOwnerList] = useState([]);
  const [itemList, setItemList] = useState([]);

  useEffect(() => {
    fetch("http://localhost:9292/items")
      .then((r) => r.json())
      .then((data) => setItemList(data));
  }, []);
  useEffect(() => {
    fetch("http://localhost:9292/owners")
      .then((r) => r.json())
      .then((data) => setOwnerList(data));
  }, []);

  return (
    <div>
      <Header />
      <CreateNew
        ownerList={ownerList}
        updateOwnerList={(newList) => setOwnerList(newList)}
        itemList={itemList}
        updateItemList={(newList) => setItemList(newList)}
      />
    </div>
  );
}

export default App;
