import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { Container, Typography } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { Context } from "../context";

interface IProps {
  value: string;
  setValue: (value: string) => void;
}

function InputWithIcon(props: IProps) {
  return (
    <Box sx={{ "& > :not(style)": { m: 1 }, mt: 2, p: 1 }}>
      <Box sx={{ display: "flex", alignItems: "flex-end" }}>
        <AccountCircle sx={{ color: "action.active", mr: 1, my: 0.5 }} />
        <TextField
          id="input-with-sx"
          label="Wallet address"
          variant="standard"
          value={props.value}
          fullWidth
          onChange={(e) => props.setValue(e.target.value)}
        />
      </Box>
    </Box>
  );
}

export default function Settings() {
  const { loading, setLoading, whistleblowerApi } = React.useContext(Context);
  const [value, setValue] = React.useState("");
  async function handleAddWhistleBlower(event) {
    setLoading(true);
    await whistleblowerApi.addWhistleblower(value);
    setLoading(false);
    setValue("");
  }

  return (
    <Container
      sx={{
        display: "flex",
        margin: "auto",
        flexDirection: "column",
        flexWrap: "wrap",
        mt: 10,
      }}
      maxWidth="sm"
    >
      <Typography variant="h4">Add Whistleblower address </Typography>
      <InputWithIcon value={value} setValue={setValue} />
      <LoadingButton
        onClick={handleAddWhistleBlower}
        loading={loading}
        variant="contained"
        sx={{ mt: 2 }}
      >
        <span>Add</span>
      </LoadingButton>
    </Container>
  );
}
