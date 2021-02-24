import React, { useState, useEffect } from "react";

import PreviewConvo from "./PreviewConvo";

const SidebarList = ({
	type,
	route,
	searchInput,
	setSearchInput,
	currConvo,
	setCurrConvo
}) => {
	// Stores conversations or possible users to message
	const [convoList, setConvoList] = useState({});
	const [userList, setUserList] = useState({});

	// Retrieves all your conversations or users to talk to
	// and sets the default conversation
	useEffect(() => {
		const retrieveLists = async () => {
			const res = await fetch(route);
			const data = await res.json();
			if (type === "convo") {
				setConvoList(data);

				// This sets the default conversation to show
				// if (Object.keys(currConvo).length === 0)
				// 	setCurrConvo(data[data.length - 1]);
			} else setUserList(data);
		};

		retrieveLists();
	}, [type, route, currConvo, setCurrConvo]);

	console.log(userList);

	// List of possible users a user can add
	let filteredUserList = Object.values(userList).reduce((filtered, user) => {
		// Filtering out users by their email or name
		console.log(user.displayName);
		console.log(searchInput);
		// if (
		// 	user.displayName.includes(searchInput) ||
		// 	user.email.includes(searchInput)
		// ) {
		// 	filtered.push(user);
		// }
		return filtered;
	}, []);

	// List of users to add
	let userListCard = Object.keys(filteredUserList).map((key) => {
		return (
			<PreviewConvo
				type="user"
				key={filteredUserList[key]._id}
				user={filteredUserList[key]}
				currConvo={currConvo}
				setCurrConvo={setCurrConvo}
				setSearchInput={setSearchInput}
			/>
		);
	});

	// List of conversations a user has
	let convoListCard = Object.keys(convoList).map((_, idx, convos) => {
		// Wrote it in this manner so we can reverse the array
		// while returning each appropriate convo in O(n)
		let key = convos[convoList.length - 1 - idx];

		return (
			<PreviewConvo
				type="convo"
				key={convoList[key].conversationID}
				user={convoList[key]}
				currConvo={currConvo}
				setCurrConvo={setCurrConvo}
			/>
		);
	});

	return (
		<div className="sidebarList">
			{searchInput ? userListCard : convoListCard}
		</div>
	);
};

export default SidebarList;
