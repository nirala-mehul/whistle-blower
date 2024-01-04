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
            value={selectedReport?.description}
          />
        </Container>
      </Box>
    </>
  );
};

export default Page;
