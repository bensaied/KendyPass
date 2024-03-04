import { useState } from "react";
import { paramCase } from "change-case";
import { useParams, useLocation } from "react-router-dom";
import { useRouter } from "next/router";
import { PATH_DASHBOARD } from "src/routes/paths";

// material
import { Container } from "@material-ui/core"; // layouts
import DashboardLayout from "src/layouts/dashboard";
// hooks
import useSettings from "src/hooks/useSettings";
// components
import Page from "src/components/Page";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import UserEditForm from "src/components/_dashboard/user/UserEditForm";
import useUsers from "src/hooks/serverQueries/users_hooks/useUsers";
import withAuth from "src/routes/withAuth";

// ----------------------------------------------------------------------
function PageOne() {
  const { themeStretch } = useSettings();
  const router = useRouter();
  const pathname = router.pathname;
  const { id } = router.query;
  const { status, data, error, isFetching } = useUsers();
  const currentUser = data?.find((i) => i._id === id);
  //const { firstName, lastName } = currentUser;
  return (
    <DashboardLayout>
      <Page
        title={
          "Edit user: " + currentUser?.firstName + " " + currentUser?.lastName
        }
      >
        <Container maxWidth={themeStretch ? false : "lg"}>
          <HeaderBreadcrumbs
            heading={
              "Edit user: " +
              currentUser?.firstName.charAt(0).toUpperCase() +
              currentUser?.firstName.slice(1) +
              " " +
              currentUser?.lastName.toUpperCase()
            }
            links={[
              { name: "Dashboard", href: PATH_DASHBOARD.root },
              { name: "Users", href: PATH_DASHBOARD.users.list },
            ]}
          />

          <UserEditForm />
        </Container>
      </Page>
    </DashboardLayout>
  );
}
export default withAuth(PageOne);
