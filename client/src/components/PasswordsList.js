import { useState, useEffect, useMemo } from "react";
// material
import {
  Button,
  Container,
  Grid,
  Skeleton,
  Link as Link1,
  Alert,
  Stack,
  Typography,
} from "@material-ui/core";
// redux
// routes
import { PATH_DASHBOARD } from "src/routes/paths";
// hooks
import useSettings from "src/hooks/useSettings";
// components
import Page from "src/components/Page";
import { PasswordCard } from "src/components/_dashboard/user/cards";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import { Icon } from "@iconify/react";
import plusFill from "@iconify/icons-eva/plus-fill";
import Link from "next/link";
import NextLink from "next/link";
import Pagination from "@mui/material/Pagination";
import usePasswords from "src/hooks/serverQueries/passwords_hooks/usePasswords";
import { CopyToClipboard } from "react-copy-to-clipboard";

// ----------------------------------------------------------------------

const SkeletonLoad = (
  <>
    {[...Array(8)].map((_, index) => (
      <Grid item xs={12} sm={6} md={4} key={index}>
        <Skeleton
          variant="rectangular"
          width="100%"
          sx={{ paddingTop: "50%", borderRadius: 2 }}
        />
      </Grid>
    ))}
  </>
);
let PageSize = 6;

export default function PasswordCards() {
  const [currentPage, setCurrentPage] = useState(1);
  const { status, data, error, isFetching } = usePasswords();

  const { themeStretch } = useSettings();

  const data1 = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * PageSize;
    const lastPageIndex = firstPageIndex + PageSize;
    return data?.slice(firstPageIndex, lastPageIndex);
  }, [currentPage, data]);

  useEffect(() => {
    data1;
  }, [data1]);
  const handleChange = (event, value) => {
    setCurrentPage(value);
  };
  return (
    <>
      <Page title="Passwords: List">
        <Container maxWidth={themeStretch ? false : "lg"}>
          <HeaderBreadcrumbs
            heading={"Passwords List"}
            links={[
              { name: "Dashboard", href: PATH_DASHBOARD.root },
              { name: "Passwords", href: PATH_DASHBOARD.passwords.list },
            ]}
            action={
              <Link href={PATH_DASHBOARD.passwords.new}>
                <Button
                  variant="contained"
                  //component={RouterLink}
                  startIcon={<Icon icon={plusFill} />}
                >
                  New password
                </Button>
              </Link>
            }
          />

          <Grid
            container
            spacing={3}
            justifyContent="center"
            alignItems="center"
          >
            {" "}
            {status == "loading" ? (
              SkeletonLoad
            ) : status == "error" ? null : data?.length === 0 ? (
              <Stack sx={{ my: 5 }} spacing={3}>
                <Alert severity="error">
                  There is no passwords,{" "}
                  <NextLink href={PATH_DASHBOARD.passwords.new}>
                    <Typography
                      variant="body"
                      style={{
                        ...{ display: "inline-block" },
                        ...{ fontWeight: "bold" },
                        ...{ textDecoration: "underline" },
                        ...{ cursor: "pointer" },
                      }}
                    >
                      {" "}
                      create one
                    </Typography>
                  </NextLink>
                </Alert>
              </Stack>
            ) : (
              data1?.map((password) => (
                <Grid key={password.id} item xs={12} sm={6} md={4}>
                  <PasswordCard key={password.id} password1={password} />
                </Grid>
              ))
            )}
          </Grid>
        </Container>{" "}
      </Page>

      {status != "success" ? null : data.length === 0 ? null : (
        <Pagination
          count={Math.ceil(data?.length / PageSize)}
          page={currentPage}
          onChange={handleChange}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            paddingTop: "2em",
          }}
        />
      )}
    </>
  );
}
