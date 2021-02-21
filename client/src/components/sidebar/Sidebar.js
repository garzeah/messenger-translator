import React, { useState } from "react";

import SidebarHeader from "./children/SidebarHeader";
import SidebarList from "./children/SidebarList";
import SearchUser from "./children/SearchUser";
import "./Sidebar.css";

const Sidebar = () => {
	const [searchInput, setSearchInput] = useState("");
	return (
		<div className="sidebar">
			<SidebarHeader />
			<h2 id="chatsText">Chats</h2>
			<SearchUser setSearchInput={setSearchInput} />
			{
				// Rendering diff components based on user input
				searchInput ? (
					<SidebarList
						type="user"
						route="/api/users"
						searchInput={searchInput}
						setSearchInput={setSearchInput}
					/>
				) : (
					<SidebarList type="convo" route="/api/conversations/me" />
				)
			}
		</div>
	);
};

export default Sidebar;
