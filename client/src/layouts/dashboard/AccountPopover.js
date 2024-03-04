import { Icon } from "@iconify/react";
import { useRef, useState } from "react";
import homeFill from "@iconify/icons-eva/home-fill";
import personFill from "@iconify/icons-eva/person-fill";
import settings2Fill from "@iconify/icons-eva/settings-2-fill";

// next
import NextLink from "next/link";
// material
import { alpha } from "@material-ui/core/styles";
import {
  Box,
  Avatar,
  Button,
  Divider,
  MenuItem,
  Typography,
} from "@material-ui/core";
// components
import MenuPopover from "../../components/MenuPopover";
import { MIconButton } from "../../components/@material-extend";
import useUser from "src/hooks/serverQueries/auth_hooks/useUser";
import { useRouter } from "next/router";
import { QueryClient } from "react-query";


// ----------------------------------------------------------------------



//import * as winston from "winston";
//import BrowserConsole from 'winston-transport-browserconsole';
//const fs = __non_webpack_require__("fs");
//import winston from 'winston';



// ----------------------------------------------------------------------

const MENU_OPTIONS = [
  // { label: "Home", icon: homeFill, linkTo: "/" },
  // { label: "Profile", icon: personFill, linkTo: "#" },
  { label: "Settings", icon: settings2Fill, linkTo: "/profile" },
];

// ----------------------------------------------------------------------




/*const level = "info";
winston.configure({
    transports: [
        new BrowserConsole(
            {
                format: winston.format.simple(),
                level,
            },
        ),
    ],
});

winston.debug("info ", {a: 1, b: "two"});



//require('winston-mongodb');
const { createLogger, format, transports, config } = require('winston');
const { combine, timestamp, metadata, label, printf } = format;
const userLog = winston.createLogger({
  level: 'info',
  format: combine(
    //format.colorize(),
    //timestamp( {format: "HH:mm:ss" }),
    metadata(),
    format.json()
  ),
  transports: [
      //new transports.Console(),
      //new winston.transports.File(
      // { filename: 'combined.log',
      // level: 'info'
      // }),
      new winston.transports.MongoDB(
        { 
          db: 'mongodb://localhost:27017/KendyPass' ,
          level: 'info',
          options: { useUnifiedTopology: true },
          format: combine(
            //format.colorize(),
            //timestamp( {format: "HH:mm:ss" }),
            metadata(),
            format.json()
          ) 
        }),
    ]
});*/

export default function AccountPopover() {
  const { status, data, error, isFetching } = useUser();
  const anchorRef = useRef(null);
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const queryClient = new QueryClient();
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleLogOut = () => {
    localStorage.removeItem("accessToken");
    queryClient.clear();
    router.push("/");
///////////////////////////////////////////////////////////////////////LOG
  /*   userLog.info(
      'SignOut!',
     {
    });*/
////////////////////////////////////////////////////////////////////////LOG
  };
  return (
    <>
      <MIconButton
        ref={anchorRef}
        onClick={handleOpen}
        sx={{
          padding: 0,
          width: 44,
          height: 44,
          ...(open && {
            "&:before": {
              zIndex: 1,
              content: "''",
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              position: "absolute",
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.72),
            },
          }),
        }}
      >
        <Avatar
          alt="My Avatar"
          src={
            data
              ? data.avatar[0] == "u"
                ? "http://localhost:5000/" + data.avatar
                : data.avatar
              : "/static/mock-images/avatars/avatar_default.jpg"
          }
        />
      </MIconButton>

      <MenuPopover
        open={open}
        onClose={handleClose}
        anchorEl={anchorRef.current}
        sx={{ width: 220 }}
      >
        <Box sx={{ my: 1.5, px: 1.5 }}>
          <Typography variant="subtitle1" noWrap>
            {data?.firstName + " " + data?.lastName}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }} noWrap>
            <Typography display="inline" variant="subtitle2" noWrap> Username :</Typography> <Typography display="inline" variant="subtitle3"> {data?.username} </Typography>
          </Typography>
        </Box>

        <Divider sx={{ my: 1 }} />

        {MENU_OPTIONS.map((option) => (
          <NextLink key={option.label} href={option.linkTo}>
            <MenuItem
              onClick={handleClose}
              sx={{ typography: "body2", py: 1, px: 2.5 }}
            >
              <Box
                component={Icon}
                icon={option.icon}
                sx={{
                  mr: 2,
                  width: 24,
                  height: 24,
                }}
              />

              {option.label}
            </MenuItem>
          </NextLink>
        ))}

        <Box sx={{ p: 2, pt: 1.5 }}>
          <Button
            fullWidth
            color="inherit"
            onClick={handleLogOut}
            variant="outlined"
          >
            Logout
          </Button>
        </Box>
      </MenuPopover>
    </>
  );
}
