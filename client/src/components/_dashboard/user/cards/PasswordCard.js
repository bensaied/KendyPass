import PropTypes from "prop-types";
import { Icon } from "@iconify/react";
import { useState } from "react";
import { alpha, styled } from "@material-ui/core/styles";
import {
  Box,
  Card,
  Grid,
  Button,
  Tooltip,
  Divider,
  Typography,
  IconButton,
} from "@material-ui/core";
// utils
import { fShortenNumber } from "src/utils/formatNumber";
//
import SvgIconStyle from "../../../SvgIconStyle";
import DialogSelect from "src/components/ShareDialog";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useDeletePassword from "src/hooks/serverQueries/passwords_hooks/useDeletePassword";
// ----------------------------------------------------------------------

const CARD_ICONS = [
  {
    name: "Edit",
    icon: <Icon key="edit" icon="clarity:edit-line" width={25} height={25} />,
  },
  {
    name: "Share",
    icon: (
      <Icon
        key="share"
        icon="ant-design:share-alt-outlined"
        width={25}
        height={25}
        color="#1877F2"
      />
    ),
  },
  {
    name: "Delete",
    icon: (
      <Icon
        key="delete"
        icon="fluent:delete-16-regular"
        width={25}
        height={25}
        color="#D7336D"
      />
    ),
  },
  ,
];

// ----------------------------------------------------------------------

PasswordCard.propTypes = {
  password1: PropTypes.object.isRequired,
};

export default function PasswordCard({ password1, ...other }) {
  const { appName, login, password, owner, shared, _id } = password1;
  const [copied, setCopied] = useState(false);
  const deletePassword = useDeletePassword(_id);
  const deleteIt = async (event) => {
    event.preventDefault();
    //console.log(_id);
    await deletePassword.mutate(_id);
    toast.dark("Password deleted successfully", {
      position: "bottom-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };
  const PASSWORD_ICONS = [
    {
      name: login,
      labelCopy: "Login Copied !",
      onHover: "Copy login",
      icon: (
        <Icon
          key="login"
          icon="carbon:user-filled"
          width={20}
          height={20}
          color="#D7336D"
        />
      ),
    },
    {
      name: password,
      labelCopy: "Password copied !",
      onHover: "Copy password",

      icon: (
        <Icon
          key="password"
          icon="fluent:key-20-filled"
          width={20}
          height={20}
          color="#1877F2"
        />
      ),
    },
    ,
  ];
  return (
    <Card {...other}>
      {/* <CardMediaStyle>
        <SvgIconStyle
          color="paper"
          src="/static/icons/shape-avatar.svg"
          sx={{
            width: 144,
            height: 62,
            zIndex: 10,
            bottom: -26,
            position: "absolute",
          }}
        />
        <Avatar
          alt={name}
          src={avatarUrl}
          sx={{
            width: 64,
            height: 64,
            zIndex: 11,
            position: "absolute",
            transform: "translateY(-50%)",
          }}
        />
        <CoverImgStyle alt="cover" src={cover} />
      </CardMediaStyle> */}
      <Typography variant="subtitle1" align="center" sx={{ mt: 6 }}>
        {appName}
      </Typography>
      <Typography
        variant="body2"
        align="center"
        sx={{ color: "text.secondary" }}
      >
        {login}
      </Typography>
      <Box sx={{ textAlign: "center", mt: 2, mb: 2.5 }}>
        {PASSWORD_ICONS.map((icons) => (
          <CopyToClipboard
            key={icons.name + _id}
            text={icons.name}
            onCopy={() =>
              toast.dark(icons.labelCopy, {
                position: "bottom-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              })
            }
          >
            <Tooltip title={icons.onHover}>
              <IconButton>{icons.icon}</IconButton>
            </Tooltip>
          </CopyToClipboard>
        ))}
      </Box>
      <Divider />
      <Grid container sx={{ py: 3, textAlign: "center" }}>
        <Grid item xs={6}>
          {" "}
          <Link href={/passwords/ + _id}>
            <Tooltip key={"Edit" + _id} title={"Edit"}>
              <IconButton>
                <Icon icon="clarity:edit-line" width={25} height={25} />
              </IconButton>
            </Tooltip>
          </Link>
        </Grid>

        {/* <DialogSelect /> */}

        <Grid item xs={6}>
          {" "}
          <Tooltip
            key={"delete" + _id}
            onClick={deleteIt}
           // key={"Delete"}
            title={"Delete"}
          >
            <IconButton>
              <Icon
                icon="fluent:delete-16-regular"
                width={25}
                height={25}
                color="#D7336D"
              />{" "}
            </IconButton>
          </Tooltip>
        </Grid>
      </Grid>
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </Card>
  );
}
