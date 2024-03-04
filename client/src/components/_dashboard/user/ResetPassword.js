import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AccountResetPassword from "src/components/user/account/AccountResetPassword";

export default function ResetPassword() {
  return (
    <>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Reset password</Typography>
        </AccordionSummary>
        <AccordionDetails>
        <AccountResetPassword />
        </AccordionDetails>
      </Accordion>
    </>
  );
}
