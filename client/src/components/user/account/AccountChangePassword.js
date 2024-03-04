import * as Yup from "yup";
import { useState } from "react";
//import { useSnackbar } from "notistack5";
import { useFormik, Form, FormikProvider } from "formik";
// material
import { LoadingButton } from "@material-ui/lab";
import useCurrentPwd from "src/hooks/serverQueries/auth_hooks/useCurrentPwd";
import { Icon } from "@iconify/react";
import eyeFill from "@iconify/icons-eva/eye-fill";
import eyeOffFill from "@iconify/icons-eva/eye-off-fill";
import {
  Stack,
  Alert,
  TextField,
  IconButton,
  InputAdornment,
} from "@material-ui/core";
// utils

// ----------------------------------------------------------------------

export default function AccountChangePassword() {
const [showPassword, setShowPassword] = useState(false);
const [showPassword1, setShowPassword1] = useState(false);
const [showPassword2, setShowPassword2] = useState(false);
  //const { enqueueSnackbar } = useSnackbar();


  const ChangePassWordSchema = Yup.object().shape({
    currentpassword: Yup.string()
    .required("Please enter your current password."),
    newpassword: Yup.string()
      .min(6, "Password must be at least 6 characters.")
      .required("New Password is required."),
      confirmnewpassword: Yup.string().oneOf(
      [Yup.ref("newpassword"), null],
      "Passwords must match."
    ),
  });

  const formik = useFormik({
    initialValues: {
      validateOnMount: true,  
      currentpassword: "",
      newpassword: "",
      confirmnewpassword: "",
    },
    
    validationSchema: ChangePassWordSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await usecurrentpwd.mutate(values.currentpassword,values.newpassword, values.confirmnewpassword);
      } catch (error) {
        setSubmitting(false);
      }

      /*
      //await fakeRequest(500);
      setSubmitting(false);
      alert(JSON.stringify(values, null, 2));
      //enqueueSnackbar("Save success", { variant: "success" });*/
    },

  });

  const { errors, values, touched, isSubmitting, handleSubmit, getFieldProps } = formik;
  const usecurrentpwd = useCurrentPwd(
    values?.currentpassword,
    values?.newpassword,
    values?.confirmnewpassword
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
    <>
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        {usecurrentpwd.isSuccess ? (
              <Stack sx={{ my: 1 }} spacing={3}>
                <Alert severity="success">
                  Password changed successfully.
                </Alert>
              </Stack>
            ) : null}
            {usecurrentpwd.isError ? (
              <Stack sx={{ my: 1 }} spacing={3}>
                <Alert severity="error">
                  {usecurrentpwd.error?.response?.data?.msg}
                  {usecurrentpwd.error?.response?.data?.errors?.map((item) => (
                    <>
                      -{item.msg}
                      <br />
                    </>
                  ))}{" "}
                </Alert>{" "}
              </Stack>
            ) : null}

          <Stack spacing={3} alignItems="flex-end">

          {errors.afterSubmit && (
            <Alert severity="error">{errors.afterSubmit}</Alert>
          )}

          {usecurrentpwd.isError && (
            <Alert severity="error">
              {usecurrentpwd.error?.response?.data?.errors?.map((item) => item.msg)}
            </Alert>
          )}


            <TextField
          
               {...getFieldProps("currentpassword")}
              fullWidth
              autoComplete="on"
              type={showPassword ? "text" : "password"}
              label="Current Password"
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
              helperText={
                (touched.currentpassword && errors.currentpassword) 
              }
            />



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
                "Password must be minimum 6+"
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

            <LoadingButton
              type="submit"
              variant="contained"
              loading={isSubmitting}
              disabled={!ChangePassWordSchema.isValid}
            >
              Change password
            </LoadingButton>
          </Stack>
        </Form>
      </FormikProvider>
    </>
  );
}
