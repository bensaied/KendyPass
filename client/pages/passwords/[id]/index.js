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
import PasswordEditForm from "src/components/_dashboard/password/PasswordEditForm";
import usePasswords from "src/hooks/serverQueries/passwords_hooks/usePasswords";
import withAuth from "src/routes/withAuth";

// ----------------------------------------------------------------------
function PageOne() {
  const { themeStretch } = useSettings();
  const router = useRouter();
  const pathname = router.pathname;
  const { id } = router.query;
  const { status, data, error, isFetching } = usePasswords();

  const password = data?.find((i) => i._id === id);
  return (
    <DashboardLayout>
      <Page title={"Password: " + password?.appName}>
        <Container maxWidth={themeStretch ? false : "lg"}>
          <HeaderBreadcrumbs
            key="password"
            heading={"Edit password"}
            links={[
              { name: "Dashboard", href: PATH_DASHBOARD.root },
              { name: "Passwords", href: PATH_DASHBOARD.passwords.list },
              { name: password?.appName },
            ]}
          />

          <PasswordEditForm id={id} />
        </Container>
      </Page>
    </DashboardLayout>
  );
}
export default withAuth(PageOne);
