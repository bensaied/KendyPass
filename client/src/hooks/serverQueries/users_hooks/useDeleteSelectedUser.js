import axios from "axios";
import { useMutation, useQuery, useQueryClient, queryCache } from "react-query";

export default function useDeleteSelectedUser(selectedUsers) {
  const queryClient = useQueryClient();

  const config = {
    headers: { "Content-type": "application/json" },
  };
  typeof window !== "undefined"
    ? (axios.defaults.headers.common = {
        Authorization: `bearer ${localStorage.accessToken}`,
      })
    : null;
  return useMutation(
    () => {
      selectedUsers.map((id) => {
        axios
          .delete("http://localhost:5000/api/admin/user/" + id, config)
          .then((res) => {
            //console.log(res.data.token);
            queryClient.invalidateQueries("users");
            return res.data;
          });
      });
    },
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