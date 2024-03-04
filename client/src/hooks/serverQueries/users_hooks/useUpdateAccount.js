import axios from "axios";
import { useMutation, useQuery, useQueryClient, queryCache } from "react-query";
import FormData from "form-data";

export default function useUpdateAccount(firstName, lastName, username, currentpassword, newpassword, confirmnewpassword, avatar) {
  const queryClient = useQueryClient();

  typeof window !== "undefined"
    ? (axios.defaults.headers.common = {
        Authorization: `bearer ${localStorage.accessToken}`,
      })
    : null;
  const body = JSON.stringify({ firstName, lastName, username, currentpassword, newpassword, confirmnewpassword});
  //console.log(avatar);
  let data = new FormData();
  if (avatar) {
    //  avatar.path += email.replace(/,/g, "-").replace(/@/g, "-");
  }
  avatar && data.append("avatar", avatar);
 
  data.append("body", body);

  const config = {
    headers: {
      accept: "application/json",
      "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
    },
  };

  return useMutation(
    () =>
      axios
        .put("http://localhost:5000/api/users/me", data, config)
        .then((res) => {
          // for (let [key, value] of data.entries()) {
          //   console.log(key, value);
          // }
          //console.log(res.data.token);
          

          queryClient.invalidateQueries("user");
          
          return res.data;
        }),
    // .catch(function (error) {
    //   if (error.response) {
    //     return error.data;
    //   }
    // }),
    {
      onSuccess: () => {
        // queryCache.invalidateQueries("user");
        // console.log("sucess");
      },
    }
  );
}
