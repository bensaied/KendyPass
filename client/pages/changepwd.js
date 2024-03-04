import { capitalCase } from "change-case";
import * as Yup from "yup";
import { useFormik, Form, FormikProvider } from "formik";
import { useState , useEffect} from "react";
import { Icon } from "@iconify/react";
import eyeFill from "@iconify/icons-eva/eye-fill";
import eyeOffFill from "@iconify/icons-eva/eye-off-fill";
// material
import { alpha, styled } from "@material-ui/core/styles";
import {
  TextField,
  IconButton,
  InputAdornment,
  Toolbar,
  AppBar
} from "@material-ui/core";

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
import { LoadingButton } from "@material-ui/lab";

// routes
import { useRouter } from "next/router";
import { QueryClient } from "react-query";
// layouts
import AuthLayout from "src/layouts/AuthLayout";
// components
import Page from "src/components/Page";
import { MHidden } from "src/components/@material-extend";
import { LoginForm } from "src/components/authentication/login";
import AccountPopover from "../src/layouts/dashboard/AccountPopover";
import LogoutIcon from '@mui/icons-material/Logout';
import Link from "next/link";
import useChange from "src/hooks/serverQueries/auth_hooks/useChange"
import useUser from "src/hooks/serverQueries/auth_hooks/useUser";
import withAuth from "src/routes/withAuth";

// ----------------------------------------------------------------------


const DRAWER_WIDTH = 10;
const COLLAPSE_WIDTH = 102;
const APPBAR_MOBILE = 64;
const APPBAR_DESKTOP = 92;

// const RootStyle = styled(Page)(({ theme }) => ({
//   [theme.breakpoints.up("md")]: {
//     display: "flex",
//   },
// }));
const RootStyle = styled(AppBar)(({ theme }) => ({
  boxShadow: "none",
  backdropFilter: "blur(6px)",
  WebkitBackdropFilter: "blur(6px)", // Fix on Mobile
  backgroundColor: alpha(theme.palette.background.default, 0.72),
  [theme.breakpoints.up("lg")]: {
    width: `calc(100% - ${DRAWER_WIDTH}px)`,
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
const HeaderStyle = styled("header")(({ theme }) => ({

 
  minHeight: APPBAR_DESKTOP,
  [theme.breakpoints.up("lg")]: {
    minHeight: APPBAR_DESKTOP,

    padding: theme.spacing( 0, 5),
    
  },
}));


const ToolbarStyle = styled(Toolbar)(({ theme }) => ({
  minHeight: APPBAR_MOBILE,
  [theme.breakpoints.up("lg")]: {
    minHeight: APPBAR_DESKTOP,
    padding: theme.spacing(0, 5),
  },
}));
// ----------------------------------------------------------------------

function ChangePwd() {
 
  const [logout, setLogout] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  const ChangeSchema = Yup.object().shape({
    oldpassword: Yup.string().required("Old Password is required"),
    newpassword: Yup.string().required("New Password is required"),
    confirmpassword: Yup.string().required("Confirm Password is required"),
  });



  const { status, data, error, isFetching } = useUser();

  const formik = useFormik({
    initialValues: {
      oldpassword: "",
      newpassword: "",
      confirmpassword: "",
    },
    validationSchema: ChangeSchema,

    onSubmit: async (values, { setErrors, setSubmitting }) => {
      try {
        await changePwd.mutate(values.oldpassword, values.newpassword, values.confirmpassword);
      } catch (error) {
        setSubmitting(false);
      }
    },
  });
  const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps } = formik;
  const changePwd = useChange(
    values?.oldpassword,
     values?.newpassword,
      values?.confirmpassword
      );
      

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };
  const handleShowPassword1 = () => {
    setShowPassword1((show) => !show);
  };
  const handleShowPassword2 = () => {
    setShowPassword2((show) => !show);
  };


    const router = useRouter();
    const queryClient = new QueryClient();

  const handleLogOut = () => {
    localStorage.removeItem("accessToken");
    queryClient.clear();
    router.push("/");

  };



  return (
    <Page title="Change Password | KendyPass">
      
    <RootStyle title="Change Password | KendyPass">

      {/* <AuthLayout> */}
         {/*<Typography variant="body2" align="center" sx={{ mt: 3 }}>
          Don’t have an account? &nbsp;
            <Link href="/signup">
            <Link1 variant="subtitle2" component="button">
              Get started
            </Link1>
          </Link>
        </Typography>  */}
      {/* </AuthLayout> */}

       {/*<MHidden width="mdDown">
        <SectionStyle>
          <Typography variant="h3" sx={{ px: 5, mt: 10, mb: 5 }}>
            Hi, Welcome Back
          </Typography>
          <img src="/static/illustrations/illustration_login.png" alt="login" />
        </SectionStyle>
      </MHidden> */}


      {/* <MHidden width="mdDown">
        <SectionStyle>
          <Typography variant="h2" sx={{ px: 5, mt: 10, mb: 0 }}>
            KendyPass
          </Typography>
          <Typography variant="h3" sx={{ px: 5, mt: 0, mb: 5 }}>
            No more forgotten passwords
          </Typography>
          <img src="/static/illustrations/illustration_login.png" alt="login" />
        </SectionStyle>
      </MHidden> */}

      <Stack
         direction="row"
         alignItems="center"
         spacing={{ xs: 0.5, sm: 2.5 }}
      >
       <AuthLayout></AuthLayout>
       </Stack> 

      <ToolbarStyle>
        <Box  sx={{ flexGrow: 1 }} />
        <Stack
          direction="row"
          alignItems="center"
          spacing={{ xs: 0.5, sm: 2.5 }}
        >
          <Button             
          type="button" title="Logout" onClick={handleLogOut}        
           >
          <LogoutIcon/>
         </Button>
        </Stack>
      </ToolbarStyle> 


      <Container maxWidth="sm">
        <ContentStyle>
        <Stack direction="row" alignItems="center" sx={{ mb: 5 }}>
            <Box sx={{ flexGrow: 1 }}>
              <Typography sx={{ color: "text.primary" }} variant="h4" gutterBottom>
                Welcome {data?.firstName} to KendyPass
              </Typography>
              <Typography sx={{ color: "text.secondary" }}>
                Change your password.
              </Typography>
            </Box>
          </Stack>

          {/* <Alert severity="info" sx={{ mb: 3 }}>
            Use email : <strong>demo@minimals.cc</strong> / password :
            <strong>&nbsp;demo1234</strong>
          </Alert> */}

         <FormikProvider value={formik}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
           <Stack sx={{ my: 2 }} spacing={3}>
          {errors.afterSubmit && (
            <Alert severity="error">{errors.afterSubmit}</Alert>
          )}

          {changePwd.isError && (
            <Alert severity="error">
              {changePwd.error?.response?.data?.errors?.map((item) => item.msg)}
            </Alert>
          )}
          
          <TextField
            fullWidth
            autoComplete="oldpassword"
            type={showPassword ? "text" : "password"}
            label="Old Password"
            {...getFieldProps("oldpassword")}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleShowPassword} edge="end">
                    <Icon icon={showPassword ? eyeFill : eyeOffFill} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            error={Boolean(touched.oldpassword && errors.oldpassword)}
            helperText={touched.oldpassword && errors.oldpassword}
          />

          <TextField
            fullWidth
            autoComplete="newpassword"
            type={showPassword1 ? "text" : "password"}
            label="New Password"
            {...getFieldProps("newpassword")}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleShowPassword1} edge="end">
                    <Icon icon={showPassword1 ? eyeFill : eyeOffFill} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            error={Boolean(touched.newpassword && errors.newpassword)}
            helperText={touched.newpassword && errors.newpassword}
          />


            <TextField
            fullWidth
            autoComplete="confirmpassword"
            type={showPassword2 ? "text" : "password"}
            label="Confirm Password"
            {...getFieldProps("confirmpassword")}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleShowPassword2} edge="end">
                    <Icon icon={showPassword2 ? eyeFill : eyeOffFill} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            error={Boolean(touched.confirmpassword && errors.confirmpassword)}
            helperText={touched.confirmpassword && errors.confirmpassword}
          />
        </Stack>

        <LoadingButton
          title="Change Password"
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting}
         
        >
          Change
        </LoadingButton>
      </Form>
    </FormikProvider>

 
        </ContentStyle>
      </Container>
    </RootStyle>
    </Page>
  );
}

export default withAuth(ChangePwd);
