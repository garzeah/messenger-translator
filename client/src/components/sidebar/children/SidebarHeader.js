import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";

import Settings from "./Settings";
import UserAvatar from "./UserAvatar";
import "../Sidebar.css";

const useStyles = makeStyles((theme) => ({
	root: {
		display: "flex",
		"& > *": {
			margin: theme.spacing(1)
		}
	},
	avatar: {
		width: theme.spacing(6),
		height: theme.spacing(6),
		borderRadius: "50px"
	}
}));

const SidebarHeader = () => {
	const classes = useStyles();
	// State management for user info. and modal
	const [user, setUser] = useState({});

	// Retrieves user information
	useEffect(() => {
		async function retrieveUserInformation() {
			// Fetching user data
			let userData = await fetch("/api/users/me");
			userData = await userData.json();
			setUser(userData);
		}
		retrieveUserInformation();
	}, []);

	// Avatar JSX
	let avatarCard = user.avatar ? (
		<img
			className={classes.avatar}
			src={`data:image/jpeg;base64,${user.avatar}`}
			alt={`${user.firstName} ${user.lastName}`}
		/>
	) : (
		<Avatar
			className={classes.avatar}
			alt={`${user.firstName} ${user.lastName}`}
		/>
	);

	return (
		<div className="sidebarHeader">
			<div className="sidebarHeaderUser">
				<UserAvatar> {avatarCard} </UserAvatar>
				<h2 style={{ marginLeft: "15px" }}>
					{user.firstName} {user.lastName}
				</h2>
			</div>
			<div className="sidebarHeaderUserSettings">
				<Settings />
			</div>
		</div>
	);
};

export default SidebarHeader;
