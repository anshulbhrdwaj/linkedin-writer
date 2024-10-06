/** @type {import('tailwindcss').Config} */
export default {
	content: [
		"./src/**/*.{js,jsx,ts,tsx}",
		"./entrypoints/**/*.html",
		"./entrypoints/**/*.css",
		"./entrypoints/**/*.js",
		"./entrypoints/**/*.ts",
		"./entrypoints/**/*.tsx",
	],
	extend: {
		fontFamily: {
			inter: ["Inter", "sans-serif"],
		},
	},
	plugins: [],
};
