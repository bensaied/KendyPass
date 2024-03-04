import axios from "axios";
import { useMutation, useQuery, useQueryCache, queryCache } from "react-query";
import { useRouter } from "next/router";

// function useLogin2(email, password) {
//   const config = {
//     headers: { "Content-type": "application/json" },
//   };
//   const body = JSON.stringify({ email, password });
//   return useQuery(
//     "token",
//     () => axios.post("/api/auth", body, config),
//     {
//       refetchOnWindowFocus: false,
//       enabled: false, // turned off by default, manual refetch is needed
//     }
//   );
// }
export default function useLogin(username, password) {
  const config = {
    headers: { "Content-type": "application/json" },
  };
  const router = useRouter();

  const body = JSON.stringify({ username, password });
  return useMutation(
    () =>
      axios.post("http://localhost:5000/api/auth", body, config).then((res) => {
        //console.log(res.data.token);
        localStorage.setItem("accessToken", res.data.token);
        return res.data;
      }),
    { 
      onSuccess: (res) => {
        if ( res.payload.user.status == "STANDBY" )
        {router.push("/changepwd");}
        else {router.push("/passwords");}
        // queryCache.invalidateQueries("user");
        // // console.log("sucess");
      },
    }
  );
}

// const login = ({ email, password }) => {
//   const config = {
//     headers: { "Content-type": "application/json" },
//   };
//   const body = JSON.stringify({ email, password });
// };
