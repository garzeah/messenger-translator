import React from "react";

import DisplayAvatar from "../../DisplayAvatar";
import "../Convo.css";

const ConvoHeader = ({ currConvo }) => {
	return (
		<div className="convoHeader">
			<DisplayAvatar id={currConvo._id} user={currConvo} width={6} height={6} />
			<h2 style={{ marginLeft: "15px" }}>{currConvo.displayName}</h2>
		</div>
	);
};

export default ConvoHeader;
