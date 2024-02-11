// import { Link as RouterLink } from "react-router-dom";
import { Box, Container, Divider, Typography } from "@mui/material";
import { useContext, useState } from "react";
import { Context } from "../context";
import { TrendingUp } from "@mui/icons-material";
import ReportTable from "../components/ReportTable";
import { Report } from "../contract/WhistleblowerGenerated";
import MDDrawer from "../components/MDDrawer";

const Page = () => {
  const { contractState } = useContext(Context);
  const [open, setOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report>();

  const onClose = () => setOpen(false);
  let reports = [];
  if (contractState) {
    reports = Array.from(contractState.reports.values());
  }

  return (
    <>
      <Box
        sx={{
          backgroundColor: "background.paper",
          flexGrow: 1,
          px: 10,
          py: 10,
        }}
      >
        <Container
          sx={{
            justifyContent: "center",
            alignItems: "center",
            p: 0,
            m: "auto",
          }}
        >
          {reports.length === 0 && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignContent: "center",
                mt: 10,
              }}
            >
              <Box>
                <Typography variant="h3">Welcome to Whistleblower</Typography>
                <Typography variant="body1">
                  Welcome to Whistleblower, where integrity meets action. Our
                  platform is dedicated to empowering individuals to raise their
                  voices against wrongdoing, championing transparency,
                  accountability, and positive change. Whether it's uncovering
                  financial irregularities, exposing safety violations, or
                  fighting against discrimination, we're here to support and
                  amplify your efforts. Join us in making a difference, one
                  courageous act of whistleblowing at a time.
                </Typography>
              </Box>
            </Box>
          )}

          {reports.length > 0 && (
            <>
              <Typography variant="h3">
                Trending <TrendingUp />
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
          <MDDrawer
            editMode={false}
            open={open}
            onClose={onClose}
            report={selectedReport}
          />
        </Container>
      </Box>
    </>
  );
};

export default Page;
