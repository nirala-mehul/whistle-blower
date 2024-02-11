import { useContext } from "react";
import { Context } from "../context";
import MDEditor from "@uiw/react-md-editor";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import { Box, Button, Divider, Paper, Stack, Typography } from "@mui/material";
import {
  ArrowCircleDown,
  ArrowCircleUp,
  CancelOutlined,
  CheckCircleOutline,
} from "@mui/icons-material";
import { isAdmin } from "../utils";
import { Report } from "../contract/WhistleblowerGenerated";
import lzString from "lz-string";

interface IProps {
  report: Report;
}

export const ReportViewer = ({ report }: IProps) => {
  const { whistleblowerApi, currentAccount, setLoading } = useContext(Context);
  const isDisabled =
    currentAccount === undefined || whistleblowerApi === undefined;

  async function handleVote(upVote: boolean) {
    setLoading(true);
    await whistleblowerApi.vote(report.id, upVote);
    setLoading(false);
  }

  async function handleApprove(approve: boolean) {
    setLoading(true);
    await whistleblowerApi.approve(report.id, approve);
    setLoading(false);
  }

  const Action = () => {
    return (
      <>
      {isDisabled && <Typography variant="overline" color={"red"}>Please sign in to take actions !</Typography>}  

      <Box>
        <Button
          size="large"
          startIcon={<ArrowCircleUp />}
          onClick={(e) => handleVote(true)}
          disabled={isDisabled}
          endIcon={<>{report.up_votes}</>}
        >
          Upvote
        </Button>
        <Button
          size="small"
          startIcon={<ArrowCircleDown />}
          onClick={(e) => handleVote(false)}
          disabled={isDisabled}
          endIcon={<>{report.down_votes}</>}
        >
          Downvote
        </Button>

        {isAdmin(currentAccount) && (report.status !== 2) && (
          <Stack
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "flex-end",
              mt: -2,
            }}
            direction={"row"}
            spacing={3}
          >
            <Button
              variant="contained"
              size="medium"
              disabled={isDisabled}
              startIcon={<CheckCircleOutline />}
              onClick={(e) => handleApprove(true)}
            >
              Accept
            </Button>
            <Button
              variant="outlined"
              size="medium"
              color="error"
              disabled={isDisabled}
              startIcon={<CancelOutlined />}
              onClick={(e) => handleApprove(false)}
            >
              Reject
            </Button>
          </Stack>
        )}
      </Box></>
    );
  };
  return (
    <Box sx={{ minWidth: 800, p: 3 }}>
      <Typography color="primary.main" variant="h3">
        Whistle
      </Typography>
      <Divider />
      <div data-color-mode="light">
        <Paper sx={{ p: 2, mt: 2 }} elevation={5}>
          <MDEditor.Markdown
            source={lzString.decompressFromUTF16(report.description)}
            style={{ whiteSpace: "pre-wrap", height: 450 }}
          />
        </Paper>
        <Action />
      </div>
    </Box>
  );
};
