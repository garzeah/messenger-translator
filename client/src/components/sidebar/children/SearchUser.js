import React from "react";
import {
	FormControl,
	OutlinedInput,
	InputAdornment,
	withStyles
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";

const styles = {
	root: {
		"& $notchedOutline": {
			borderWidth: 0
		},
		"&:hover $notchedOutline": {
			borderWidth: 0
		},
		"&$focused $notchedOutline": {
			borderWidth: 0
		},
		"& .MuiOutlinedInput-input": {
			color: "black"
		}
	},
	focused: {},
	notchedOutline: {}
};

const StyledInput = withStyles(styles)(OutlinedInput);

const SearchUser = ({ searchInput, setSearchInput }) => {
	const handleChange = (e) => {
		setSearchInput(e.target.value);
	};

	return (
		<div className="searchUser">
			<FormControl fullWidth>
				<StyledInput
					onChange={(e) => handleChange(e)}
					value={searchInput}
					placeholder="Search"
					startAdornment={
						<InputAdornment position="start">
							<SearchIcon style={{ color: "black" }} />
						</InputAdornment>
					}
				/>
			</FormControl>
		</div>
	);
};

export default SearchUser;
