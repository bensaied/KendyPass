import { useState } from "react";
import * as Yup from "yup";
import PropTypes from "prop-types";
import { useCallback } from "react";
import { useSnackbar } from "notistack5";
import { Form, FormikProvider, useFormik } from "formik";
// material
import { LoadingButton } from "@material-ui/lab";
import {
  Box,
  Card,
  Grid,
  Stack,
  Select,
  TextField,
  Typography,
  FormHelperText,
  Container,
  Alert,
  InputAdornment,
  IconButton,
  InputLabel,
  NativeSelect,
} from "@material-ui/core";
import { Icon } from "@iconify/react";
import eyeFill from "@iconify/icons-eva/eye-fill";
import eyeOffFill from "@iconify/icons-eva/eye-off-fill";
import Page from "src/components/Page";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";

// utils
import { fData } from "src/utils/formatNumber";
import fakeRequest from "src/utils/fakeRequest";
// routes
import { PATH_DASHBOARD } from "src/routes/paths";
//
import Label from "../../Label";
import { UploadAvatar } from "../../upload";
//import countries from "./countries";
import useUser from "src/hooks/serverQueries/auth_hooks/useUser";
import ChangePassword from "./ChangePassword";
import useUpdateAccount from "src/hooks/serverQueries/users_hooks/useUpdateAccount";
import useSettings from "src/hooks/useSettings";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// ----------------------------------------------------------------------

export default function UserAccount() {
  //const navigate = useNavigate();
  // const { enqueueSnackbar } = useSnackbar();
  const { themeStretch } = useSettings();

  const { status, data, error, isFetching } = useUser();
  const [image, setImage] = useState();
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const NewUserSchema = Yup.object().shape({
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
    username: Yup.string().required("Username is required"),
    role: Yup.string().required("Role is required"),
    currentpassword: Yup.string().required("Current Password is required"),
    //newpassword: Yup.string().required("New Password is required"),
    //password: Yup.string().required("Password Number is required"),
    //avatar: Yup.mixed().required("Avatar is required"),
  });
  const d = new Date(data?.date);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      firstName: data?.firstName || "",
      lastName: data?.lastName || "",
      username: data?.username || "",
      currentpassword: data?.password || "",
      role: data?.role || "",
      registartion: d.toUTCString() || "",

      avatar: data?.avatar
        ? data?.avatar[0] == "u"
          ? "http://localhost:5000/" + data?.avatar
          : data?.avatar[0] == "/"
          ? data?.avatar
          : "public//static1//mock-images//avatars//default.png"
        : "public//static1//mock-images//avatars//default.png",

      status: data?.status,
    },
    validationSchema: NewUserSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        
        await updateAccount.mutate(
          values?.firstName,
          values?.lastName,
          values?.username,
          values?.currentpassword,
          values?.newpassword,
          values?.confirmnewpassword,
         // values?.role,
          image
        );

        // resetForm();
      } catch (error) {
        console.error(error);
        setSubmitting(false);
        setErrors(error);
      }
    },
  });

  const {
    errors,
    values,
    touched,
    handleSubmit,
    isSubmitting,
    setFieldValue,
    getFieldProps,
  } = formik;
  const updateAccount = useUpdateAccount(
    values?.firstName,
    values?.lastName,
    values?.username,
    values?.currentpassword,
    values?.newpassword,
    values?.confirmnewpassword,
    //values?.role,
    image
  );
 
  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      setImage(file);
      if (file) {
   
        setFieldValue("avatar", {
          ...file,
          preview: URL.createObjectURL(file),
        });
      }
    },
    [setFieldValue]
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

  return (
    <Page title="My profile">
      <Container maxWidth={themeStretch ? false : "lg"}>
        <HeaderBreadcrumbs
          heading={"My profile"}
          links={[
            { name: "Dashboard", href: PATH_DASHBOARD.root },
            { name: "My profile", href: PATH_DASHBOARD.users.list },
          ]}
        />
        <FormikProvider value={formik}>
          <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
            {updateAccount.isSuccess ? (
              <Stack sx={{ my: 1 }} spacing={3}>
                <Alert severity="success">
                  Informations updated successfully
                </Alert>
              </Stack>
            ) : null}
            {updateAccount.isError ? (
              <Stack sx={{ my: 1 }} spacing={3}>
                <Alert severity="error">
                  {updateAccount.error?.response?.data?.msg}
                  {updateAccount.error?.response?.data?.errors?.map((item) => (
                    <>
                      -{item.msg}
                      <br />
                    </>
                  ))}{" "}
                </Alert>{" "}
              </Stack>
            ) : null}
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Card sx={{ py: 10, px: 3 }}>
                  <Label
                    color={
                      values.status?.toLowerCase() === "active"
                        ? "success"
                        : values.status?.toLowerCase() === "inactive"
                        ? "default"
                        : "error"
                    }
                    sx={{
                      textTransform: "uppercase",
                      position: "absolute",
                      top: 24,
                      right: 24,
                    }}
                  >
                    {values.status}
                  </Label>

                  <Box sx={{ mb: 5 }}>
                    <UploadAvatar
                      accept="image/*"
                      file={values.avatar}
                      maxSize={3145728}
                      onDrop={handleDrop}
                      error={Boolean(touched.avatar && errors.avatar)}
                      caption={
                        <Typography
                          variant="caption"
                          sx={{
                            mt: 2,
                            mx: "auto",
                            display: "block",
                            textAlign: "center",
                            color: "text.secondary",
                          }}
                        >
                          Allowed *.jpeg, *.jpg, *.png, *.gif
                          <br /> max size of {fData(3145728)}
                        </Typography>
                      }
                    />
                    <FormHelperText error sx={{ px: 2, textAlign: "center" }}>
                      {touched.avatar && errors.avatar}
                    </FormHelperText>
                  </Box>

                  {/* <FormControlLabel
                labelPlacement="start"
                control={
                  <Switch
                    onChange={(event) =>
                      setFieldValue(
                        "status",
                        event.target.checked ? "banned" : "active"
                      )
                    }
                    checked={values.status !== "active"}
                  />
                }
                label={
                  <>
                    <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                      Banned
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                    >
                      Apply disable account
                    </Typography>
                  </>
                }
                sx={{
                  mx: 0,
                  mb: 3,
                  width: 1,
                  justifyContent: "space-between",
                }}
              /> */}

                  {/* 
              <FormControlLabel
                labelPlacement="start"
                control={
                  <Switch
                    {...getFieldProps("isVerified")}
                    checked={values.isVerified}
                  />
                }
                label={
                  <>
                    <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                      Email Verified
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                    >
                      Disabling this will automatically send the user a
                      verification email
                    </Typography>
                  </>
                }
                sx={{ mx: 0, width: 1, justifyContent: "space-between" }}
              /> */}
                </Card>
              </Grid>

              <Grid item xs={12} md={8}>
                <Card sx={{ p: 3 }}>
                  <Stack spacing={3}>
                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      spacing={{ xs: 3, sm: 2 }}
                    >
                      <TextField
                        fullWidth
                        label="First name"
                        {...getFieldProps("firstName")}
                        error={Boolean(touched.firstName && errors.firstName)}
                        helperText={touched.firstName && errors.firstName}
                      />
                      <TextField
                        fullWidth
                        label="Last name"
                        {...getFieldProps("lastName")}
                        error={Boolean(touched.lastName && errors.lastName)}
                        helperText={touched.lastName && errors.lastName}
                      />
                    </Stack>
                    {/* <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={{ xs: 3, sm: 2 }}
                >
                  <TextField
                    fullWidth
                    label="Role"
                    {...getFieldProps("role")}
                    error={Boolean(touched.role && errors.role)}
                    helperText={touched.role && errors.role}
                  />
                </Stack> */}
                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      spacing={{ xs: 3, sm: 2 }}
                    >
                      <TextField
                        fullWidth
                        label="Username"
                        {...getFieldProps("username")}
                        error={Boolean(touched.username && errors.username)}
                        helperText={touched.username && errors.username}
                      />
                      <TextField
                        fullWidth
                        disabled
                        label="Role"
                        {...getFieldProps("role")}
                        error={Boolean(touched.role && errors.role)}
                        helperText={touched.role && errors.role}
                      />
                    </Stack>{" "}
                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      spacing={{ xs: 3, sm: 2 }}
                    >
                      <TextField
                        fullWidth
                        disabled
                        label="Registration date"
                        {...getFieldProps("registartion")}
                        error={Boolean(
                          touched.registration && errors.registration
                        )}
                        helperText={touched.registration && errors.registration}
                      />
                    </Stack>

                    <TextField
                        required
                        fullWidth
                        label="Current Password"
                        type={showPassword ? "text" : "password"}
                        {...getFieldProps("currentpassword")}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton onClick={handleShowPassword} edge="end">
                                <Icon icon={showPassword ? eyeFill : eyeOffFill} />
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                        error={Boolean(touched.currentpassword && errors.currentpassword)}
                        helperText={touched.currentpassword && errors.currentpassword}
                      />

                       <Accordion>
                          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography>Change password</Typography>
                          </AccordionSummary>
                          <AccordionDetails>
                          <Stack spacing={2} alignItems="flex-end">
                                           <TextField
                                            {...getFieldProps("newpassword")}
                                            fullWidth
                                            autoComplete="on"
                                            type={showPassword1 ? "text" : "password"}
                                            label="New Password"
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
                                            helperText={
                                              (touched.newpassword && errors.newpassword) ||
                                              ""
                                            }
                                          /> 
                                          

                                          <TextField
                                            {...getFieldProps("confirmnewpassword")}
                                            fullWidth
                                            autoComplete="on"
                                            type={showPassword2 ? "text" : "password"}
                                            label="Confirm New Password"
                                            InputProps={{
                                              endAdornment: (
                                                <InputAdornment position="end">
                                                  <IconButton onClick={handleShowPassword2} edge="end">
                                                    <Icon icon={showPassword2 ? eyeFill : eyeOffFill} />
                                                  </IconButton>
                                                </InputAdornment>
                                              ),
                                            }}
                                            error={Boolean(
                                              touched.confirmnewpassword && errors.confirmnewpassword
                                            )}
                                            helperText={
                                              touched.confirmnewpassword && errors.confirmnewpassword
                                            }
                                          />
                                </Stack>
                          </AccordionDetails>
                        </Accordion>

                  {/* <ChangePassword /> */}
                    <Box
                      sx={{
                        mt: 3,
                        display: "flex",
                        justifyContent: "flex-end",
                      }}
                    >
                      <LoadingButton
                        type="submit"
                        variant="contained"
                        loading={isSubmitting}
                      >
                        Save Changes
                      </LoadingButton>
                    </Box>
                  </Stack>
                </Card>
              </Grid>
            </Grid>
          </Form>
        </FormikProvider>
      </Container>{" "}
    </Page>
  );
}
