import axios from "axios";
import { useMutation, useQuery, useQueryCache, queryCache } from "react-query";
import { useRouter } from "next/router";

export default function useSignup(firstName, lastName, username, password) {
  const config = {
    headers: { "Content-type": "application/json" },
  };
  const router = useRouter();

  const body = JSON.stringify({ firstName, lastName, username, password });
  return useMutation(
    () =>
      axios
        .post("http://localhost:5000/api/users", body, config)
        .then((res) => {
          //console.log(res.data.token);
          localStorage.setItem("accessToken", res.data.token);
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
