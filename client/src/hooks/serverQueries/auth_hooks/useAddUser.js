import axios from "axios";
import { useMutation, useQuery, useQueryCache, queryCache } from "react-query";
import { useRouter } from "next/router";
import { set } from "lodash";
import FormData from "form-data";

export default function useAddUser(firstName, lastName, username, password, avatar) {

  const router = useRouter();

  const body = JSON.stringify({ firstName, lastName, username, password});
  let data = new FormData();
  if (avatar) {
    //  avatar.path += email.replace(/,/g, "-").replace(/@/g, "-");
  }
  avatar && data.append("avatar", avatar);
 
  data.append("body", body);

  const config = {
    headers: { "Content-type": "application/json" },
  };
  return useMutation(
    () =>
      axios
        .post("http://localhost:5000/api/users/adduser", data, config)
        .then((res) => {     
         
          //localStorage.setItem("accessToken", res.data.token);
          return res.data;
        }),
    // .catch(function (error) {
    //   if (error.response) {
    //     return error.data;
    //   }
    // }),
    {
      onSuccess: () => {
      router.push("/users");

        // queryCache.invalidateQueries("user");
        // console.log("sucess");
      },
    }
  );
}