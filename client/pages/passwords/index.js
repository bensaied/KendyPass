import { Container, Typography } from "@material-ui/core";
// layouts
import DashboardLayout from "src/layouts/dashboard";
// hooks
import useSettings from "src/hooks/useSettings";
// components
import Page from "src/components/Page";
import PasswordList from "src/components/PasswordsList";
import withAuth from "src/routes/withAuth";
// ----------------------------------------------------------------------
function PageOne() {
  const { themeStretch } = useSettings();

  return (
    <DashboardLayout>
      <Page title="Passwords | KendyPass">
        <Container maxWidth={themeStretch ? false : "xl"}>
          <PasswordList />
        </Container>
      </Page>
    </DashboardLayout>
  );
}

export default withAuth(PageOne);
