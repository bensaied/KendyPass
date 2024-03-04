import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Slider from "@mui/material/Slider";
import MuiInput from "@mui/material/Input";
import VolumeUp from "@mui/icons-material/VolumeUp";

const Input = styled(MuiInput)`
  width: 40px;
`;

export default function InputSlider(params) {
  const [value, setValue] = React.useState(15);

  const handleSliderChange = (event, newValue) => {
    setValue(newValue);
  };
  React.useEffect(() => {
    params.setPasswordLen(value);
  }, [value]);
  const handleInputChange = (event) => {
    setValue(event.target.value === "" ? "" : Number(event.target.value));
  };

  const handleBlur = () => {
    if (value < 4) {
      setValue(4);
    } else if (value > 25) {
      setValue(25);
    }
  };
  function valuetext(value) {
    return `${value}`;
  }
  return (
    <Box sx={{ width: 250 }}>
      <Typography id="input-slider" gutterBottom>
        &nbsp;
      </Typography>
      <Grid container spacing={1} alignItems="center">
        <Typography
          variant="body1"
          component="p"
          id="input-slider"
          gutterBottom
        >
          Length
        </Typography>
        <Grid item xs>
          <Slider
            value={typeof value === "number" ? value : 0}
            onChange={handleSliderChange}
            aria-labelledby="input-slider"
            defaultValue={4}
            getAriaValueText={valuetext}
            step={1}
            min={4}
            max={25}
            valueLabelDisplay="auto"
          />
        </Grid>
        &nbsp; &nbsp;
        <Grid item>
          <Input
            value={value}
            onChange={handleInputChange}
            onBlur={handleBlur}
            inputProps={{
              type: "number",
              "aria-labelledby": "input-slider",
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
