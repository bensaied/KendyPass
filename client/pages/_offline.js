import { motion } from "framer-motion";
// next
import NextLink from "next/link";
// material
import { styled } from "@material-ui/core/styles";
import { Box, Button, Typography, Container } from "@material-ui/core";
// layouts
import LogoOnlyLayout from "src/layouts/LogoOnlyLayout";
// components
import { MotionContainer, varBounceIn } from "src/components/animate";
import Page from "src/components/Page";
import { PageNotFoundIllustration } from "src/assets";
import { useRouter } from "next/router";

// ----------------------------------------------------------------------

const RootStyle = styled(Page)(({ theme }) => ({
  display: "flex",
  minHeight: "100%",
  alignItems: "center",
  paddingTop: theme.spacing(15),
  paddingBottom: theme.spacing(10),
}));

// ----------------------------------------------------------------------

export default function OfflinePage() {
  const router = useRouter();

  return (
    <LogoOnlyLayout>
      <RootStyle title="404 Page Not Found | KendyPass">
        <Container>
          <MotionContainer initial="initial" open>
            <Box sx={{ maxWidth: 480, margin: "auto", textAlign: "center" }}>
              <motion.div variants={varBounceIn}>
                <Typography variant="h3" paragraph>
                  No Internet Connection{" "}
                </Typography>
              </motion.div>
              <Typography sx={{ color: "text.secondary" }}>
                You are not connected to the Internet.
                <br />
                Make sure WI-FI is on,Airplane Mode is off and try again.
              </Typography>
              <NextLink href={router.pathname}>
                <Button
                  sx={{ my: { xs: 1, sm: 1 } }}
                  size="large"
                  variant="contained"
                >
                  Retry{" "}
                </Button>
              </NextLink>
              <motion.div variants={varBounceIn}>
                <PageNotFoundIllustration
                  sx={{ height: 260, my: { xs: 1, sm: 1 } }}
                />
              </motion.div>
            </Box>
          </MotionContainer>
        </Container>
      </RootStyle>
    </LogoOnlyLayout>
  );
}
