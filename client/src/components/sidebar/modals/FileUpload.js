import React from "react";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";

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

const FileUpload = () => {
	// State to store uploaded file
	const [file, setFile] = React.useState();

	// On file select (from the pop up)
	const onFileChange = (event) => {
		// Update the state
		setFile(event.target.files[0]);
	};

	// On file upload (click the upload button)
	const onFileUpload = async () => {
		// If no file, don't let a user upload
		if (!file) return;

		// Create an object of formData
		const formData = new FormData();

		// Update the formData object
		formData.append("avatars", file, file.name);

		// Request made to the backend api and send formData object
		const res = await fetch("api/users/me/avatar", {
			method: "POST",
			body: formData
		});

		// Redirect them to messenger page
		if (res.status === 201) {
			window.location.reload();
		}
	};

	return (
		<div>
			<input
				style={{ margin: "15px 0" }}
				onChange={onFileChange}
				accept="image/*"
				multiple
				type="file"
			/>
			{file ? (
				<div className="avatarPreviewAndUploadContainer">
					<ImageThumb image={file} />
					<Button
						style={{ marginLeft: "10px" }}
						onClick={onFileUpload}
						variant="contained"
						color="primary"
						size="small"
					>
						Upload
					</Button>
				</div>
			) : null}
		</div>
	);
};

// Component to display thumbnail of image.
const ImageThumb = ({ image }) => {
	const classes = useStyles();

	return (
		<div className="previewAvatar">
			<img
				className={classes.avatar}
				src={URL.createObjectURL(image)}
				alt={image.name}
			/>
			<p style={{ marginLeft: "15px" }}>Do you want to upload this?</p>
		</div>
	);
};

export default FileUpload;
