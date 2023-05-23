import { useState } from "react";

export default function Item({ i, itemList, updateItemList, ownerList }) {
  const [edited, setEdited] = useState(false);
  const [ownerName, setOwnerName] = useState(i.owner.name);
  const [ownerId, setOwnerId] = useState(i.owner_id);
  const [room, setRoom] = useState(i.room);
  const [category, setCategory] = useState(i.category);
  const [item, setItem] = useState(i.item);
  const [quantity, setQuantity] = useState(i.quantity);

  const optionsList = ownerList.map((o) => (
    <option key={o.id} value={o.id}>
      {o.name}
    </option>
  ));

  function handleOwnerChange(e) {
    setOwnerId(e.target.value);
    setOwnerName(e.target.options[e.target.selectedIndex].text);
    setEdited(true);
  }

  function handleItemUpdate() {
    const id = i.id;
    const updatedItem = {
      id: id,
      item: item,
      room: room,
      category: category,
      quantity: parseInt(quantity),
      owner_id: parseInt(ownerId),
      owner: { name: ownerName, owner_id: ownerId },
    };
    fetch(`http://localhost:9292/items/${i.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedItem),
    })
      .then((r) => r.json())
      .then((item) => {
        console.log(item);
        const updatedItemList = itemList.map((i) => {
          if (i.id === item.id) return updatedItem;
          else return i;
        });
        updateItemList(updatedItemList);
      });
    setEdited(false);
  }

  function handleItemDelete(id) {
    fetch(`http://localhost:9292/items/${id}`, {
      method: "DELETE",
    })
      .then((r) => r.json())
      .then((deletedItem) => {
        let updatedItems = itemList.filter((i) => {
          if (i.id === deletedItem.id) {
            return null;
          } else return i;
        });
        updateItemList(updatedItems);
      });
  }
  return (
    <tr key={i.id}>
      <td>
        <select defaultValue={ownerId} onChange={(e) => handleOwnerChange(e)}>
          {optionsList}
        </select>
      </td>
      <td>
        <input
          type="text"
          value={room}
          onChange={(e) => {
            setEdited(true);
            setRoom(e.target.value);
          }}
        />
      </td>
      <td>
        <input
          type="text"
          value={category}
          onChange={(e) => {
            setEdited(true);
            setCategory(e.target.value);
          }}
        />
      </td>
      <td>
        <input
          type="text"
          value={item}
          onChange={(e) => {
            setEdited(true);
            setItem(e.target.value);
          }}
        />
      </td>
      <td>
        <input
          type="text"
          value={quantity}
          onChange={(e) => {
            setEdited(true);
            setQuantity(e.target.value);
          }}
        />
      </td>
      <td>
        <button onClick={() => handleItemDelete(i.id)}>Delete</button>
        {edited ? <button onClick={handleItemUpdate}>Save</button> : null}
      </td>
    </tr>
  );
}
