import * as Yup from 'yup';
import { useState } from "react";
import { Icon } from "@iconify/react";
import PropTypes from 'prop-types';
import { useCallback } from 'react';
//import { useSnackbar } from 'notistack5';
import { useHistory } from 'react-router-dom';
import { Form, FormikProvider, useFormik } from 'formik';
import eyeOffFill from "@iconify/icons-eva/eye-off-fill";
import eyeFill from "@iconify/icons-eva/eye-fill";
import useAddUser from "src/hooks/serverQueries/auth_hooks/useAddUser";
// material
import { LoadingButton } from '@material-ui/lab';
import {
  Box,
  Card,
  Grid,
  Stack,
  Alert,
  Switch,
  TextField,
  IconButton,
  InputAdornment,
  Typography,
  FormHelperText,
  FormControlLabel
} from '@material-ui/core';

//import useSignup from "src/hooks/serverQueries/auth_hooks/useSignup";
// utils
import { fData } from 'src/utils/formatNumber';
import fakeRequest from 'src/utils/fakeRequest';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
//
import Label from 'src/components/Label';
import { UploadAvatar } from 'src/components/upload';
import { status } from 'nprogress';
//import countries from './countries';

// ----------------------------------------------------------------------

UserNewForm.propTypes = {
  isEdit: PropTypes.bool,
  currentUser: PropTypes.object
};

export default function UserNewForm({ isEdit, currentUser }) {
  const navigate = useHistory();
  //const { enqueueSnackbar } = useSnackbar();

  {/*const NewUserSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().required('Email is required').email(),
    phoneNumber: Yup.string().required('Phone number is required'),
    address: Yup.string().required('Address is required'),
    country: Yup.string().required('country is required'),
    company: Yup.string().required('Company is required'),
    state: Yup.string().required('State is required'),
    city: Yup.string().required('City is required'),
    role: Yup.string().required('Role Number is required'),
    avatarUrl: Yup.mixed().required('Avatar is required')
  });*/}

  const [image, setImage] = useState();
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] =
    useState(false);

  const NewUserSchema = Yup.object().shape({
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
    passwordConfirmation: Yup.string().required("Please confirm your password").oneOf(
      [Yup.ref("password"), null],
      "Passwords must match"
    ),
  });


  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      firstName: "",
      lastName: "",
      username: "",
      password: "",
      passwordConfirmation: "",

    
    },
    validationSchema: NewUserSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {

    //   try {
      
    //    // resetForm();
    //    console.log("hi")
    //     setSubmitting(false);
    //    // enqueueSnackbar(!isEdit ? 'Create success' : 'Update success', { variant: 'success' });
    //     navigate(PATH_DASHBOARD.users.list);
    //   } catch (error) {
    //     console.error(error);
    //     setSubmitting(false);
    //     setErrors(error);
    //   }
    // }
   
      try {
       await registerUser.mutate(
         values.firstName,
         values.lastName,
         values.username,
         values.password,
         image
         
        );
       
        await register(
          values.username,
          values.password,
          values.firstName,
          values.lastName,
          image
          
        );

        {useAddUser.isSuccess ? (
          <Stack sx={{ my: 1 }} spacing={3}>
            <Alert severity="success">
              User added successfully
            </Alert>
          </Stack>
        ) : null}
      /*  {useAddUser.isError ? (
          <Stack sx={{ my: 1 }} spacing={3}>
            <Alert severity="error">
              {useAddUser.error?.response?.data?.msg}
              {useAddUser.error?.response?.data?.errors?.map((item) => (
                <>
                  -{item.msg}
                  <br />
                </>
              ))}{" "}
            </Alert>{" "}
          </Stack>
        ) : null}*/
        enqueueSnackbar("Register success", {
          variant: "success",
          action: (key) => (
            <MIconButton size="small" onClick={() => closeSnackbar(key)}>
              <Icon icon={closeFill} />
            </MIconButton>
          ),
        });
          if (isMountedRef.current) {
            setSubmitting(false);
          }
     } catch (error) {
               console.log(error);
       setSubmitting(false);

        if (isMountedRef.current) {
          console.log(error.message);
          setErrors({ afterSubmit: error.message });
          setSubmitting(false);
        }
      }
   },
  });
  
  const { errors, values, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps } = formik;

  const registerUser = useAddUser(
    values?.firstName,
    values?.lastName,
    values?.username,
    values?.password,
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



return (
  <FormikProvider value={formik}>
    <Form autoComplete="off" noValidate onSubmit={handleSubmit}>

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

     <Grid container spacing={3}>
       <Grid item xs={12} md={4}>
            <Card sx={{ py: 10, px: 3 }}>
              {isEdit && (
                <Label
                  color={values.status !== 'active' ? 'error' : 'success'}
                  sx={{ textTransform: 'uppercase', position: 'absolute', top: 24, right: 24 }}
                >
                  {values.status}
                </Label>
              )}

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

              {isEdit && (
                <FormControlLabel
                  labelPlacement="start"
                  control={
                    <Switch
                      onChange={(event) => setFieldValue('status', event.target.checked ? 'banned' : 'active')}
                      checked={values.status !== 'active'}
                    />
                  }
                  label={
                    <>
                      <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                        Banned
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Apply disable account
                      </Typography>
                    </>
                  }
                  sx={{ mx: 0, mb: 3, width: 1, justifyContent: 'space-between' }}
                />
              )}

              {/*<FormControlLabel
                labelPlacement="start"
                control={<Switch {...getFieldProps('isVerified')} checked={values.isVerified} />}
               label={
                  <>
                    <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                      Email Verified
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Disabling this will automatically send the user a verification email
                    </Typography>
               </>
               }
                sx={{ mx: 0, width: 1, justifyContent: 'space-between' }}
              />*/}
            </Card>
          </Grid>

          <Grid item xs={12} md={8}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                {errors.afterSubmit && (
                <Alert severity="error">{errors.afterSubmit}</Alert>
               )}

       {/*{registerUser.isError && (
          <Alert severity="error">
            {registerUser.error?.response?.data?.errors?.map(
              (item) => item.msg
            )}
          </Alert>
        )}*/}

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
          //autoComplete="password"
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
          Create user
        </LoadingButton>
      </Stack>
      </Card>
     </Grid>
    </Grid>
   </Form>
  </FormikProvider>
);}


  /*const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: currentUser?.name || '',
      email: currentUser?.email || '',
      phoneNumber: currentUser?.phoneNumber || '',
      address: currentUser?.address || '',
      country: currentUser?.country || '',
      state: currentUser?.state || '',
      city: currentUser?.city || '',
      zipCode: currentUser?.zipCode || '',
      avatarUrl: currentUser?.avatarUrl || null,
      isVerified: currentUser?.isVerified || true,
      status: currentUser?.status,
      company: currentUser?.company || '',
      role: currentUser?.role || ''
    },
    validationSchema: NewUserSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        await fakeRequest(500);
        resetForm();
        setSubmitting(false);
        enqueueSnackbar(!isEdit ? 'Create success' : 'Update success', { variant: 'success' });
        navigate(PATH_DASHBOARD.user.list);
      } catch (error) {
        console.error(error);
        setSubmitting(false);
        setErrors(error);
      }
    }
  });*/

  /*const { errors, values, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps } = formik;

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        setFieldValue('avatarUrl', {
          ...file,
          preview: URL.createObjectURL(file)
        });
      }
    },
    [setFieldValue]
  );*/

  /*return (
    <FormikProvider value={formik}>
      <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card sx={{ py: 10, px: 3 }}>
              {isEdit && (
                <Label
                  color={values.status !== 'active' ? 'error' : 'success'}
                  sx={{ textTransform: 'uppercase', position: 'absolute', top: 24, right: 24 }}
                >
                  {values.status}
                </Label>
              )}

              <Box sx={{ mb: 5 }}>
                <UploadAvatar
                  accept="image/*"
                  file={values.avatarUrl}
                  maxSize={3145728}
                  onDrop={handleDrop}
                  error={Boolean(touched.avatarUrl && errors.avatarUrl)}
                  caption={
                    <Typography
                      variant="caption"
                      sx={{
                        mt: 2,
                        mx: 'auto',
                        display: 'block',
                        textAlign: 'center',
                        color: 'text.secondary'
                      }}
                    >
                      Allowed *.jpeg, *.jpg, *.png, *.gif
                      <br /> max size of {fData(3145728)}
                    </Typography>
                  }
                />
                <FormHelperText error sx={{ px: 2, textAlign: 'center' }}>
                  {touched.avatarUrl && errors.avatarUrl}
                </FormHelperText>
              </Box>

              {isEdit && (
                <FormControlLabel
                  labelPlacement="start"
                  control={
                    <Switch
                      onChange={(event) => setFieldValue('status', event.target.checked ? 'banned' : 'active')}
                      checked={values.status !== 'active'}
                    />
                  }
                  label={
                    <>
                      <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                        Banned
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Apply disable account
                      </Typography>
                    </>
                  }
                  sx={{ mx: 0, mb: 3, width: 1, justifyContent: 'space-between' }}
                />
              )}

              {/*<FormControlLabel
                labelPlacement="start"
                control={<Switch {...getFieldProps('isVerified')} checked={values.isVerified} />}
               label={
                  <>
                    <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                      Email Verified
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Disabling this will automatically send the user a verification email
                    </Typography>
               </>
               }
                sx={{ mx: 0, width: 1, justifyContent: 'space-between' }}
              />
            </Card>
          </Grid>

          <Grid item xs={12} md={8}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    label="First Name"
                    {...getFieldProps('name')}
                    error={Boolean(touched.name && errors.name)}
                    helperText={touched.name && errors.name}
                  />
                  <TextField
                    fullWidth
                    label="Email Address"
                    {...getFieldProps('email')}
                    error={Boolean(touched.email && errors.email)}
                    helperText={touched.email && errors.email}
                  />
                </Stack>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    {...getFieldProps('phoneNumber')}
                    error={Boolean(touched.phoneNumber && errors.phoneNumber)}
                    helperText={touched.phoneNumber && errors.phoneNumber}
                  />
                 {/* <TextField
                    select
                    fullWidth
                    label="Country"
                    placeholder="Country"
                    {...getFieldProps('country')}
                    SelectProps={{ native: true }}
                    error={Boolean(touched.country && errors.country)}
                    helperText={touched.country && errors.country}
                  >
                    <option value="" />
                    {countries.map((option) => (
                      <option key={option.code} value={option.label}>
                        {option.label}
                      </option>
                    ))}
                  </TextField>
                </Stack>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    label="State/Region"
                    {...getFieldProps('state')}
                    error={Boolean(touched.state && errors.state)}
                    helperText={touched.state && errors.state}
                  />
                  <TextField
                    fullWidth
                    label="City"
                    {...getFieldProps('city')}
                    error={Boolean(touched.city && errors.city)}
                    helperText={touched.city && errors.city}
                  />
                </Stack>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    label="Address"
                    {...getFieldProps('address')}
                    error={Boolean(touched.address && errors.address)}
                    helperText={touched.address && errors.address}
                  />
                  <TextField fullWidth label="Zip/Code" {...getFieldProps('zipCode')} />
                </Stack>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    label="Company"
                    {...getFieldProps('company')}
                    error={Boolean(touched.company && errors.company)}
                    helperText={touched.company && errors.company}
                  />
                  <TextField
                    fullWidth
                    label="Role"
                    {...getFieldProps('role')}
                    error={Boolean(touched.role && errors.role)}
                    helperText={touched.role && errors.role}
                  />
                </Stack>

                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                  <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                    {!isEdit ? 'Create User' : 'Save Changes'}
                  </LoadingButton>
                </Box>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </Form>
    </FormikProvider>
   );*/
