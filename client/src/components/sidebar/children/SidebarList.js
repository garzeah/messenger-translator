import React, { useState, useEffect } from "react";

import PreviewConvo from "./PreviewConvo";

const SidebarList = ({
	type,
	route,
	searchInput,
	setSearchInput,
	currConvo,
	setCurrConvo,
	isMessageSent
}) => {
	// Stores conversations or possible users to message
	const [userList, setUserList] = useState({});
	const [convoList, setConvoList] = useState({});

	// Retrieves all your conversations or users to talk to
	// and sets the default conversation
	useEffect(() => {
		const retrieveLists = async () => {
			const res = await fetch(route);
			const data = await res.json();
			if (type === "convo") {
				// If there is no current conversation...
				if (currConvo === null) {
					// If a user has no contacts... do nothing
					if (data.length === 0) return null;
					// Set the most recent convo by default
					setCurrConvo(data[data.length - 1]);
				}
				setConvoList(data);
			} else setUserList(data);
		};
		retrieveLists();
	}, [type, route, currConvo, setCurrConvo, isMessageSent]);

	// List of possible users a user can add
	let filteredUserList = Object.values(userList).reduce((filtered, user) => {
		// Filtering out users by their email or name
		if (
			user.displayName.includes(searchInput) ||
			user.email.includes(searchInput)
		) {
			filtered.push(user);
		}
		return filtered;
	}, []);

	// List of users to add
	const userListCard = Object.keys(filteredUserList).map((key) => {
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
	const convoListCard = Object.keys(convoList).map((_, idx, convos) => {
		// Wrote it in this manner so we can reverse the array
		// while returning each appropriate convo in O(n)
		let key = convos[convoList.length - 1 - idx];

		return (
			<PreviewConvo
				type="convo"
				key={convoList[key].conversationID}
				user={convoList[key]}
				convoList={convoList}
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
