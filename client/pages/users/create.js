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
import UserNewForm from "src/components/user/UserNewForm";
import withAuth from "src/routes/withAuth";

// ----------------------------------------------------------------------
function PageOne() {
  const { themeStretch } = useSettings();
  const router = useRouter();
  const pathname = router.pathname;
  const { name } = router.query;
  //

  return (
    <DashboardLayout>
      <Page title="User: Create a new user | KendyPass">
        <Container maxWidth={themeStretch ? false : "lg"}>
          <HeaderBreadcrumbs
            heading={"Create a new user"}
            links={[
              { name: "Dashboard", href: PATH_DASHBOARD.root },
              { name: "Users", href: PATH_DASHBOARD.users.list },
              { name: "New user" },
            ]}
          />

          <UserNewForm />
        </Container>
      </Page>
    </DashboardLayout>
  );
}
export default withAuth(PageOne);
