import React, { useEffect } from "react";

import DisplayAvatar from "../../DisplayAvatar";
import Settings from "./Settings";
import ChangeAvatar from "../modals/ChangeAvatar";
import "../Sidebar.css";

const SidebarHeader = ({ user, setUser }) => {
	// Retrieves user information
	useEffect(() => {
		const retrieveUserInformation = async () => {
			// Fetching user data
			let data = await fetch("/api/users/me");
			data = await data.json();
			setUser(data);
		};
		retrieveUserInformation();
	}, [setUser]);

	return (
		<div className="sidebarHeaderContainer">
			<div className="sidebarHeaderUser">
				<ChangeAvatar>
					<DisplayAvatar user={user} width={6} height={6} />
				</ChangeAvatar>
				<h2 style={{ marginLeft: "15px" }}>{user.displayName}</h2>
			</div>
			<div className="sidebarHeaderUserSettings">
				<Settings user={user} />
			</div>
		</div>
	);
};

export default SidebarHeader;
