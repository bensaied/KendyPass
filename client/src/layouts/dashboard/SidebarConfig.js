// routes
import { PATH_DASHBOARD } from "../../routes/paths";
// components
import SvgIconStyle from "../../components/SvgIconStyle";

// ----------------------------------------------------------------------

const getIcon = (name) => (
  <SvgIconStyle
    src={`/static/icons/navbar/${name}.svg`}
    sx={{ width: "100%", height: "100%" }}
  />
);

const getIcon1 = (name) => (
  <SvgIconStyle
    src={`/static/icons/navbar/${name}.svg`}
    sx={{ width: "90%", height: "90%" }}
  />
);

const getIcon2 = (name) => (
  <SvgIconStyle
    src={`/static/icons/navbar/${name}.svg`}
    sx={{ width: "80%", height: "80%" }}
  />
);

const ICONS = {
  addUser: getIcon2("add-user"),
  userlist: getIcon("customer"),
  safebox: getIcon1("safebox"),
  password: getIcon("secure"),
};

const sidebarConfig = [
  // Passwords
  // ----------------------------------------------------------------------
  {
    subheader: "Passwords",
    access: ["ADMIN", "USER"],
    items: [
      {
        title: "Passwords List",
        path: PATH_DASHBOARD.passwords.list,
        icon: ICONS.safebox,
      },
      {
        title: "Create password",
        path: PATH_DASHBOARD.passwords.new,
        icon: ICONS.password,
      },
    ],
  },

  // Users
  // ----------------------------------------------------------------------
  {
    subheader: "Users",
    access: ["ADMIN"],
    items: [
      {
        title: "Users list",
        path: PATH_DASHBOARD.users.list,
        icon: ICONS.userlist,
      },
       {
        title: "Create user",
        path: PATH_DASHBOARD.users.new,
        icon: ICONS.addUser,
      },
    ],
  },
];

export default sidebarConfig;
