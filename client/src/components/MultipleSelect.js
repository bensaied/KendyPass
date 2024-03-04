import { useState } from "react";
// material
import {
  Box,
  Button,
  Dialog,
  Switch,
  DialogTitle,
  DialogActions,
  DialogContent,
  FormControlLabel,
  DialogContentText,
  OutlinedInput,
  InputLabel,
  MenuItem,
  FormControl,
  ListItemText,
  Select,
  Checkbox,
} from "@material-ui/core";

import { Grid, Tooltip, IconButton } from "@material-ui/core";
import { Icon } from "@iconify/react";
//import MultipleSelect from "./MultipleSelect";
// ----------------------------------------------------------------------
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const names = [
  "Oliver Hansen",
  "Van Henry",
  "April Tucker",
  "Ralph Hubbard",
  "Omar Alexander",
  "Carlos Abbott",
  "Miriam Wagner",
  "Bradley Wilkerson",
  "Virginia Andrews",
  "Kelly Snyder",
];
export default function MaxWidthDialog() {
  const [open, setOpen] = useState(false);
  const [fullWidth, setFullWidth] = useState(true);
  const [maxWidth, setMaxWidth] = useState("sm");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleMaxWidthChange = (event) => {
    setMaxWidth(event.target.value);
  };

  const handleFullWidthChange = (event) => {
    setFullWidth(event.target.checked);
  };
  const [age, setAge] = useState("");

  const handleClose = (event, reason) => {
    if (reason !== "backdropClick") {
      setOpen(false);
    }
  };
  const [personName, setPersonName] = useState([]);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      // On autofill we get a the stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };
  return (
    <>
      <Grid item xs={4}>
        <Tooltip key={"share"} title={"share"}>
          <IconButton onClick={handleClickOpen}>
            <Icon
              icon="ant-design:share-alt-outlined"
              width={25}
              height={25}
              color="#1877F2"
            ></Icon>
          </IconButton>
        </Tooltip>
      </Grid>

      <Dialog
        open={open}
        maxWidth={maxWidth}
        onClose={handleClose}
        fullWidth={fullWidth}
      >
        <DialogTitle>Share password</DialogTitle>
        <DialogContent>
          <DialogContentText>Share my password with: </DialogContentText>

          <Box
            component="form"
            noValidate
            sx={{
              margin: "auto",
              display: "flex",
              width: "fit-content",
              flexDirection: "column",
            }}
          >
            <FormControl
              sx={{
                mt: 2,
                minWidth: 250,
                maxWidth: 250,
              }}
            >
              <InputLabel htmlFor="max-width">usernames</InputLabel>
              <Select
                label="demo-multiple-checkbox-label"
                multiple
                autoFocus
                value={personName}
                onChange={handleChange}
                input={<OutlinedInput label="Usernames" />}
                renderValue={(selected) => selected.join(", ")}
                MenuProps={MenuProps}
                inputProps={{
                  name: "max-width",
                  id: "max-width",
                }}
              >
                {names.map((name) => (
                  <MenuItem key={name} value={name}>
                    <Checkbox checked={personName.indexOf(name) > -1} />
                    <ListItemText primary={name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button variant="contained">Save</Button>
          <Button onClick={handleClose} variant="outlined">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
