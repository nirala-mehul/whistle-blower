import ArticleIcon from "@mui/icons-material/Article";
import AddIcon from "@mui/icons-material/Add";

import { Box, Container, Divider, Fab, Typography } from "@mui/material";
import { useContext, useState } from "react";
import { Context } from "../context";
import ReportTable from "../components/ReportTable";
import { Report } from "../contract/WhistleblowerGenerated";
import { Cancel, CheckCircle } from "@mui/icons-material";
import MDDrawer from "../components/MDDrawer";

export default function Profile() {
  const { contractState } = useContext(Context);
  const [open, setOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report>();
  const fabStyle = {
    position: "absolute",
    bottom: 24,
    right: 24,
  };
  const onClose = () => {
    setOpen(false);
    setSelectedReport(undefined);
  };

  let reports: Report[] = [],
    approvedReports: Report[] = [],
    rejectedReports: Report[] = [];
  if (contractState) {
    reports = Array.from(contractState.reports.values());
    approvedReports = reports.filter((a: Report) => a.status && a.status === 2);
    rejectedReports = reports.filter((a: Report) => a.status && a.status === 1);
  }

  return (
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
        {reports.length > 0 && (
          <>
            <Typography variant="h3">
              My reports <ArticleIcon />
            </Typography>
            <Divider />
            <ReportTable
              reports={reports}
              onSelectReport={(report: Report) => {
                setSelectedReport(report);
                setOpen(true);
              }}
            />
          </>
        )}

        {approvedReports.length > 0 && (
          <>
            <Typography variant="h3">
              Approved <CheckCircle />
            </Typography>
            <Divider />
            <ReportTable
              reports={approvedReports}
              onSelectReport={(report: Report) => {
                setSelectedReport(report);
                setOpen(true);
              }}
            />
          </>
        )}

        {rejectedReports.length > 0 && (
          <>
            <Typography variant="h3">
              Rejected <Cancel />
            </Typography>
            <Divider />
            <ReportTable
              reports={rejectedReports}
              onSelectReport={(report: Report) => {
                setSelectedReport(report);
                setOpen(true);
              }}
            />
          </>
        )}
      </Container>

      <Fab
        sx={fabStyle}
        color="primary"
        aria-label="edit"
        onClick={() => setOpen(true)}
      >
        <AddIcon />
      </Fab>

      <MDDrawer
        editMode={selectedReport === undefined}
        open={open}
        onClose={onClose}
        report={selectedReport}
      />
    </Box>
  );
}
