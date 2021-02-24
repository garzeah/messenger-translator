import React from "react";
import Avatar from "@material-ui/core/Avatar";
import { makeStyles } from "@material-ui/core/styles";

const DisplayAvatar = ({ id, user, width, height }) => {
	const useStyles = makeStyles((theme) => ({
		root: {
			display: "flex",
			"& > *": {
				margin: theme.spacing(1)
			}
		},
		avatar: {
			width: theme.spacing(width),
			height: theme.spacing(height),
			borderRadius: "50px"
		}
	}));

	const classes = useStyles();

	let avatarCard = user.avatar ? (
		<img
			className={classes.avatar}
			src={`${window.location.origin}/api/users/avatar/${id}`}
			alt={`${user.firstName} ${user.lastName}`}
		/>
	) : (
		<Avatar
			className={classes.avatar}
			alt={`${user.firstName} ${user.lastName}`}
		/>
	);

	return <div>{avatarCard}</div>;
};

export default DisplayAvatar;
