import axios from "axios";
import { useMutation, useQuery, useQueryCache, queryCache } from "react-query";
import { useRouter } from "next/router";
export default function useEditPassword(
  oldAppName,
  newAppName,
  login,
  password
) {
  const config = {
    headers: { "Content-type": "application/json" },
  };
  typeof window !== "undefined"
    ? (axios.defaults.headers.common = {
        Authorization: `bearer ${localStorage.accessToken}`,
      })
    : null;
    
  const router = useRouter();
  const body =
    oldAppName == newAppName
      ? JSON.stringify({ oldAppName, login, password })
      : JSON.stringify({ oldAppName, newAppName, login, password });
  return useMutation(
    () =>
      axios
        .put("http://localhost:5000/api/passwords", body, config)
        .then((res) => {
          //console.log(res.data.token);
          return res.data;
        }),
    // .catch(function (error) {
    //   if (error.response) {
    //     return error.data;
    //   }
    // }),
    {
      onSuccess: () => {
        router.push("/passwords");
        // queryCache.invalidateQueries("user");
        // console.log("sucess");
      },
    }
  );
}
