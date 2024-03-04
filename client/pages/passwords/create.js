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
import PasswordNewForm from "src/components/_dashboard/password/PasswordNewForm";
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
      <Page title="Password: Create a new password | KendyPass">
        <Container maxWidth={themeStretch ? false : "lg"}>
          <HeaderBreadcrumbs
            heading={"Create a new password"}
            links={[
              { name: "Dashboard", href: PATH_DASHBOARD.root },
              { name: "Passwords", href: PATH_DASHBOARD.passwords.list },
              { name: "New password" },
            ]}
          />

          <PasswordNewForm />
        </Container>
      </Page>
    </DashboardLayout>
  );
}
export default withAuth(PageOne);
