import axios from "axios";
import { useMutation, useQuery, useQueryCache, queryCache } from "react-query";

const getUsers = async () => {
  typeof window !== "undefined"
    ? (axios.defaults.headers.common = {
        Authorization: `bearer ${localStorage.accessToken}`,
      })
    : null;
  const { data } = await axios.get("http://localhost:5000/api/admin/all");
  return data;
};
export default function useUsers() {
  return useQuery("users", getUsers);
}
