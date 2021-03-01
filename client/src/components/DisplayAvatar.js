import React from "react";
import Avatar from "@material-ui/core/Avatar";
import { makeStyles } from "@material-ui/core/styles";

const DisplayAvatar = ({ user, width, height }) => {
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
			src={`${window.location.origin}/api/users/avatar/${user._id}`}
			alt={user.displayName}
		/>
	) : (
		<Avatar className={classes.avatar} alt={user.displayName} />
	);

	return <div>{avatarCard}</div>;
};

export default DisplayAvatar;
