import React from "react";
import { Box } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";

import Navbar from "./Navbar";
import Footer from "./Footer";

const Layout = () => {
  return (
    <Box
      minH="100vh"
      display="flex"
      flexDirection="column"
    >
      <Navbar />

      <Box flex="1">
        <Outlet />
      </Box>

      <Footer />
    </Box>
  );
};

export default Layout;