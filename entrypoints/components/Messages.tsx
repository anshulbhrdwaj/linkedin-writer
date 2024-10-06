import React, { useLayoutEffect, useRef } from "react";
import { colors } from "../constants/colors";

export interface IChat {
	id: number;
	user: boolean;
	message: string;
}

const Messages = ({ chats }: { chats: IChat[] }) => {
	const shouldScroll = useRef(true);
	const messageEndRef = useRef<HTMLDivElement | null>(null);

	useLayoutEffect(() => {
		if (shouldScroll.current) {
			messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
			shouldScroll.current = false;
		}
	}, [chats]);

	return (
		<div className="flex-grow h-full flex flex-col overflow-y-auto">
			<div className="w-full flex-grow my-2 py-2 overflow-y-auto text-start">
				{chats?.map((chat) =>
					chat.user ? (
						<UserMessage key={chat.id} message={chat.message} />
					) : (
						<AiMessage key={chat.id} message={chat.message} />
					)
				)}
				<div ref={messageEndRef} />
			</div>
		</div>
	);
};

export default Messages;

const UserMessage = React.memo(({ message }: { message: string }) => {
	return (
		<div className="flex justify-end">
			<div
				className={`flex items-end w-3/4 bg-[#DFE1E7] m-1 rounded-xl rounded-br-none sm:w-3/4 max-w-xl md:w-auto`}
			>
				<div className="px-4 py-2">
					<div className={`text-[#666D80]`}>{message}</div>
				</div>
			</div>
		</div>
	);
});

const AiMessage = React.memo(({ message }: { message: string }) => {
	return (
		<div className="flex justify-start">
			<div
				className={`flex items-end w-3/4 bg-[#DBEAFE] m-1 rounded-xl rounded-bl-none sm:w-3/4 max-w-xl md:w-auto`}
			>
				<div className="px-4 py-2">
					<div className={`text-[#666D80]`}>{message}</div>
				</div>
			</div>
		</div>
	);
});
