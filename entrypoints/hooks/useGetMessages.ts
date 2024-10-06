import { useQuery } from "@tanstack/react-query";
import apiClient from "../constants/apiClient";

const useGetMessages = () => {
	return useQuery({
		queryKey: ["messages"],
		queryFn: () =>
			apiClient
				.get("/messages")
				.then((res) => res.data)
				.catch((err) => console.log(err)),
	});
};

export default useGetMessages;
