import React from "react";
import ConvoHeader from "./children/ConvoHeader";
import SendMessage from "./children/SendMessage";

const Conversation = () => {
	return (
		<div>
			<ConvoHeader />
			<p>Conversation</p>
			<SendMessage />
		</div>
	);
};

export default Conversation;
