import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Modal } from "@material-ui/core";
import CancelIcon from "@material-ui/icons/Cancel";

import FileUpload from "./FileUpload";

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
		height: "30vh",
		width: "70vh",
		outline: "none",
		backgroundColor: theme.palette.background.paper,
		padding: theme.spacing(2, 4, 3)
	}
}));

const EditAvatarModal = (props) => {
	const classes = useStyles();
	// getModalStyle is not a pure function, we roll the style only on the first render
	const [modalStyle] = useState(getModalStyle);
	const [open, setOpen] = useState(false);

	const handleOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const body = (
		<div style={modalStyle} className={classes.paper}>
			<div className="modalHeader">
				<h2>Change Avatar</h2>
				<CancelIcon className="modalExit" onClick={handleClose} />
			</div>
			<FileUpload />
		</div>
	);

	return (
		<div>
			<div className="modalAvatar" onClick={handleOpen}>
				{props.children}
			</div>
			<Modal open={open} onClose={handleClose}>
				{body}
			</Modal>
		</div>
	);
};

export default EditAvatarModal;
