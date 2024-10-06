// Background.ts
export default defineBackground(() => {
	chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
		// console.log("Received message:", message); // Log the message
		// if (message.action === "openModal") {
		// 	console.log(message.aiIndex);
		// }

		sendResponse({ success: true });

		return true;
	});
});
