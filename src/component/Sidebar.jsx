import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Box, Flex, Text, VStack } from "@chakra-ui/react";
import {
  FiCalendar,
  FiClipboard,
  FiCoffee,
  FiCreditCard,
  FiHome,
  FiLogOut,
  FiUsers,
} from "react-icons/fi";

const sections = [
  {
    label: "OVERVIEW",
    items: [{ label: "Dashboard", to: "/admin", icon: FiHome }],
  },
  {
    label: "MENU",
    items: [{ label: "Food Items", to: "/admin/food", icon: FiCoffee }],
  },
  {
    label: "STAFF",
    items: [{ label: "Employees", to: "/admin/employee", icon: FiUsers }],
  },
  {
    label: "FINANCE",
    items: [{ label: "Payments", to: "/admin/payment", icon: FiCreditCard }],
  },
  {
    label: "SYSTEM",
    items: [
      { label: "Orders", to: "/admin/orders", icon: FiClipboard },
      { label: "Bookings", to: "/admin/bookings", icon: FiCalendar },
    ],
  },
];

const Sidebar = ({ onClose }) => {
  const location = useLocation();

  const isActive = (to) =>
    location.pathname === to ||
    (to !== "/admin" && location.pathname.startsWith(to));

  return (
    <Box
      height="100%"
      minH="100vh"
      bg="#0f172a"
      color="white"
      display="flex"
      flexDirection="column"
      borderRight="1px solid"
      borderColor="rgba(255,255,255,0.06)"
    >
      {/* Brand header */}
      <Box
        px={{ base: 4, md: 5 }}
        py={6}
        borderBottom="1px solid"
        borderColor="rgba(255,255,255,0.06)"
        flexShrink={0}
      >
        <Flex align="center" gap={2.5} mb={1}>
          <Text fontSize="xl" lineHeight="1" flexShrink={0}>
            🍽
          </Text>
          <Box minW={0}>
            <Text
              fontSize="md"
              fontWeight="800"
              color="white"
              letterSpacing="-0.02em"
              lineHeight="1.2"
              isTruncated
            >
              Restaurant Admin
            </Text>
            <Text fontSize="9px" color="gray.500" letterSpacing="0.1em" textTransform="uppercase" mt={0.5}>
              Management System
            </Text>
          </Box>
        </Flex>
      </Box>

      {/* Nav sections */}
      <Box flex="1" overflowY="auto" px={2.5} py={4}>
        <VStack align="stretch" gap={0}>
          {sections.map((section) => (
            <Box key={section.label} mb={3.5}>
              <Text
                fontSize="10px"
                fontWeight="700"
                letterSpacing="0.14em"
                color="gray.500"
                textTransform="uppercase"
                px={2.5}
                mb={1}
              >
                {section.label}
              </Text>

              {section.items.map((item) => {
                const IconComponent = item.icon;
                const active = isActive(item.to);

                return (
                  <Link
                    key={item.label}
                    to={item.to}
                    style={{ textDecoration: "none" }}
                    onClick={() => onClose?.()}
                  >
                    <Flex
                      align="center"
                      gap={2.5}
                      borderRadius="xl"
                      px={2.5}
                      py="9px"
                      mb="2px"
                      bg={active ? "blue.600" : "transparent"}
                      color={active ? "white" : "gray.400"}
                      transition="all 0.15s ease"
                      _hover={{
                        bg: active ? "blue.600" : "rgba(255,255,255,0.06)",
                        color: active ? "white" : "gray.100",
                      }}
                      cursor="pointer"
                    >
                      <Box
                        fontSize="15px"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        color={active ? "white" : "gray.400"}
                        flexShrink={0}
                      >
                        <IconComponent />
                      </Box>
                      <Text
                        fontSize="sm"
                        fontWeight={active ? "700" : "500"}
                        letterSpacing="0.01em"
                        isTruncated
                        flex="1"
                        minW={0}
                      >
                        {item.label}
                      </Text>
                      {active && (
                        <Box
                          flexShrink={0}
                          width="6px"
                          height="6px"
                          borderRadius="full"
                          bg="blue.200"
                        />
                      )}
                    </Flex>
                  </Link>
                );
              })}
            </Box>
          ))}
        </VStack>
      </Box>

      {/* Bottom logout */}
      <Box
        px={2.5}
        py={4}
        borderTop="1px solid"
        borderColor="rgba(255,255,255,0.06)"
        flexShrink={0}
      >
        <Flex
          align="center"
          gap={2.5}
          borderRadius="xl"
          px={2.5}
          py="9px"
          color="red.400"
          cursor="pointer"
          transition="all 0.15s ease"
          _hover={{ bg: "rgba(220,38,38,0.15)", color: "red.300" }}
        >
          <Box fontSize="15px" display="flex" alignItems="center" flexShrink={0}>
            <FiLogOut />
          </Box>
          <Text fontSize="sm" fontWeight="600">
            Logout
          </Text>
        </Flex>
      </Box>
    </Box>
  );
};

export default Sidebar;
