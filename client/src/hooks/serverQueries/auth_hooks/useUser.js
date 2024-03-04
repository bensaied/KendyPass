import axios from "axios";
import { useMutation, useQuery, useQueryCache, queryCache } from "react-query";

const getUser = async () => {
  typeof window !== "undefined"
    ? (axios.defaults.headers.common = {
        Authorization: `bearer ${localStorage.accessToken}`,
      })
    : null;
  const { data } = await axios.get("http://localhost:5000/api/auth");
  return data;
};
export default function UseUser() {
  return useQuery("user", getUser);
}
