import { CloseOutlined } from "@mui/icons-material";
import {
  Avatar,
  Container,
  Drawer,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { Editor } from "./Editor";
import { useContext } from "react";
import { Context } from "../context";
import { Report } from "../contract/WhistleblowerGenerated";
import { ReportViewer } from "./ReportViewer";

interface IProps {
  open: boolean;
  onClose: () => void;
  editMode: boolean;
  report?: Report;
}

export default function MDDrawer({ open, onClose, editMode, report }: IProps) {
  const { currentAccount } = useContext(Context);
  return (
    <Drawer anchor={"right"} open={open} onClose={onClose}>
      <IconButton
        sx={{ position: "absolute", right: 10, top: 10 }}
        onClick={onClose}
      >
        <CloseOutlined />
      </IconButton>
      <Container sx={{ mt: 3 }}>
        {currentAccount && (
          <Stack alignItems="center" direction="row" spacing={2}>
            <Avatar
              src={
                "https://api.dicebear.com/7.x/pixel-art/svg?seed=" +
                currentAccount.address
              }
              variant="rounded"
            />
            <Typography gutterBottom color="primary.main">
              {currentAccount.address}
            </Typography>
          </Stack>
        )}
      </Container>
      {editMode ? (
        <Editor value="" onActionComplete={onClose} />
      ) : (
        <ReportViewer report={report} onActionComplete={onClose} />
      )}
    </Drawer>
  );
}
