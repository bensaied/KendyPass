import * as React from "react";
import Checkbox from "@mui/material/Checkbox";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

export default function FormControlLabelPosition({ state, setState }) {
  const handleChange = (event) => {
    setState({
      ...state,
      [event.target.name]: event.target.checked,
    });
  };
  const { upperCase, lowerCase, numbers, symbols } = state;
  return (
    <FormControl component="fieldset">
      <FormLabel component="legend">Password Criteria</FormLabel>
      <FormGroup aria-label="position" row>
        <FormControlLabel
          value="Uppercase"
          control={
            <Checkbox
              checked={upperCase}
              onChange={handleChange}
              name="upperCase"
            />
          }
          label="Uppercase"
          labelPlacement="Uppercase"
        />

        <FormControlLabel
          value="LowerCase"
          control={
            <Checkbox
              checked={lowerCase}
              onChange={handleChange}
              name="lowerCase"
            />
          }
          label="LowerCase"
          labelPlacement="LowerCase"
        />
        <FormControlLabel
          value="Numbers"
          control={
            <Checkbox
              checked={numbers}
              onChange={handleChange}
              name="numbers"
            />
          }
          label="Numbers"
          labelPlacement="Numbers"
        />
        <FormControlLabel
          value="Symbols"
          control={
            <Checkbox
              checked={symbols}
              onChange={handleChange}
              name="symbols"
            />
          }
          label="Symbols"
          labelPlacement="Symbols"
        />
      </FormGroup>
    </FormControl>
  );
}
