// ----------------------------------------------------------------------

function path(root, sublink) {
  return `${root}${sublink}`;
}

// export const ROOTS_DASHBOARD = "/dashboard";

// ----------------------------------------------------------------------

export const PATH_DASHBOARD = {
  root: "/passwords",
  passwords: {
    list: "/passwords",
    new: "/passwords/create",
  },
  users: {
    list: "/users",
    new: "/users/create",
  },
  changepwd : "/changepwd",
};
