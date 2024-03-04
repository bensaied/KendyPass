import * as Yup from "yup";
import PropTypes from "prop-types";
import { useCallback } from "react";
import { useSnackbar } from "notistack5";
import { useNavigate } from "react-router-dom";
import { Form, FormikProvider, useFormik } from "formik";
// material
import { LoadingButton } from "@material-ui/lab";
import {
  Box,
  Card,
  Grid,
  Stack,
  Switch,
  TextField,
  Typography,
  FormHelperText,
  FormControlLabel,
} from "@material-ui/core";
// utils
import { fData } from "src/utils/formatNumber";
import fakeRequest from "src/utils/fakeRequest";
// routes
import { PATH_DASHBOARD } from "src/routes/paths";
//
import Label from "../../Label";
import { UploadAvatar } from "../../upload";
import countries from "./countries";
import useUser from "src/hooks/serverQueries/auth_hooks/useUser";

// ----------------------------------------------------------------------

UserNewForm.propTypes = {
  isEdit: PropTypes.bool,
  currentUser: PropTypes.object,
};

export default function UserNewForm() {
  //const navigate = useNavigate();
  // const { enqueueSnackbar } = useSnackbar();
  //const { status, data, error, isFetching } = useUser();

  const NewUserSchema = Yup.object().shape({
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
    username: Yup.string().required("Username is required"),
    //role: Yup.string().required("Role Number is required"),
    password: Yup.string().required("Password Number is required"),
    //avatar: Yup.mixed().required("Avatar is required"),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      firstName: "",
      lastName: "",
      username: "",
      password: "",
      passwordConfirmation: "",
      role: "USER",

      avatar: null,
    },
    validationSchema: NewUserSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
     try {
        await fakeRequest(500);
       resetForm();
        setSubmitting(false);
    //   enqueueSnackbar(!isEdit ? "Create success" : "Update success", {
    //   variant: "success",
      
        navigate(PATH_DASHBOARD.users.list);
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

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        setFieldValue("avatar", {
          ...file,
          preview: URL.createObjectURL(file),
        });
      }
    },
    [setFieldValue]
  );

  return (
    <FormikProvider value={formik}>
      <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
        {updateUser.isSuccess ? (
              <Stack sx={{ my: 1 }} spacing={3}>
                <Alert severity="success">
                  User added successfully
                </Alert>
              </Stack>
            ) : null}
            {updateUser.isError ? (
              <Stack sx={{ my: 1 }} spacing={3}>
                <Alert severity="error">
                  {updateUser.error?.response?.data?.msg}
                  {updateUser.error?.response?.data?.errors?.map((item) => (
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
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={{ xs: 3, sm: 2 }}
                >
                  <TextField
                    disabled
                    fullWidth
                    label="Role"
                    {...getFieldProps("role")}
                    error={Boolean(touched.role && errors.role)}
                    helperText={touched.role && errors.role}
                  />
                </Stack>
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
                </Stack>{" "}
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={{ xs: 3, sm: 2 }}
                >
                  <TextField
                    {...getFieldProps("password")}
                    fullWidth
                    autoComplete="on"
                    type="password"
                    label="Password"
                    error={Boolean(touched.password && errors.password)}
                    helperText={
                      (touched.password && errors.password) ||
                      "Password must be minimum 6+"
                    }
                  />

                  <TextField
                    {...getFieldProps("passwordConfirmation")}
                    fullWidth
                    autoComplete="on"
                    type="password"
                    label="Confirm  Password"
                    error={Boolean(
                      touched.passwordConfirmation &&
                        errors.passwordConfirmation
                    )}
                    helperText={
                      touched.passwordConfirmation &&
                      errors.passwordConfirmation
                    }
                  />
                </Stack>
            
                
                <Box
                  sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}
                >
                  <LoadingButton
                    type="submit"
                    variant="contained"
                    loading={isSubmitting}
                  >
                    create user
                  </LoadingButton>
                </Box>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </Form>
    </FormikProvider>
  );
}
