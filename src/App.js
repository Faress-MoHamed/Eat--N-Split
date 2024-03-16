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
export default function App() {
	const [friend, setFriend] = useState(initialFriends);
	const [AddFriend, SetAddFriend] = useState(false);
	const [selectedFriend, setSelectedFriend] = useState(null);
	function handleShowSplit() {
		return SetAddFriend((e) => !e);
	}
	function handleAddFriend(friend) {
		setFriend((friends) => [...friends, friend]);
		SetAddFriend(false);
	}
	function handleSelecting(friend) {
		// setSelectedFriend(friend);
		console.log();
		setSelectedFriend((cur) => (cur?.id === friend.id ? null : friend));
	}
	function handleSplitBill(value) {
		setFriend((friends) =>
			friends.map((f) =>
				f.id === selectedFriend.id ? { ...f, balance: f.balance + value } : f
			)
		);
		setSelectedFriend(null);
	}
	return (
		<div className="app">
			<div className="sidebar">
				<FriendsList
					friends={friend}
					onSelection={handleSelecting}
					selectedFriend={selectedFriend}
				></FriendsList>
				{AddFriend && (
					<FormAddFriend onAddnewFriend={handleAddFriend}></FormAddFriend>
				)}
				<Button onClick={handleShowSplit}>
					{AddFriend ? "close" : "Add Friend"}
				</Button>
			</div>
			{selectedFriend && (
				<FormSplitBill
					onsplitpill={handleSplitBill}
					selectedFriend={selectedFriend}
					key={selectedFriend.id}
				></FormSplitBill>
			)}
		</div>
	);
}

function FriendsList({ friends, onSelection, selectedFriend }) {
	return (
		<ul>
			{friends.map((el) => (
				<Friend
					selectedFriend={selectedFriend}
					friend={el}
					key={el.id}
					onSelection={onSelection}
				></Friend>
			))}
		</ul>
	);
}
function Friend({ friend, onSelection, selectedFriend }) {
	const isSelected = selectedFriend && selectedFriend.id === friend.id;
	return (
		<li className={isSelected ? "selected" : ""}>
			<img src={friend.image} alt={friend.name} />
			<h3>{friend.name}</h3>
			{friend.balance < 0 && (
				<p className="red">
					You owe {friend.name} {friend.balance}$
				</p>
			)}
			{friend.balance > 0 && (
				<p className="green">
					{friend.name} owe's you {friend.balance}$
				</p>
			)}
			{friend.balance === 0 && <p>You and {friend.name} are even</p>}
			<Button onClick={() => onSelection(friend)}>
				{isSelected ? "close" : "select"}
			</Button>
		</li>
	);
}

function Button({ children, onClick }) {
	return (
		<button className="button" onClick={() => onClick && onClick((e) => !e)}>
			{children}
		</button>
	);
}
function FormAddFriend({ onAddnewFriend }) {
	const [name, SetName] = useState("");
	const [image, SetImage] = useState("https://i.pravatar.cc/48");
	function handleSubmit(e) {
		e.preventDefault();
		if (!name || !image) return;
		const id = crypto.randomUUID();
		const newFriend = {
			id,
			name,
			image: `${image}?=${id}`,
			balance: 0,
		};
		onAddnewFriend(newFriend);
		SetName("");
		SetImage("https://i.pravatar.cc/48");
	}
	return (
		<form className="form-add-friend" onSubmit={handleSubmit}>
			<label> Friend name</label>
			<input
				type="text"
				value={name}
				onChange={(e) => SetName(e.target.value)}
			/>

			<label>💲 image Url:</label>
			<input
				type="text"
				value={image}
				onChange={(e) => SetImage(e.target.value)}
			/>

			<Button>add</Button>
		</form>
	);
}
function FormSplitBill({ selectedFriend, onsplitpill }) {
	const [bill, setBill] = useState("");
	const [paidByUser, setPaidByUser] = useState("");
	const paidByFriend = bill ? bill - paidByUser : "";
	const [whoIsPaying, setWhoIsPaying] = useState("user");
	function handleSubmit(e) {
		e.preventDefault();

		if (!bill || !paidByUser) return;
		onsplitpill(whoIsPaying === "user" ? paidByFriend : -paidByUser);
		// setBill(0);
		// setPaidByUser(0);
		// setWhoIsPaying("user");
	}
	return (
		<form className="form-split-bill" onSubmit={handleSubmit}>
			<h2>Split a bill with {selectedFriend.name}</h2>
			<label>💵 Bill value</label>
			<input
				type="text"
				value={bill}
				onChange={(e) => setBill(1 * e.target.value)}
			/>
			<label>💸Your expense</label>
			<input
				type="text"
				value={paidByUser}
				onChange={(e) =>
					setPaidByUser(
						1 * e.target.value > bill ? paidByUser : 1 * e.target.value
					)
				}
			/>
			<label>🤑 {selectedFriend.name}'s expense</label>
			<input type="text" disabled value={paidByFriend} />

			<label>💰 who's is paying the bill</label>
			<select
				value={whoIsPaying}
				onChange={(e) => setWhoIsPaying(e.target.value)}
			>
				<option value="user">You</option>
				<option value="friend">{selectedFriend.name}</option>
			</select>

			<Button>Spill Bill</Button>
		</form>
	);
}
