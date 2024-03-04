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
import UserAccount from "src/components/_dashboard/user/UserAccount";

import withAuth from "src/routes/withAuth";
// ----------------------------------------------------------------------
function PageOne() {
  const { themeStretch } = useSettings();
  const router = useRouter();
  const pathname = router.pathname;
  const { name } = router.query;
  const isEdit = pathname.includes("edit");

  return (
    <DashboardLayout>
      <Page title="My profile">
        <Container maxWidth={themeStretch ? false : "xl"}>
          <UserAccount />
        </Container>
      </Page>
    </DashboardLayout>
  );
}
export default withAuth(PageOne);
