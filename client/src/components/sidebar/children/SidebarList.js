import React, { useState, useEffect } from "react";
import PreviewConvo from "./PreviewConvo";

const SidebarList = ({ type, route, searchInput, setSearchInput }) => {
	// Stores conversations or possible users to message
	const [convoList, setConvoList] = useState({});
	const [userList, setUserList] = useState({});

	// Retrieves all your conversations or users to message
	useEffect(() => {
		async function retrieveList() {
			const res = await fetch(route);
			const data = await res.json();
			if (type === "convo") setConvoList(data);
			else setUserList(data);
		}

		retrieveList();
	}, [type, route]);

	// List of conversations a user has
	let convoListContent = Object.keys(convoList).map((_, idx, convos) => {
		// Wrote it in this manner so we can reverse the array
		// while returning each appropriate convo in O(n)
		let key = convos[convoList.length - 1 - idx];
		let hasAvatar;
		if (convoList[key].avatar) hasAvatar = true;
		else hasAvatar = false;
		return (
			<PreviewConvo
				type="convo"
				key={`${convoList[key].conversationID}`}
				id={`${convoList[key].userID}`}
				avatar={hasAvatar}
				name={`${convoList[key].firstName} ${convoList[key].lastName}`}
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
		let hasAvatar;
		if (filteredUserList[key].avatar) hasAvatar = true;
		else hasAvatar = false;
		return (
			<PreviewConvo
				type="user"
				key={`${filteredUserList[key]._id}`}
				id={`${filteredUserList[key]._id}`}
				avatar={hasAvatar}
				name={`${filteredUserList[key].firstName} ${filteredUserList[key].lastName}`}
				email={filteredUserList[key].email}
				setSearchInput={setSearchInput}
			/>
		);
	});

	return <div>{type === "convo" ? convoListContent : userListContent}</div>;
};

export default SidebarList;
