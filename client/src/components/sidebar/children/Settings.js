import React, { useState } from "react";
import { Modal, Menu, MenuItem, makeStyles } from "@material-ui/core/";
import { useHistory } from "react-router-dom";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import CancelIcon from "@material-ui/icons/Cancel";

import EditProfile from "../modals/EditProfile";

function getModalStyle() {
	const top = 50;
	const left = 50;

	return {
		top: `${top}%`,
		left: `${left}%`,
		transform: `translate(-${top}%, -${left}%)`
	};
}

const useStyles = makeStyles((theme) => ({
	paper: {
		position: "absolute",
		outline: "none",
		width: "70vh",
		backgroundColor: theme.palette.background.paper,
		padding: theme.spacing(2, 2, 2)
	}
}));

const Settings = ({ user }) => {
	const classes = useStyles();
	// getModalStyle is not a pure function, we roll the style only on the first render
	const [modalStyle] = useState(getModalStyle);
	const [open, setOpen] = useState(false);
	const [anchorEl, setAnchorEl] = useState(null);

	// Will be used to redirect user
	const history = useHistory();

	const handleLogout = async () => {
		try {
			// Our data to send to the server
			const res = await fetch("/api/logout");

			// Redirect them to messenger page
			if (res.status === 200) {
				history.push("/");
			}
		} catch (err) {
			console.log(err);
		}
	};

	const body = (
		<div style={modalStyle} className={classes.paper}>
			<div className="modalHeader">
				<CancelIcon className="modalExit" onClick={() => setOpen(false)} />
			</div>
			<EditProfile user={user} />
		</div>
	);

	return (
		<div>
			<Menu
				anchorEl={anchorEl}
				open={Boolean(anchorEl)}
				onClose={() => setAnchorEl(null)}
			>
				<MenuItem onClick={() => setOpen(true)}>Edit Profile</MenuItem>
				<MenuItem onClick={handleLogout}>Logout</MenuItem>
			</Menu>
			<MoreHorizIcon
				style={{ color: "#c9d1df" }}
				onClick={(e) => setAnchorEl(e.currentTarget)}
			/>
			<Modal open={open}>{body}</Modal>
		</div>
	);
};

export default Settings;
