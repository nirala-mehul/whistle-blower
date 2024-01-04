// import { Link as RouterLink } from "react-router-dom";
import { Box, Container, Drawer, Fab, IconButton } from "@mui/material";
import { useContext, useState } from "react";

import EditIcon from "@mui/icons-material/Edit";

import { Context } from "../context";
import { Editor } from "../components/Editor";
import { CloseOutlined } from "@mui/icons-material";
import ReportTable from "../components/ReportTable";
import { Report } from "../contract/WhistleblowerGenerated";

const Page = () => {
  const { contractState } = useContext(Context);
  const [open, setOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report>();
  const fabStyle = {
    position: "absolute",
    bottom: 24,
    right: 24,
  };

  const onClose = () => setOpen(false);

  return (
    <>
      <title>Error: Not Found | Carpatin Free</title>

      <Box
        sx={{
          backgroundColor: "background.paper",
          flexGrow: 1,
          border: "2px solid black",
          px: 10,
          py: 10,
        }}
      >
        <Container
          sx={{
            alignItems: "center",
            p: 0,
            m: "auto",
          }}
        >
          {contractState && (
            <ReportTable
              reports={Array.from(contractState.reports.values())}
              onSelectReport={(report: Report) => {
                setSelectedReport(report);
                setOpen(true);
              }}
            />
          )}

          <Fab
            sx={fabStyle}
            color="primary"
            aria-label="edit"
            onClick={() => setOpen(true)}
          >
            <EditIcon />
          </Fab>

          <Drawer anchor={"right"} open={open} onClose={onClose}>
            <IconButton
              sx={{ position: "absolute", right: 10, top: 10 }}
              onClick={onClose}
            >
              <CloseOutlined />
            </IconButton>
            <Editor
              edit={false}
              value={selectedReport?.description}
              onActionComplete={onClose}
            />
          </Drawer>
        </Container>
      </Box>
    </>
  );
};

export default Page;
