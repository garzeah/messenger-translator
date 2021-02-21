import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
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

const PreviewItem = ({ type, id, avatar, name, email, setSearchInput }) => {
	const classes = useStyles();

	const clickHandler = async () => {
		// Will send a post request to initiate a conversation
		try {
			// Our data to send to the server
			await fetch("/api/conversations/new", {
				method: "POST",
				body: JSON.stringify({ email }),
				headers: { "Content-Type": "application/json" }
			});
		} catch (err) {
			console.log(err);
		}

		// Clear user input
		setSearchInput("");
	};

	// Displaying Avatar JSX
	let avatarCard = avatar ? (
		<img
			className={classes.avatar}
			src={`${window.location.origin}/api/users/avatar/${id}`}
			alt={name}
		/>
	) : (
		<Avatar className={classes.avatar} alt={name} />
	);

	return (
		<div
			className="previewItem"
			onClick={type === "user" ? clickHandler : null}
		>
			{avatarCard}
			<p style={{ marginLeft: "15px" }}>{name}</p>
		</div>
	);
};

export default PreviewItem;
