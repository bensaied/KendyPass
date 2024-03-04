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
export default function useResetPassword(
  newPassword, confirmNewPassword 
) {
  const config = {
    headers: { "Content-type": "application/json" },
  };
  const router = useRouter();

  const body = JSON.stringify({  newPassword, confirmNewPassword });
  return useMutation(
    () =>
      axios.post("http://localhost:5000/api/admin/resetpwd", body, config).then((res) => {
        //console.log(res.data.token);
        //localStorage.setItem("accessToken", res.data.token);
       
        return res.data;
      }),
    { 
      onSuccess: (res) => {
        
        router.push("/passwords");
        // queryCache.invalidateQueries("user");
        // // console.log("sucess");
      },
    }
  );
}
