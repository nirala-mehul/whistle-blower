import { useContext, useState } from "react";
import { Context } from "../context";
import MDEditor from "@uiw/react-md-editor";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import {
  Box,
  Button,
  Divider,
  IconButton,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { BACKEND_URL } from "../constants";
import ArrowUpward from "@mui/icons-material/ArrowUpward";
import ArrowDownward from "@mui/icons-material/ArrowDownward";
import {
  ArrowCircleDown,
  ArrowCircleUp,
  CancelOutlined,
  CheckCircleOutline,
} from "@mui/icons-material";
import { isAdmin } from "../utils";

export interface IEditorProps {
  value?: string;
  edit: boolean;
  onActionComplete?: () => void;
}

export const Editor = (props: IEditorProps) => {
  const { whistleblowerApi, currentAccount } = useContext(Context);
  const [value, setValue] = useState(props.value ?? "");
  const [loading, setLoading] = useState(false);

  async function handleCreateReport() {
    setLoading(true);
    // let compressed = deflateSync(value).toString("hex");
    let data = await fetch(
      BACKEND_URL + "/pseudonym?address=" + currentAccount?.address
    );
    console.log(data);

    setLoading(false);
    props?.onActionComplete();
    // whistleblowerApi.addReport()
  }

  const Action = () => {
    return props.edit ? (
      <LoadingButton
        onClick={handleCreateReport}
        loading={loading}
        variant="contained"
        sx={{ mt: 2 }}
      >
        <span>Send</span>
      </LoadingButton>
    ) : (
      <Box
        sx={{
          backgroundColor: "background.paper",
          py: 2,
        }}
      >
        <Button size="large" startIcon={<ArrowCircleUp />}>
          Upvote
        </Button>
        <Button startIcon={<ArrowCircleDown />}>Downvote</Button>

        {isAdmin(currentAccount) && (
          <Stack
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "flex-end",
              mt: -1,
            }}
            direction={"row"}
            spacing={3}
          >
            <Button
              variant="contained"
              size="medium"
              startIcon={<CheckCircleOutline />}
            >
              Accept
            </Button>
            <Button
              variant="outlined"
              size="medium"
              color="error"
              startIcon={<CancelOutlined />}
            >
              Reject
            </Button>
          </Stack>
        )}
      </Box>
    );
  };
  return (
    <Box sx={{ minWidth: 800, p: 3 }}>
      <Typography color="primary.main" sx={{ mb: 2 }} variant="h3">
        {props.edit ? "Blow the Whistle!" : "Whistle"}
      </Typography>
      <Divider />
      <div data-color-mode="light">
        {props.edit ? (
          <MDEditor
            textareaProps={{
              placeholder: "Please enter Markdown text",
            }}
            height={450}
            value={value}
            onChange={(val) => setValue(val)}
          />
        ) : (
          <Paper sx={{ p: 2, mt: 1 }} elevation={5}>
            <MDEditor.Markdown
              source={value}
              style={{ whiteSpace: "pre-wrap", height: 450 }}
            />
          </Paper>
        )}

        <Action />
      </div>
    </Box>
  );
};
