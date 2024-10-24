import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];
function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}
export default function App() {
  const [Friend, setFriend] = useState(initialFriends);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [selectFriend, setSelectFriend] = useState(null);

  function handelShow() {
    setShowAddFriend((show) => !show);
    setSelectFriend(null);
  }

  function handelAddFriend(friend) {
    setFriend((Friend) => [...Friend, friend]);
    setShowAddFriend(false);
  }

  function handelShowSpilt(friend) {
    setSelectFriend((cur) => (cur?.id === friend.id ? null : friend));
    setShowAddFriend(false);
  }

  function handleOnSpiltBill(value) {
    setFriend((friend) =>
      friend.map((friend) =>
        friend.id === selectFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
    setSelectFriend(null);
  }
  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          friend={Friend}
          selectFriend={selectFriend}
          onSplit={handelShowSpilt}
        />

        {showAddFriend && <AddFriends onAddFriend={handelAddFriend} />}

        <Button onClick={handelShow}>
          {showAddFriend == true ? `close` : `Add friend`}
        </Button>
      </div>
      {selectFriend && (
        <SplitBill
          selectFriend={selectFriend}
          onSplitBill={handleOnSpiltBill}
          key={selectFriend.id}
        />
      )}
    </div>
  );
}

function FriendsList({ friend, onSplit, selectFriend }) {
  return (
    <ul>
      {friend.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          selectFriend={selectFriend}
          onSplit={onSplit}
        />
      ))}
    </ul>
  );
}
function Friend({ friend, onSplit, selectFriend }) {
  const isSelect = selectFriend?.id === friend.id;

  return (
    <li className={isSelect ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>

      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} {Math.abs(friend.balance)}€
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes you {Math.abs(friend.balance)}€
        </p>
      )}
      {friend.balance === 0 && <p>You and {friend.name} are even</p>}

      <Button onClick={() => onSplit(friend)}>
        {isSelect ? "Close" : "select"}
      </Button>
    </li>
  );
}

function AddFriends({ onAddFriend }) {
  const [name, setName] = useState("");
  const [Image, setImage] = useState("https://i.pravatar.cc/48");

  function handelSubmit(e) {
    e.preventDefault();

    if (!name || !Image) return;

    const id = crypto.randomUUID();
    const newFriend = {
      id,
      name,
      image: `${Image}?=${id}`,
      balance: 0,
    };

    onAddFriend(newFriend);

    setName("");
    setImage("https://i.pravatar.cc/48");
  }

  return (
    <form className="form-add-friend" onSubmit={handelSubmit}>
      <label>👫Friend name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <label>🌄 Image URL</label>
      <input
        type="text"
        value={Image}
        onChange={(e) => setImage(e.target.value)}
      />

      <Button>Add</Button>
    </form>
  );
}
function SplitBill({ selectFriend, onSplitBill }) {
  const [bill, setBill] = useState("");
  const [paidByUser, setPaidByUser] = useState("");
  const [whoIsPay, setWhoIsPay] = useState("user");
  const def = bill ? bill - paidByUser : "";

  function handelSubmit(e) {
    e.preventDefault();

    if (!bill || !paidByUser) return;
    onSplitBill(whoIsPay === "user" ? def : -paidByUser);
  }

  return (
    <div>
      <form className="form-split-bill" onSubmit={handelSubmit}>
        <h2>Split a bill with {selectFriend.name}</h2>

        <label>💰 Bill value</label>
        <input
          type="text"
          value={bill}
          onChange={(e) => setBill(Number(e.target.value))}
        />

        <label>🧍‍♀️ Your expense</label>
        <input
          type="text"
          value={paidByUser}
          onChange={(e) =>
            setPaidByUser(
              Number(e.target.value) > bill
                ? paidByUser
                : Number(e.target.value)
            )
          }
        />
        <label>👫 {selectFriend.name}'s expense</label>
        <input type="text" disabled value={def} />

        <label>🤑 Who is paying the bill</label>
        <select value={whoIsPay} onChange={(e) => setWhoIsPay(e.target.value)}>
          <option value="user">you</option>
          <option value="friend">{selectFriend.name}</option>
        </select>
        <Button>Split bill</Button>
      </form>
    </div>
  );
}
