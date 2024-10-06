import React from "react";
import Messages from "./Messages";
import useModalLogic from "../hooks/useModalLogic";
import { GenerateIcon, InsertIcon, RegenerateIcon } from "@/assets/svg";
import "../popup/style.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Props for Modal component
interface IModalProps {
	closeModal: () => void;
}
interface IGenerateButtonProps {
	submitPrompt: () => void;
}
interface IInsertRegenarateButtonProps {
	handleInsertResponse: () => void;
	submitPrompt: () => void;
}

export const queryClient = new QueryClient();

const Modal: React.FC<IModalProps> = ({ closeModal }) => {
	const {
		isOpen,
		isExiting,
		aiResponse,
		userInput,
		chats,
		textareaRef,
		error,
		handleClickOutsideModal,
		handleUserInput,
		handleSubmitPrompt,
		handleInsertResponse,
		submitPrompt,
	} = useModalLogic(closeModal);

	return (
		<QueryClientProvider client={queryClient}>
			<div
				id="modal-bg"
				className={`fixed font-inter bg-zinc-700/50 top-0 z-[999] inset-0 h-screen w-screen flex items-center justify-center transition-opacity duration-300 ${
					isExiting ? "opacity-0" : isOpen ? "opacity-100" : "opacity-0"
				}`}
				onClick={handleClickOutsideModal}
			>
				<div
					className={`bg-[#F9FAFB] md:w-4/12 w-10/12 max-h-[50vh] rounded-lg py-4 px-6 flex flex-col relative shadow-2xl transition-transform duration-300 ${
						isExiting ? "scale-90 opacity-0" : "scale-100 opacity-100"
					}`}
				>
					{/* Message list */}
					<Messages chats={chats} />

					{/* Textarea for user input */}
					<textarea
						ref={textareaRef}
						value={userInput}
						onChange={handleUserInput}
						onKeyDown={handleSubmitPrompt}
						placeholder="Enter your Prompt"
						className="w-full px-5 py-6 rounded-lg focus:outline-none resize-none leading-6 bg-white shadow-inner border border-[#e2e5ee] text-[#4A5568]"
						rows={1}
					/>

					{/* Error message */}
					{error && <div className="text-red-500 text-md mt-2">{error}</div>}

					{/* Action buttons */}
					{aiResponse && !userInput ? (
						<InsertRegenarateButton
							handleInsertResponse={handleInsertResponse}
							submitPrompt={submitPrompt}
						/>
					) : (
						<GenerateButton submitPrompt={submitPrompt} />
					)}
				</div>
			</div>
		</QueryClientProvider>
	);
};

export default Modal;

const GenerateButton: React.FC<IGenerateButtonProps> = ({ submitPrompt }) => (
	<div className="flex gap-4 justify-end">
		<button
			onClick={submitPrompt}
			className="bg-[#3B82F6] text-white text-md my-4 px-4 py-2 rounded-md flex items-center gap-2"
		>
			<GenerateIcon />
			Generate
		</button>
	</div>
);

const InsertRegenarateButton: React.FC<IInsertRegenarateButtonProps> = ({
	handleInsertResponse,
	submitPrompt,
}) => (
	<div className="flex gap-4 justify-end">
		<button
			onClick={handleInsertResponse}
			className="bg-white text-gray-600 border border-gray-600 text-md my-4 px-4 py-1 rounded-md flex items-center gap-2"
		>
			<InsertIcon />
			Insert
		</button>

		<button
			onClick={submitPrompt}
			className="bg-[#3B82F6] text-white text-md my-4 px-4 py-1 rounded-md flex items-center gap-2"
		>
			<RegenerateIcon />
			Regenerate
		</button>
	</div>
);
