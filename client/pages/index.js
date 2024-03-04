import { capitalCase } from "change-case";

// material
import { styled } from "@material-ui/core/styles";
import {
  Box,
  Card,
  Stack,
  Link as Link1,
  Alert,
  Tooltip,
  Container,
  Typography,
  Button,
} from "@material-ui/core";
// routes

// layouts
import AuthLayout from "src/layouts/AuthLayout";
// components
import Page from "src/components/Page";
import { MHidden } from "src/components/@material-extend";
import { LoginForm } from "src/components/authentication/login";
import Link from "next/link";
import withOutAuth from "src/routes/withOutAuth";
// ----------------------------------------------------------------------

const RootStyle = styled(Page)(({ theme }) => ({
  [theme.breakpoints.up("md")]: {
    display: "flex",
  },
}));

const SectionStyle = styled(Card)(({ theme }) => ({
  width: "100%",
  maxWidth: 464,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  margin: theme.spacing(2, 0, 2, 2),
}));

const ContentStyle = styled("div")(({ theme }) => ({
  maxWidth: 480,
  margin: "auto",
  display: "flex",
  minHeight: "100vh",
  flexDirection: "column",
  justifyContent: "center",
  padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

function Login() {
  return (
    <RootStyle title="Login | KendyPass">
      <AuthLayout>
        {/* <Typography variant="body2" align="center" sx={{ mt: 3 }}>
          Don’t have an account? &nbsp;
            <Link href="/signup">
            <Link1 variant="subtitle2" component="button">
              Get started
            </Link1>
          </Link>
        </Typography> */}
      </AuthLayout>

      {/*<MHidden width="mdDown">
        <SectionStyle>
          <Typography variant="h3" sx={{ px: 5, mt: 10, mb: 5 }}>
            Hi, Welcome Back
          </Typography>
          <img src="/static/illustrations/illustration_login.png" alt="login" />
        </SectionStyle>
      </MHidden> */}
      <MHidden width="mdDown">
        <SectionStyle>
          <Typography variant="h2" sx={{ px: 5, mt: 10, mb: 0 }}>
            KendyPass
          </Typography>
          <Typography variant="h3" sx={{ px: 5, mt: 0, mb: 5 }}>
            No more forgotten passwords
          </Typography>
          <img src="/static/illustrations/illustration_login.png" alt="login" />
        </SectionStyle>
      </MHidden>
      <Container maxWidth="sm">
        <ContentStyle>
          <Stack direction="row" alignItems="center" sx={{ mb: 5 }}>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h4" gutterBottom>
                Sign in to KendyPass
              </Typography>
              <Typography sx={{ color: "text.secondary" }}>
                Enter your details below.
              </Typography>
            </Box>
          </Stack>

          {/* <Alert severity="info" sx={{ mb: 3 }}>
            Use email : <strong>demo@minimals.cc</strong> / password :
            <strong>&nbsp;demo1234</strong>
          </Alert> */}

          <LoginForm />

          {/* <MHidden width="smUp">
            <Typography variant="body2" align="center" sx={{ mt: 3 }}>
              Don’t have an account? &nbsp;
              <Link href="/signup">
                <Link1 variant="subtitle2" component="button">
                  Get started
                </Link1>
              </Link>
            </Typography>
        </MHidden> */}
        </ContentStyle>
      </Container>
    </RootStyle>
  );
}

export default withOutAuth(Login);
