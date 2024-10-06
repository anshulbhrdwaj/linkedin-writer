import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
	modules: ["@wxt-dev/module-react"],
	manifest: {
		name: "Linkedin Writter",
		description: "Linked in AI Writter",
		version: "1.0.0",
		icons: {
			16: "icon.png",
			32: "icon.png",
			48: "icon.png",
			96: "icon.png",
			128: "icon.png",
		},
		permissions: ["activeTab", "scripting", "storage"],
	},
});
