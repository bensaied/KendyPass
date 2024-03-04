import * as Yup from "yup";
//import { useSnackbar } from "notistack5";
import { useFormik, Form, FormikProvider } from "formik";
// material
import { Stack, Card, TextField } from "@material-ui/core";
import { LoadingButton } from "@material-ui/lab";
// utils

// ----------------------------------------------------------------------

export default function AccountResetPassword() {
  //const { enqueueSnackbar } = useSnackbar();


  const ChangeResetSchema = Yup.object().shape({
    newPassword: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("New Password is required"),
    confirmNewPassword: Yup.string().oneOf(
      [Yup.ref("newPassword"), null],
      "Passwords must match"
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

  const { errors, touched, isSubmitting, handleSubmit, getFieldProps } = formik;

  return (
    <>
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <Stack spacing={3} alignItems="flex-end">

          <TextField
              {...getFieldProps("currentPassword")}
              fullWidth
              autoComplete="on"
              type="password"
              label="Current Password"
              error={Boolean(touched.currentPassword && errors.currentPassword)}
              helperText={
                (touched.currentPassword && errors.currentPassword) ||
                "Password must be minimum 6+"
              }
            />


            <TextField
              {...getFieldProps("newPassword")}
              fullWidth
              autoComplete="on"
              type="password"
              label="New Password"
              error={Boolean(touched.newPassword && errors.newPassword)}
              helperText={
                (touched.newPassword && errors.newPassword) ||
                "Password must be minimum 6+"
              }
            />

            <TextField
              {...getFieldProps("confirmNewPassword")}
              fullWidth
              autoComplete="on"
              type="password"
              label="Confirm New Password"
              error={Boolean(
                touched.confirmNewPassword && errors.confirmNewPassword
              )}
              helperText={
                touched.confirmNewPassword && errors.confirmNewPassword
              }
            />

            <LoadingButton
              type="submit"
              variant="contained"
              loading={isSubmitting}
            >
              Change password
            </LoadingButton>
          </Stack>
        </Form>
      </FormikProvider>
    </>
  );
}
