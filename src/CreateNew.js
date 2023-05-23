import { useState } from "react";
import Item from "./Item";

export default function CreateNew({
  updateOwnerList,
  ownerList,
  itemList,
  updateItemList,
}) {
  const [currentOwnerName, setCurrentOwnerName] = useState("");
  const [ownerId, setOwnerId] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [room, setRoom] = useState("");
  const [category, setCategory] = useState("");
  const [item, setItem] = useState("");
  const [quantity, setQuantity] = useState("");

  const optionsList = ownerList.map((o) => (
    <option key={o.id} value={o.id}>
      {o.name}
    </option>
  ));

  function handleOwnerChange(e) {
    setOwnerId(e.target.value);
    setCurrentOwnerName(e.target.options[e.target.selectedIndex].text);
  }

  function handleNewOwner(e) {
    e.preventDefault();

    const newOwner = { name: ownerName };

    fetch("http://localhost:9292/owners", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newOwner),
    })
      .then((r) => r.json())
      .then((owner) => {
        const newOwnerList = [...ownerList, owner];
        updateOwnerList(newOwnerList);
        setOwnerId(owner.id);
      });
  }

  function handleItemSubmit(e) {
    e.preventDefault();

    const newItem = {
      item: item,
      room: room,
      category: category,
      quantity: parseInt(quantity),
      owner_id: parseInt(ownerId),
      owner: { name: currentOwnerName, id: parseInt(ownerId) },
    };

    fetch("http://localhost:9292/items", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newItem),
    })
      .then((r) => r.json())
      .then((item) => {
        const updatedItemList = [...itemList, item];
        updateItemList(updatedItemList);
      });
    setCategory("");
    setItem("");
    setQuantity("");
    setRoom("");
  }

  function ownerDelete() {
    fetch(`http://localhost:9292/owners/${ownerId}`, {
      method: "DELETE",
    })
      .then((r) => r.json())
      .then((deletedOwner) => {
        const updatedOwners = ownerList.filter((owner) => {
          if (owner.id === deletedOwner.id) return null;
          else return owner;
        });
        const updatedItems = itemList.filter((i) => {
          if (i.owner_id === deletedOwner.id) return null;
          else return i;
        });
        updateItemList(updatedItems);
        updateOwnerList(updatedOwners);
        setOwnerName("");
        setOwnerId("");
      });
  }

  return (
    <>
      <div className="owner_container">
        <span>Select owner to view inventory: </span>
        <br />

        <select defaultValue={ownerName} onChange={(e) => handleOwnerChange(e)}>
          <option key={"disabled"} value="">
            Owners
          </option>
          <option key="all" value="all">
            Show All
          </option>
          {ownerList.map((o) => (
            <option key={o.id} value={o.id}>
              {o.name}
            </option>
          ))}
        </select>
        <br />
        <span> Create new owner:</span>
        <br />

        <form className="owner_form" onSubmit={handleNewOwner}>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            name="name"
            value={ownerName}
            onChange={(e) => setOwnerName(e.target.value)}
          />
          <button>+</button>
        </form>
      </div>
      {ownerId === "" || ownerId === "all" ? null : (
        <>
          <div className="add_title">Add item to inventory:</div>
          <br />
          <div className="add_item_container">
            <form onSubmit={handleItemSubmit}>
              <label htmlFor="room">Room:</label>
              <input
                name="room"
                type="text"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
              />

              <label htmlFor="category">Category: </label>
              <input
                name="category"
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
              <label htmlFor="item">Item Description: </label>
              <input
                name="item"
                type="text"
                value={item}
                onChange={(e) => setItem(e.target.value)}
              />

              <label htmlFor="quanitity">Quantity: </label>
              <input
                name="quantity"
                type="text"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
              <button>+</button>
            </form>
          </div>
        </>
      )}
      <div className="table_container">
        {ownerId === "" ? null : (
          <>
            <table>
              <thead>
                <tr>
                  <th>Owner</th>
                  <th>Room</th>
                  <th>Category</th>
                  <th>Item Description</th>
                  <th>Quantity</th>
                </tr>
              </thead>
              <tbody>
                {ownerId === "all"
                  ? itemList.map((i) => {
                      return (
                        <Item
                          ownerList={ownerList}
                          key={i.id}
                          i={i}
                          itemList={itemList}
                          updateItemList={updateItemList}
                        />
                      );
                    })
                  : itemList
                      .filter((i) => i.owner_id == ownerId)
                      .map((i) => {
                        return (
                          <Item
                            ownerList={ownerList}
                            key={i.id}
                            i={i}
                            itemList={itemList}
                            updateItemList={updateItemList}
                          />
                        );
                      })}
              </tbody>
            </table>
            {ownerId === "" || ownerId === "all" ? null : (
              <button className="delete_all" onClick={ownerDelete}>
                Delete Owner and Inventory
              </button>
            )}
          </>
        )}
      </div>
    </>
  );
}
