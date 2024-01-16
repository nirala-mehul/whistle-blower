// import { Link as RouterLink } from "react-router-dom";
import { Box, Container, Typography } from "@mui/material";

const Page = () => (
  <>
    <title>Error: Not Found | Carpatin Free</title>
    <Box
      sx={{
        backgroundColor: "background.paper",
        flexGrow: 1,
      }}
    >
      <Container
        maxWidth="md"
        sx={{
          px: 5,
          py: 14,
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            "& img": {
              maxWidth: "100%",
            },
          }}
        >
          <img src="/assets/illustration-not-found.svg" />
        </Box>
        <Typography align="center" sx={{ my: 2 }} variant="h3">
          Nothing here!
        </Typography>
        <Typography align="center" color="text.secondary" variant="body2">
          The page requested does not exist.
        </Typography>
      </Container>
    </Box>
  </>
);

export default Page;
