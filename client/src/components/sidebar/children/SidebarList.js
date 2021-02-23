import React, { useState, useEffect } from "react";
import PreviewConvo from "./PreviewConvo";

const SidebarList = ({
	type,
	route,
	searchInput,
	setSearchInput,
	setCurrConvo
}) => {
	// Stores conversations or possible users to message
	const [convoList, setConvoList] = useState({});
	const [userList, setUserList] = useState({});

	// Retrieves all your conversations or users to talk to
	// and sets the default conversation
	useEffect(() => {
		const retrieveContactsList = async () => {
			const res = await fetch(route);
			const data = await res.json();
			if (type === "convo") {
				setConvoList(data);

				// This sets the default conversation to show
				setCurrConvo(data[data.length - 1]);
			} else setUserList(data);
		};

		retrieveContactsList();
	}, [type, route, setCurrConvo]);

	// List of conversations a user has
	let convoListContent = Object.keys(convoList).map((_, idx, convos) => {
		// Wrote it in this manner so we can reverse the array
		// while returning each appropriate convo in O(n)
		let key = convos[convoList.length - 1 - idx];
		return (
			<PreviewConvo
				type="convo"
				key={convoList[key].conversationID}
				id={convoList[key].userID}
				user={convoList[key]}
				setCurrConvo={setCurrConvo}
			/>
		);
	});

	// List of possible users a user can add
	let filteredUserList = Object.values(userList).reduce((filtered, user) => {
		// Filtering out users by their email or name
		if (
			`${user.firstName} ${user.lastName}`.includes(searchInput) ||
			user.email.includes(searchInput)
		) {
			filtered.push(user);
		}
		return filtered;
	}, []);

	// List of users to add
	let userListContent = Object.keys(filteredUserList).map((key) => {
		return (
			<PreviewConvo
				type="user"
				key={filteredUserList[key]._id}
				id={filteredUserList[key]._id}
				user={filteredUserList[key]}
				setSearchInput={setSearchInput}
			/>
		);
	});

	return <div>{type === "convo" ? convoListContent : userListContent}</div>;
};

export default SidebarList;
