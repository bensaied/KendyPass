import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AccountChangePassword from "src/components/user/account/AccountChangePassword";

export default function ChangePassword() {
  return (
    <>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Change password</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <AccountChangePassword />
        </AccordionDetails>
      </Accordion>

    </>
  );
}
