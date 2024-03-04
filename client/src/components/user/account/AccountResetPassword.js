import * as Yup from "yup";
import { useState } from "react";
//import { useSnackbar } from "notistack5";
import { useFormik, Form, FormikProvider } from "formik";
// material
import { Stack, Card, TextField, IconButton, InputAdornment } from "@material-ui/core";
import { Icon } from "@iconify/react";
import eyeFill from "@iconify/icons-eva/eye-fill";
import eyeOffFill from "@iconify/icons-eva/eye-off-fill";
import { LoadingButton } from "@material-ui/lab";
import useResetPassword from "src/hooks/serverQueries/passwords_hooks/useResetPassword";
// utils

// ----------------------------------------------------------------------


export default function AccountResetPassword() {
  //const { enqueueSnackbar } = useSnackbar();

  const [showPassword, setShowPassword] = useState(false);
  const [showPassword1, setShowPassword1] = useState(false);

  const ChangeResetSchema = Yup.object().shape({
    newPassword: Yup.string()
      .min(6, "Password must be at least 6 characters.")
      .required("New Password is required"),
    confirmNewPassword: Yup.string().oneOf(
      [Yup.ref("newPassword"), null],
      "Passwords must match."
    ),
  });

  const formik = useFormik({
    initialValues: {
      newPassword: "",
      confirmNewPassword: "",
    },
    validationSchema: ChangeResetSchema,
    onSubmit: async (values, { setSubmitting }) => {
      //await fakeRequest(500);
      setSubmitting(false);
      alert(JSON.stringify(values, null, 2));
      //enqueueSnackbar("Save success", { variant: "success" });
    },
  });

  const { errors, values, touched, isSubmitting, handleSubmit, getFieldProps } = formik;
  const useresetpassword = useResetPassword(values?.newPassword, values?.confirmNewPassword);
  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };
  const handleShowPassword1 = () => {
    setShowPassword1((show) => !show);
  };
  return (
    <>
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <Stack spacing={3} alignItems="flex-end">
          {useresetpassword.isSuccess ? (
          <Stack sx={{ my: 1 }} spacing={3}>
            <Alert severity="success">
             Password reseted successfully
            </Alert>
          </Stack>
            ) : null}

            <TextField
              {...getFieldProps("newPassword")}
              fullWidth
              autoComplete="on"
              type={showPassword ? "text" : "password"}
              label="New Password"
              error={Boolean(touched.newPassword && errors.newPassword)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleShowPassword} edge="end">
                      <Icon icon={showPassword ? eyeFill : eyeOffFill} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              helperText={
                (touched.newPassword && errors.newPassword) ||
                "Password must be minimum 6+"
              }
            />

            <TextField
              {...getFieldProps("confirmNewPassword")}
              fullWidth
              autoComplete="on"
              type={showPassword1 ? "text" : "password"}
              label="Confirm New Password"
              error={Boolean(
                touched.confirmNewPassword && errors.confirmNewPassword
              )}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleShowPassword1} edge="end">
                      <Icon icon={showPassword ? eyeFill : eyeOffFill} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              helperText={
                touched.confirmNewPassword && errors.confirmNewPassword
              }
            />

            <LoadingButton
              type="submit"
              variant="contained"
              loading={isSubmitting}
            >
              Reset password
              
            </LoadingButton>
          </Stack>
        </Form>
      </FormikProvider>
    </>
  );
}
