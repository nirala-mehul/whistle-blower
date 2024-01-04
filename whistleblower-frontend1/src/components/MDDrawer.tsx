import { CloseOutlined } from "@mui/icons-material";
import { Drawer, IconButton } from "@mui/material";
import { Editor } from "./Editor";

interface IProps {
  open: boolean;
  onClose: () => void;
  editMode: boolean;
  value?: string;
}

export default function MDDrawer({ open, onClose, editMode, value }: IProps) {
  return (
    <Drawer anchor={"right"} open={open} onClose={onClose}>
      <IconButton
        sx={{ position: "absolute", right: 10, top: 10 }}
        onClick={onClose}
      >
        <CloseOutlined />
      </IconButton>
      <Editor edit={editMode} value={value} onActionComplete={onClose} />
    </Drawer>
  );
}
