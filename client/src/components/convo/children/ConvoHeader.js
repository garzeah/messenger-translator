import React from "react";
import { Switch } from "@material-ui/core";

import DisplayAvatar from "../../DisplayAvatar";
import "../Convo.css";

const ConvoHeader = ({ currConvo, setOriginalLang }) => {
	return (
		<div className="convoHeader">
			<div>
				<DisplayAvatar
					id={currConvo._id}
					user={currConvo}
					width={6}
					height={6}
				/>
				<h2 style={{ marginLeft: "15px" }}>{currConvo.displayName}</h2>
			</div>
			<div>
				<p>Original Language</p>
				<Switch
					onChange={(e) => setOriginalLang(e.target.checked)}
					color="primary"
				/>
			</div>
		</div>
	);
};

export default ConvoHeader;
