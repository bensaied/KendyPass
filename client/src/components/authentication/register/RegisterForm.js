import * as Yup from "yup";
import { useState } from "react";
import { Icon } from "@iconify/react";
import { useSnackbar } from "notistack5";
import { useFormik, Form, FormikProvider, ErrorMessage } from "formik";
import eyeFill from "@iconify/icons-eva/eye-fill";
import closeFill from "@iconify/icons-eva/close-fill";
import eyeOffFill from "@iconify/icons-eva/eye-off-fill";
// material
import {
  Stack,
  TextField,
  IconButton,
  InputAdornment,
  Alert,
} from "@material-ui/core";
import { LoadingButton } from "@material-ui/lab";
// hooks
//import useAuth from "src/hooks/useAuth";
//import useIsMountedRef from "../../../hooks/useIsMountedRef";
//
import { MIconButton } from "src/components/@material-extend";
import useSignup from "src/hooks/serverQueries/auth_hooks/useSignup";
import { register } from "numeral";
// ----------------------------------------------------------------------

export default function RegisterForm() {
  //const { register } = useAuth();
  //  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] =
    useState(false);

  const RegisterSchema = Yup.object().shape({
    firstName: Yup.string()
      .min(2, "Too Short!")
      .max(25, "Too Long!")
      .matches(/^[A-Za-z ]*$/, "Please enter valid first name")
      .required("First name required"),
    lastName: Yup.string()
      .min(2, "Too Short!")
      .max(25, "Too Long!")
      .matches(/^[A-Za-z ]*$/, "Please enter valid last name")
      .required("Last name required"),
    username: Yup.string().required("Username is required"),
    password: Yup.string()
      .required("Please Enter your password")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^.&\*])(?=.{8,})/,
        "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
      ),
    passwordConfirmation: Yup.string().oneOf(
      [Yup.ref("password"), null],
      "Passwords must match"
    ),
  });

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      username: "",
      password: "",
      passwordConfirmation: "",
    },
    validationSchema: RegisterSchema,
    onSubmit: async (values, { setErrors, setSubmitting }) => {
      try {
        await registerUser.mutate(
          values.firstName,
          values.lastName,
          values.username,
          values.password
        );
        // await register(
        //   values.email,
        //   values.password,
        //   values.firstName,
        //   values.lastName
        // );
        // enqueueSnackbar("Register success", {
        //   variant: "success",
        //   action: (key) => (
        //     <MIconButton size="small" onClick={() => closeSnackbar(key)}>
        //       <Icon icon={closeFill} />
        //     </MIconButton>
        //   ),
        // });
        //   if (isMountedRef.current) {
        //     setSubmitting(false);
        //   }
      } catch (error) {
        //        console.log(error);
        setSubmitting(false);

        // if (isMountedRef.current) {
        //   console.log(error.message);
        //   setErrors({ afterSubmit: error.message });
        //   setSubmitting(false);
        // }
      }
    },
  });

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps, values } =
    formik;
  const registerUser = useSignup(
    values?.firstName,
    values?.lastName,
    values?.username,
    values?.password
  );

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          {errors.afterSubmit && (
            <Alert severity="error">{errors.afterSubmit}</Alert>
          )}

          {registerUser.isError && (
            <Alert severity="error">
              {registerUser.error?.response?.data?.errors?.map(
                (item) => item.msg
              )}
            </Alert>
          )}

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
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
          <TextField
            fullWidth
            autoComplete="username"
            type="username"
            label="Username"
            {...getFieldProps("username")}
            error={Boolean(touched.username && errors.username)}
            helperText={touched.username && errors.username}
          />
          <TextField
            fullWidth
            autoComplete="current-password"
            type={showPassword ? "text" : "password"}
            label="Password"
            {...getFieldProps("password")}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    edge="end"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    <Icon icon={showPassword ? eyeFill : eyeOffFill} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            error={Boolean(touched.password && errors.password)}
            helperText={touched.password && errors.password}
          />
          <TextField
            fullWidth
            type={showPasswordConfirmation ? "text" : "password"}
            label="Password confirmation"
            {...getFieldProps("passwordConfirmation")}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    edge="end"
                    onClick={() => setShowPasswordConfirmation((prev) => !prev)}
                  >
                    <Icon
                      icon={showPasswordConfirmation ? eyeFill : eyeOffFill}
                    />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            error={Boolean(
              touched.passwordConfirmation && errors.passwordConfirmation
            )}
            helperText={
              touched.passwordConfirmation && errors.passwordConfirmation
            }
          />
          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            Register
          </LoadingButton>
        </Stack>
      </Form>
    </FormikProvider>
  );
}
