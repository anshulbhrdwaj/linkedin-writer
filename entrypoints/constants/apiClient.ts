import axios from "axios";

export default axios.create({
	baseURL: "https://api.url.com/",
	headers: {
		"Content-Type": "application/json",
		Authorization: `Bearer ${import.meta.env.API_KEY}`,
	},
});
