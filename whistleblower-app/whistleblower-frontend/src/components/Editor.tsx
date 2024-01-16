import { useContext, useState } from "react";
import { Context } from "../context";
import MDEditor from "@uiw/react-md-editor";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import {
  Box,
  Divider,
  Typography,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";

export interface IEditorProps {
  value?: string;
  onActionComplete?: () => void;
}

export const Editor = (props: IEditorProps) => {
  const {
    whistleblowerApi,
    psuedoID,
    loading,
    setLoading,
    updateContractState,
  } = useContext(Context);
  const [value, setValue] = useState(props.value ?? "");

  async function handleCreateReport() {
    setLoading(true);
    await whistleblowerApi.addReport(
      value,
      psuedoID.publicKey,
      psuedoID.psuedonym
    );
    updateContractState();
    setLoading(false);
    props?.onActionComplete();
  }

  const Action = () => {
    return (
      <LoadingButton
        onClick={handleCreateReport}
        loading={loading}
        variant="contained"
        sx={{ mt: 2 }}
      >
        <span>Send</span>
      </LoadingButton>
    );
  };
  return (
    <Box sx={{ minWidth: 800, p: 3 }}>
      <Typography color="primary.main" sx={{ mb: 2 }} variant="h3">
        Blow the Whistle!
      </Typography>
      <Divider />
      <div data-color-mode="light">
        <MDEditor
          textareaProps={{
            placeholder: "Please enter Markdown text",
          }}
          height={450}
          value={value}
          onChange={(val) => setValue(val)}
        />
        <Action />
      </div>
    </Box>
  );
};
