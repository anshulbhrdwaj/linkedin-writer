import { useMutation } from "@tanstack/react-query";
import apiClient from "../constants/apiClient";

export const usePostMessage = () => {
	return useMutation({
		mutationFn: (message: string) =>
			apiClient
				.post("/messages", { message })
				.then((res) => res.data)
				.catch((err) => console.log(err)),
	});
};
