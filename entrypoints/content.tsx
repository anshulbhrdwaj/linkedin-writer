// Content.ts
import "./popup/style.css";
import { storage } from "wxt/storage";
import { aiIcon } from "../assets/svg";
import ReactDOM from "react-dom/client";
import Modal from "./components/Modal";

// Constants for selector and icon positioning
const LINKEDIN_INPUT_SELECTOR =
	'div.msg-form__contenteditable[contenteditable="true"][role="textbox"]';
const AI_ICON_CONTAINER_CLASS = "ai-icon-container";
const AI_ICON_POSITION = {
	bottom: "10px",
	right: "10px",
};

// Main Content Script definition
export default defineContentScript({
	matches: ["*://*.linkedin.com/*"], // Only run on LinkedIn
	cssInjectionMode: "ui",

	async main(ctx) {
		const ui = await createUIWithShadowDOM(ctx); // Create UI
		setupLinkedInInputObserver(ui); // Set up observer for input fields
	},
});

// Helper Functions
async function createUIWithShadowDOM(ctx: any) {
	const ui: any = await createShadowRootUi(ctx, {
		name: "ai-extension-ui",
		position: "inline", // UI position
		onMount: (container) => setupReactApp(container, ui), // Initialize React app
		onRemove: (root?: ReactDOM.Root) => root?.unmount(), // Clean up on removal
	});
	return ui;
}

function setupReactApp(container: HTMLElement, ui: any) {
	const app = document.createElement("div"); // Create app container
	container.append(app);

	const root = ReactDOM.createRoot(app); // Create React root
	root.render(<Modal closeModal={() => ui.remove()} />); // Render modal
	return root;
}

function setupLinkedInInputObserver(ui: any) {
	const observer = new MutationObserver(() => handleInputFields(ui)); // Observe mutations in the document
	observer.observe(document.body, { childList: true, subtree: true }); // Observe entire body
}

function handleInputFields(ui: any) {
	const inputFields = document.querySelectorAll(LINKEDIN_INPUT_SELECTOR); // Select LinkedIn input fields

	// Attach focus and blur event listeners to each input field
	inputFields.forEach((inputField, index) => {
		const htmlInputField = inputField as HTMLElement; // Cast to HTMLElement
		htmlInputField.setAttribute("ai-index", String(index + 1)); // Set index
		htmlInputField.addEventListener(
			"focus",
			() => handleFocus(htmlInputField, ui, index + 1) // Handle focus event
		);
		htmlInputField.addEventListener("blur", handleBlur); // Handle blur event
	});
}

function handleFocus(inputField: HTMLElement, ui: any, index: number) {
	removeExistingIcons(); // Remove any existing icons

	const aiIconContainer = createAIIconElement(); // Create new AI icon
	inputField.style.position = "relative"; // Ensure relative positioning for absolute AI icon
	inputField.appendChild(aiIconContainer); // Append icon to input field

	// When AI icon is clicked, send the index to the React component via Chrome runtime API
	aiIconContainer.addEventListener("click", async () => {
		await storage.setItem("local:aiIndex", index);
		ui.mount();
	}); // Open UI on click
}

function handleBlur(event: FocusEvent) {
	const inputField = event.target as HTMLElement; // Get input field
	const aiIconContainer = inputField.querySelector(
		`.${AI_ICON_CONTAINER_CLASS}` // Find AI icon container
	);

	if (!aiIconContainer) return; // Exit if no icon found
	inputField.removeChild(aiIconContainer); // Remove icon on blur
}

function removeExistingIcons() {
	// Remove any existing AI icon containers from other input fields
	const existingIcons = document.querySelectorAll(
		`.${AI_ICON_CONTAINER_CLASS}`
	);
	existingIcons.forEach((icon) => icon.remove()); // Remove each icon
}

function createAIIconElement(): HTMLElement {
	const container = document.createElement("div"); // Create icon container
	container.className = AI_ICON_CONTAINER_CLASS; // Assign class
	Object.assign(container.style, {
		position: "absolute", // Positioning for the icon
		cursor: "pointer", // Pointer cursor on hover
		...AI_ICON_POSITION, // Apply position styles
	});
	container.innerHTML = aiIcon; // Set icon SVG
	return container; // Return the icon element
}
