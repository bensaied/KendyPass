import PropTypes from "prop-types";
import { Icon } from "@iconify/react";
import { paramCase } from "change-case";
import { useRef, useState } from "react";
import editFill from "@iconify/icons-eva/edit-fill";
import trash2Outline from "@iconify/icons-eva/trash-2-outline";
import moreVerticalFill from "@iconify/icons-eva/more-vertical-fill";

// material
import {
  Menu,
  MenuItem,
  IconButton,
  ListItemIcon,
  ListItemText,
} from "@material-ui/core";
// routes
import { PATH_DASHBOARD } from "../../../../routes/paths";
import Link from "next/link";
import useDeleteUser from "src/hooks/serverQueries/users_hooks/useDeleteUser";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useMutation, useQuery, useQueryClient, queryCache } from "react-query";

// ----------------------------------------------------------------------

UserMoreMenu.propTypes = {
  onDelete: PropTypes.func,
  userName: PropTypes.string
};

export default function UserMoreMenu({ id }) {
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const deleteUser = useDeleteUser(id);
  const queryClient = useQueryClient();

  /*const onDelete = async (e) => {
    await deleteUser.mutate(id);
    queryClient.invalidateQueries("users");

    toast.dark("User deleted successfully", {
      position: "bottom-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };*/

  /*const Example = async () => {
    const [modalOpen, setModalOpen] = useState(false);
  
    const toggleModal = () => {
      // Opens Modal
      setModalOpen(!modalOpen);
    };
   
    const handleConfirm = () => { //confirm logic }
    const handleCancel = () => { //cancel logic }
  
  
  
    const modalStyle = {
      display: modalOpen ? "block" : "hidden",
    };
    */



  return (
    <>



    <Link href={PATH_DASHBOARD.users.list + "/" + id}>
      <IconButton title="Edit" ref={ref} onClick={() => setIsOpen(true)}>
        <Icon icon={editFill} width={20} height={20} /> 
      </IconButton>
    </Link>



    </>
    );
  }

     {/*< Menu
        open={isOpen}
        anchorEl={ref.current}
        onClose={() => setIsOpen(false)}
        PaperProps={{
          sx: { width: 200, maxWidth: "100%" },
        }}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Link href={PATH_DASHBOARD.users.list + "/" + id}>
        <MenuItem
            //component={RouterLink}
            sx={{ color: "text.secondary" }}
          >
            <ListItemIcon>
              <Icon icon={editFill} width={24} height={24} />
            </ListItemIcon>
            <ListItemText
              primary="Edit"
              primaryTypographyProps={{ variant: "body2" }}
            />
      </MenuItem>
      </Link>
        <MenuItem onClick={onDelete} sx={{ color: "text.secondary" }}>
          <ListItemIcon>
            <Icon icon={trash2Outline} width={24} height={24} />
          </ListItemIcon>
          <ListItemText
            primary="Delete"
            primaryTypographyProps={{ variant: "body2" }}
          />
      </MenuItem>
      </Menu>*/}