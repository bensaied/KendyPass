import axios from "axios";
import { useMutation, useQuery, useQueryCache, queryCache } from "react-query";

const getPasswords = async () => {
  typeof window !== "undefined"
    ? (axios.defaults.headers.common = {
        Authorization: `bearer ${localStorage.accessToken}`,
      })
    : null;
  const { data } = await axios.get("http://localhost:5000/api/passwords/");
  return data;
};
export default function usePasswords() {
  return useQuery("passwords", getPasswords);
}
