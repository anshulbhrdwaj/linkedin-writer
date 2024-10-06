import { useState, useLayoutEffect, useRef } from "react";
import { storage } from "wxt/storage";
import { IChat } from "../components/Messages";
import useGetMessages from "./useGetMessages";
import { usePostMessage } from "./usePostMessage";

// Custom hook to manage modal logic
// Provides functions and state for controlling the modal's lifecycle, handling user input,
// managing chat state, and inserting AI-generated responses into a LinkedIn input field.

const useModalLogic = (closeModal: () => void) => {
	// Modal state: determines whether the modal is open or in the process of closing.
	const [isOpen, setIsOpen] = useState(false);
	const [isExiting, setIsExiting] = useState(false);

	// AI-related state: tracks user input, chat history, aiIndex attribute and the current AI response.
	const [aiResponse, setAiResponse] = useState<IChat | null>(null);
	const [userInput, setUserInput] = useState("");
	const [chats, setChats] = useState<IChat[]>([]);
	const [aiIndex, setAiIndex] = useState<number | null>(null);

	// Reference to the textarea element.
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	// Api calls
	// const { data: chats, isLoading, error, refetch: refetchChats } = useGetMessages();
	// const postMessage = usePostMessage();

	// Listen for the message sent from the content script and update the aiIndex
	// useLayoutEffect(() => {
	// 	const unwatch = storage.watch<number>(
	// 		"local:aiIndex",
	// 		(newIndex, oldIndex) => {
	// 			console.log("Index changed:", { newIndex, oldIndex });
	// 		}
	// 	);

	// 	return () => unwatch();
	// }, []);

	// Opens the modal when the component is first rendered.
	useLayoutEffect(() => {
		setIsOpen(true);
	}, []);

	// Updates the AI response based on the latest chat message.
	useLayoutEffect(() => {
		if (chats.length === 0) return;

		const lastMessage = chats[chats.length - 1];
		setAiResponse(lastMessage.user ? null : lastMessage); // Set the AI response if the last message is from the AI
	}, [chats]);

	// Closes the modal with a brief animation delay.
	const handleModalClose = () => {
		setIsExiting(true);
		setTimeout(closeModal, 300); // Waits for the exit animation to complete.
	};

	// Closes the modal if the user clicks outside of it.
	const handleClickOutsideModal = (event: React.MouseEvent<HTMLDivElement>) => {
		if ((event.target as HTMLElement).id === "modal-bg") {
			handleModalClose();
		}
	};

	// Updates the user input and dynamically adjusts the textarea height.
	const handleUserInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
		setUserInput(event.target.value);

		const textarea = textareaRef.current;
		if (!textarea) return;

		// Adjusts textarea height based on content, capping at 7 rows.
		textarea.style.height = "auto";
		const maxHeight = 7 * 24; // Max height for 7 rows, assuming 24px line-height.
		textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`;
	};

	// Handles submitting the user's input as a prompt.
	const submitPrompt = () => {
		if (!userInput.trim()) return; // Prevents submission of empty inputs.

		const userMessage: IChat = {
			id: chats.length + 1,
			user: true,
			message: userInput,
		};

		const aiResponse: IChat = {
			id: chats.length + 2,
			user: false,
			message:
				"Thank you for the opportunity! If you have any more questions, feel free to ask.",
		};

		// Updates chat history with user input and AI response.
		// postMessage.mutate(userInput);
		setChats([...chats, userMessage, aiResponse]);
		setUserInput(""); // Clears the input field.
	};

	// Handles submitting the prompt when the Enter key is pressed (without Shift/Ctrl/Meta).
	const handleSubmitPrompt = (
		event: React.KeyboardEvent<HTMLTextAreaElement>
	) => {
		if (
			event.key === "Enter" &&
			!(event.shiftKey || event.ctrlKey || event.metaKey)
		) {
			event.preventDefault(); // Prevents the default behavior of Enter (e.g., new line).
			submitPrompt();
		}
	};

	// Inserts the AI response into LinkedIn's message input box.
	const handleInsertResponse = () => {
		if (!aiResponse) return; // Ensures that there is an AI response to insert.

		const linkedinInput = document.querySelector<HTMLDivElement>(
			`div.msg-form__contenteditable[contenteditable="true"][role="textbox"]` //[ai-index="${aiIndex}"]
		);
		const inputPlaceholder = document.querySelector(
			`div.msg-form__placeholder[aria-hidden='true']` //[ai-index="${aiIndex}"]
		);

		if (!linkedinInput) {
			console.error("Editable input element not found");
			return;
		}

		// Removes the placeholder and inserts the AI response.
		inputPlaceholder?.classList.remove("msg-form__placeholder");
		linkedinInput.innerHTML = `<p>${aiResponse.message}</p>`;
		linkedinInput.focus(); // Focuses the input for further user interaction.

		handleModalClose(); // Closes the modal after insertion.
		setUserInput(""); // Clears the input field.
	};

	return {
		isOpen,
		isExiting,
		aiResponse,
		userInput,
		chats,
		textareaRef,
		handleModalClose,
		handleClickOutsideModal,
		handleUserInput,
		submitPrompt,
		handleSubmitPrompt,
		handleInsertResponse,
	};
};

export default useModalLogic;
