import { filter } from "lodash";
import { Icon } from "@iconify/react";
import plusFill from "@iconify/icons-eva/plus-fill";
import { sentenceCase } from "change-case";
import { useState, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
// material
// layouts
import DashboardLayout from "src/layouts/dashboard";
// hooks
import useSettings from "src/hooks/useSettings";
// material
import { useTheme } from "@material-ui/core/styles";
import {
  Card,
  Table,
  Stack,
  Avatar,
  Button,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
} from "@material-ui/core";
import { ToastContainer, toast } from "react-toastify";

// components
import Page from "src/components/Page";
import Label from "src/components/Label";
import Scrollbar from "src/components/Scrollbar";
import SearchNotFound from "src/components/SearchNotFound";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import { PATH_DASHBOARD } from "src/routes/paths";
import {
  UserListHead,
  UserListToolbar,
  UserMoreMenu,
} from "src/components/_dashboard/user/list";
import useUsers from "src/hooks/serverQueries/users_hooks/useUsers";
import Link from "next/link";
import UseUser from "src/hooks/serverQueries/auth_hooks/useUser";
import withAuth from "src/routes/withAuth";
import passwords from "pages/passwords";
// ----------------------------------------------------------------------

//const User = require("../../models/User");


const TABLE_HEAD = [
  { id: "firstName", label: "Name", alignRight: false },
  //{ id: "password", label: "Password", alignRight: false },
  //{ id: "role", label: "Role", alignRight: false },
  { id: "username", label: "Username", alignRight: false },
  { id: "status", label: "Status", alignRight: false },
  { id: "applications", label: "Applications", alignRight: false },
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(
      array,
      (_user) =>
        _user.firstName.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
        _user.lastName.toLowerCase().indexOf(query.toLowerCase()) !== -1 
    );
  }
  return stabilizedThis.map((el) => el[0]);
}





function PageOne() {
  const { themeStretch } = useSettings();
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState("asc");
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState("firstName");
  const [filterName, setFilterName] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const theme = useTheme();
  const { status, data, error, isFetching, isSuccess } = useUsers();


  
 


  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked && data) {
      const newSelecteds = data.map((n) => n._id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

  const filteredUsers =
    data && applySortFilter(data, getComparator(order, orderBy), filterName);
    
  const isUserNotFound = data && filteredUsers.length === 0;


  return (
    <DashboardLayout>
      <Page title="Users: List">
        <Container maxWidth={themeStretch ? false : "lg"}>
          <HeaderBreadcrumbs
            heading="Users List"
            links={[
              { name: "Dashboard", href: PATH_DASHBOARD.root },
              { name: "Users", href: PATH_DASHBOARD.users.list },
            ]}
            action={
              <Link href={PATH_DASHBOARD.users.new}>
                  <Button
                   variant="contained"
                    // component={RouterLink}

                    startIcon={<Icon icon={plusFill} />}
                   >
                   New User
                 </Button>
               </Link>
            }
          />{" "}
          {isSuccess ? (
            <Card>
              <UserListToolbar
                numSelected={selected.length}
                filterName={filterName}
                onFilterName={handleFilterByName}
                selectedItems={selected}
                setSelected={setSelected}
              />

              <Scrollbar>
                <TableContainer sx={{ minWidth: 800 }}>
                  <Table>
                    <UserListHead
                      order={order}
                      orderBy={orderBy}
                      headLabel={TABLE_HEAD}
                      rowCount={data.length}
                      numSelected={selected.length}
                      onRequestSort={handleRequestSort}
                      onSelectAllClick={handleSelectAllClick}
                    />
                    <TableBody>

                      
                      {filteredUsers 
                        .slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                        .map((row) => {
                          const {
                            _id,
                            firstName,
                            lastName,
                            username,                                          
                            role,
                            status,
                            passwords,
                            avatar,
                          } = row;
                          const name = firstName + " " + lastName;
                          const isItemSelected = selected.indexOf(_id) !== -1;

                          return (
                            <TableRow
                              hover
                              key={_id}
                              tabIndex={-1}
                              role="checkbox"
                              selected={isItemSelected}
                              aria-checked={isItemSelected}
                            >
                              <TableCell padding="checkbox">
                                <Checkbox
                                  checked={isItemSelected}
                                  onChange={(event) => handleClick(event, _id)}
                                />
                              </TableCell>
                              <TableCell
                                component="th"
                                scope="row"
                                padding="none"
                              >
                                <Stack
                                  direction="row"
                                  alignItems="center"
                                  spacing={2}
                                >
                                  <Avatar
                                    alt={name}
                                    src={
                                      avatar
                                        ? avatar[0] == "u"
                                          ? "http://localhost:5000/" + avatar
                                          : avatar
                                        : "static/mock-images/avatars/.jpg"
                                    }
                                  />
                                  <Typography variant="subtitle2" noWrap>
                                    {name}
                                  </Typography>
                                </Stack>
                              </TableCell>

                              {/* <TableCell align="left">{role}</TableCell> */}

                            
                              <TableCell align="left">{username}</TableCell>
                              
                                
                              <TableCell align="left">
                                <Label
                                  variant={
                                    theme.palette.mode === "light"
                                      ? "ghost"
                                      : "filled"
                                  }
                                  color={
                                    status === "INACTIVE"
                                      ? "error"
                                     : status === "ACTIVE"
                                      ? "success"
                                      : "default"
                                  }
                                >
                                  {sentenceCase(status)}
                                </Label>
                              </TableCell>



                              <TableCell align="left">
                              <Label
                                    variant={
                                      theme.palette.mode === "dark"
                                        ? "ghost"
                                        : "filled"
                                    }
                                    > 
                                     {passwords.map((pwds) => pwds.appName).join(', ')}
                                  </Label>
                              </TableCell>
                              


                              <TableCell align="right">
                                <UserMoreMenu
                                  onDelete={() => handleDeleteUser(_id)}
                                  id={_id}
                                />
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      {emptyRows > 0 && (
                        <TableRow style={{ height: 53 * emptyRows }}>
                          <TableCell colSpan={6} />
                        </TableRow>
                      )}
                    </TableBody>
                    {isUserNotFound && (
                      <TableBody>
                        <TableRow>
                          <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                            <SearchNotFound searchQuery={filterName} />
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    )}
                  </Table>
                </TableContainer>
              </Scrollbar>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={data.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Card>
          ) : null}
        </Container>
      </Page>{" "}
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
    </DashboardLayout>
  );
}

export default withAuth(PageOne);
