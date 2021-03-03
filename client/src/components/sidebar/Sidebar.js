import React, { useState } from "react";

import SidebarHeader from "./children/SidebarHeader";
import SidebarList from "./children/SidebarList";
import SearchUser from "./children/SearchUser";
import "./Sidebar.css";

const Sidebar = ({ currConvo, setCurrConvo, user, setUser, isMessageSent }) => {
	// Keeps track of a user's search input
	const [searchInput, setSearchInput] = useState("");

	return (
		<div className="sidebar">
			<SidebarHeader user={user} setUser={setUser} />
			<h2 id="chatsText">Chats</h2>
			<SearchUser searchInput={searchInput} setSearchInput={setSearchInput} />
			{
				// Renders list of users you can add
				searchInput ? (
					<SidebarList
						type="user"
						route="/api/users"
						searchInput={searchInput}
						setSearchInput={setSearchInput}
						setCurrConvo={setCurrConvo}
					/>
				) : (
					// Renders list of your current conversations
					<SidebarList
						type="convo"
						route="/api/conversations/me"
						currConvo={currConvo}
						setCurrConvo={setCurrConvo}
						isMessageSent={isMessageSent}
					/>
				)
			}
		</div>
	);
};

export default Sidebar;
