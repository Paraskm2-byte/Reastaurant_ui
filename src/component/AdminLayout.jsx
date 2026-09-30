import React, { useState } from "react";
import { Box, Drawer, Flex, Text } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import Sidebar from "./Sidebar";

const AdminLayout = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <Box minH="100vh" bg="gray.50">
      {/* ── Fixed desktop sidebar ── */}
      <Box
        display={{ base: "none", md: "block" }}
        position="fixed"
        left="0"
        top="0"
        width="250px"
        height="100vh"
        zIndex="1000"
        overflowY="auto"
      >
        <Sidebar />
      </Box>

      {/* ── Mobile top bar ── */}
      <Box
        display={{ base: "flex", md: "none" }}
        position="fixed"
        top="0"
        left="0"
        right="0"
        height="56px"
        bg="#0f172a"
        zIndex="999"
        alignItems="center"
        justifyContent="space-between"
        px={4}
        boxShadow="0 1px 0 rgba(255,255,255,0.06)"
      >
        <Flex align="center" gap={2}>
          <Text fontSize="lg" lineHeight="1">🍽</Text>
          <Box>
            <Text fontSize="sm" fontWeight="800" color="white" lineHeight="1.1">
              Restaurant Admin
            </Text>
            <Text fontSize="9px" color="gray.500" letterSpacing="0.08em" textTransform="uppercase">
              Management System
            </Text>
          </Box>
        </Flex>

        <Box
          as="button"
          onClick={() => setDrawerOpen(true)}
          color="white"
          bg="transparent"
          border="none"
          cursor="pointer"
          display="flex"
          alignItems="center"
          justifyContent="center"
          p={2}
          borderRadius="lg"
          _hover={{ bg: "rgba(255,255,255,0.08)" }}
        >
          <FiMenu size={22} />
        </Box>
      </Box>

      {/* ── Mobile Drawer ── */}
      <Drawer.Root
        open={drawerOpen}
        onOpenChange={(d) => setDrawerOpen(d.open)}
        placement="left"
      >
        <Drawer.Positioner>
          <Drawer.Content width="260px" maxW="82vw" bg="#0f172a" p={0}>
            <Drawer.CloseTrigger asChild>
              <Box
                as="button"
                position="absolute"
                top="12px"
                right="10px"
                color="gray.400"
                bg="transparent"
                border="none"
                cursor="pointer"
                display="flex"
                alignItems="center"
                justifyContent="center"
                p={2}
                borderRadius="md"
                zIndex={10}
                _hover={{ color: "white", bg: "rgba(255,255,255,0.08)" }}
              >
                <FiX size={18} />
              </Box>
            </Drawer.CloseTrigger>
            <Drawer.Body p={0} overflowY="auto" height="100%">
              <Sidebar onClose={() => setDrawerOpen(false)} />
            </Drawer.Body>
          </Drawer.Content>
        </Drawer.Positioner>
      </Drawer.Root>

      {/* ── Main content area ── */}
      <Box
        ml={{ base: 0, md: "250px" }}
        pt={{ base: "56px", md: 0 }}
        minH="100vh"
        bg="gray.50"
        overflowX="hidden"
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default AdminLayout;
