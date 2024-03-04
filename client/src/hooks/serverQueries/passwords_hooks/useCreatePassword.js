import axios from "axios";
import { useMutation, useQuery, useQueryCache, queryCache } from "react-query";
import { useRouter } from "next/router";

export default function useSignup(appName, login, password) {
  const config = {
    headers: { "Content-type": "application/json" },
  };
  const router = useRouter();

  typeof window !== "undefined"
    ? (axios.defaults.headers.common = {
        Authorization: `bearer ${localStorage.accessToken}`,
      })
    : null;
  const body = JSON.stringify({ appName, login, password });
  return useMutation(
    () =>
      axios
        .post("http://localhost:5000/api/passwords", body, config)
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
