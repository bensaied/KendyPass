import * as Yup from "yup";
import PropTypes from "prop-types";
import { useCallback, useState } from "react";
import { useSnackbar } from "notistack5";
import { useNavigate } from "react-router-dom";
import { Form, FormikProvider, useFormik } from "formik";
// material

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { LoadingButton } from "@material-ui/lab";
import IconButton from "@mui/material/IconButton";
import {
  Box,
  Card,
  Grid,
  Stack,
  Button,
  TextField,
  Alert,
  FormControlLabel,
} from "@material-ui/core";
import FilledInput from "@mui/material/FilledInput";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import { Icon } from "@iconify/react";
import eyeFill from "@iconify/icons-eva/eye-fill";
import closeFill from "@iconify/icons-eva/close-fill";
import eyeOffFill from "@iconify/icons-eva/eye-off-fill";
//
import PasswordCriteria from "./PasswordCriteria";
import PasswordLength from "./PasswordLength";
import generate from "./generatePassword";
import useEditPassword from "../../../hooks/serverQueries/passwords_hooks/useEditPassword";
// ----------------------------------------------------------------------
import usePasswords from "src/hooks/serverQueries/passwords_hooks/usePasswords";

export default function PasswordNewForm({ id }) {
  //const navigate = useNavigate();
  // const { enqueueSnackbar } = useSnackbar();*
  const [passwordLen, setPasswordLen] = useState();
  const { status, data, error, isFetching } = usePasswords();
  const password1 = data?.find((i) => i._id === id);

  const [state, setState] = useState({
    upperCase: true,
    lowerCase: true,
    numbers: true,
    symbols: true,
  });
  const { upperCase, lowerCase, numbers, symbols } = state;

  const [valuess, setValues] = useState({
    amount: "",
    password: "",
    showPassword: false,
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };
  const handleChange = (prop) => (event) => {
    setValues({ ...valuess, [prop]: event.target.value });
  };

  // const add = async (event) => {
  //   event.preventDefault();
  //   //console.log("yes");
  //   await handleSubmit;

  //   await editPassword.mutate(values.appName, values.login, values.password);
  // };
  const handleClickShowPassword = () => {
    setValues({
      ...valuess,
      showPassword: !valuess.showPassword,
    });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const NewUserSchema = Yup.object().shape({
    appName: Yup.string().required("Application name is required"),
    login: Yup.string().required("Login is required"),
    password: Yup.string().required("Password is required"),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      appName: password1?.appName,
      login: password1?.login,
      password: password1?.password,
    },
    validationSchema: NewUserSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        await editPassword.mutate(
          password1?.appName,
          values?.appName,
          values?.login,
          values?.password ? values?.password : password1?.password
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
    submitForm,
  } = formik;
  const editPassword = useEditPassword(
    password1?.appName,
    values?.appName,
    values?.login,
    values?.password
  );
  return (
    <>
      {editPassword.isError ? (
        <Stack sx={{ my: 1 }} spacing={3}>
          <Alert severity="error">
            {editPassword.error?.response?.data?.msg}
            {editPassword.error?.response?.data?.errors?.map((item) => (
              <>
                -{item.msg}
                <br />
              </>
            ))}{" "}
          </Alert>
        </Stack>
      ) : editPassword.isSuccess ? (
        <Stack sx={{ my: 1 }} spacing={3}>
          <Alert severity="success">Informations updated successfully</Alert>
        </Stack>
      ) : null}
      <FormikProvider value={formik}>
        <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={12}>
              <Card sx={{ p: 3 }}>
                <Stack spacing={3}>
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={{ xs: 3, sm: 2 }}
                  >
                    <TextField
                      fullWidth
                      label="Application name"
                      {...getFieldProps("appName")}
                      error={Boolean(touched.appName && errors.appName)}
                      helperText={touched.appName && errors.appName}
                    />
                  </Stack>

                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={{ xs: 3, sm: 2 }}
                  >
                    <TextField
                      fullWidth
                      label="Login"
                      {...getFieldProps("login")}
                      error={Boolean(touched.login && errors.login)}
                      helperText={touched.login && errors.login}
                    />
                  </Stack>
                </Stack>
              </Card>
            </Grid>
          </Grid>
        </Form>
        <br />
        <Form
          spacing={{ xs: 3, sm: 2, pt: 3 }}
          noValidate
          autoComplete="off"
          onSubmit={handleSubmit}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} md={12}>
              <Card sx={{ p: 3 }}>
                <Stack spacing={3}>
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={{ xs: 3, sm: 2 }}
                  >
                    <TextField
                      fullWidth
                      autoComplete="current-password"
                      type={showPassword ? "text" : "password"}
                      label="Password"
                      {...getFieldProps("password")}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={handleShowPassword} edge="end">
                              <Icon
                                icon={showPassword ? eyeFill : eyeOffFill}
                              />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      error={Boolean(touched.password && errors.password)}
                      helperText={touched.password && errors.password}
                    />
                  </Stack>
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={{ xs: 3, sm: 2 }}
                  >
                    <PasswordCriteria state={state} setState={setState} />
                    <PasswordLength setPasswordLen={setPasswordLen} />
                  </Stack>

                  <Box
                    sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}
                  >
                    <LoadingButton
                      //  type="submit"
                      variant="outlined"
                      //loading={isSubmitting}
                      onClick={() => {
                        // console.log(generate(6));
                        setFieldValue(
                          "password",
                          generate(
                            passwordLen,
                            upperCase,
                            lowerCase,
                            numbers,
                            symbols
                          )
                        );
                      }}
                    >
                      Generate password
                    </LoadingButton>
                  </Box>
                </Stack>
              </Card>
            </Grid>
          </Grid>
        </Form>
        <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
          <LoadingButton
            type="submit"
            variant="contained"
            onClick={handleSubmit}
            loading={isSubmitting}
          >
            Update Password
          </LoadingButton>
        </Box>
      </FormikProvider>
    </>
  );
}
