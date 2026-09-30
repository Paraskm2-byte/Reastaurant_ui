import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Box, Button, Flex, Grid, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import {
  FiCalendar,
  FiCoffee,
  FiCreditCard,
  FiTag,
  FiUsers,
  FiPlus,
  FiList,
} from "react-icons/fi";

const API = axios.create({ baseURL: "http://localhost:8081" });

const MotionDiv = motion.div;

const Homepage = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    foods: 0,
    employees: 0,
    payments: 0,
    categories: 0,
    pendingBookings: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [foodResponse, employeeResponse, paymentResponse, categoryResponse, pendingResponse] =
          await Promise.all([
            API.get("/fooditems/getdata"),
            API.get("/employeestaff/getdata"),
            API.get("/payment/getdata"),
            API.get("/categories"),
            API.get("/bookings/pending-count"),
          ]);

        setStats({
          foods: foodResponse.data?.length || 0,
          employees: employeeResponse.data?.length || 0,
          payments: paymentResponse.data?.length || 0,
          categories: categoryResponse.data?.length || 0,
          pendingBookings: pendingResponse.data?.pending || 0,
        });
      } catch (error) {
        console.error("Failed to load admin stats", error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  const now = new Date();
  const dateStr = now.toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const hour = now.getHours();
  const greeting =
    hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";

  const cards = [
    {
      label: "Food Items",
      value: stats.foods,
      icon: FiCoffee,
      color: "blue",
      bg: "#eff6ff",
      iconColor: "#2563eb",
    },
    {
      label: "Employees",
      value: stats.employees,
      icon: FiUsers,
      color: "green",
      bg: "#f0fdf4",
      iconColor: "#16a34a",
    },
    {
      label: "Payments",
      value: stats.payments,
      icon: FiCreditCard,
      color: "purple",
      bg: "#faf5ff",
      iconColor: "#9333ea",
    },
    {
      label: "Categories",
      value: stats.categories,
      icon: FiTag,
      color: "orange",
      bg: "#fff7ed",
      iconColor: "#ea580c",
    },
    {
      label: "Pending Bookings",
      value: stats.pendingBookings,
      icon: FiCalendar,
      color: "orange",
      bg: "#fff7ed",
      iconColor: "#c2410c",
      to: "/admin/bookings",
    },
  ];

  const quickActions = [
    {
      label: "Add Food Item",
      icon: FiPlus,
      color: "blue",
      to: "/admin/food",
    },
    {
      label: "Add Employee",
      icon: FiPlus,
      color: "green",
      to: "/admin/employee",
    },
    {
      label: "View Payments",
      icon: FiCreditCard,
      color: "purple",
      to: "/admin/payment",
    },
    {
      label: "View Orders",
      icon: FiList,
      color: "orange",
      to: "/admin/orders",
    },
    {
      label: "View Bookings",
      icon: FiCalendar,
      color: "orange",
      to: "/admin/bookings",
    },
  ];

  return (
    <Box minH="100vh" bg="gray.50" py={{ base: 5, md: 8, lg: 10 }}>
      <Box
        maxW="1200px"
        mx="auto"
        px={{ base: 3, sm: 4, md: 6, lg: 8 }}
      >
        {/* ── Header ── */}
        <MotionDiv
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Flex
            direction={{ base: "column", sm: "row" }}
            justify="space-between"
            align={{ base: "stretch", sm: "flex-start" }}
            gap={3}
            mb={{ base: 6, md: 10 }}
          >
            <Box>
              <Text
                fontSize={{ base: "xl", sm: "2xl", md: "3xl" }}
                fontWeight="800"
                color="gray.800"
                lineHeight="1.2"
              >
                {greeting} 👋
              </Text>
              <Text fontSize={{ base: "xs", sm: "sm" }} color="gray.500" mt={2}>
                Here&apos;s what&apos;s happening with your restaurant today.
              </Text>
            </Box>
            <Box
              display={{ base: "none", sm: "flex" }}
              bg="white"
              border="1px solid"
              borderColor="gray.200"
              borderRadius="xl"
              px={4}
              py={2}
              alignSelf={{ sm: "flex-start" }}
              mt={{ sm: 1 }}
              alignItems="center"
            >
              <Text fontSize="sm" color="gray.500" fontWeight="500" whiteSpace="nowrap">
                {dateStr}
              </Text>
            </Box>
          </Flex>
        </MotionDiv>

        {/* ── Stats cards ── */}
        <Grid
          templateColumns={{
            base: "1fr",
            sm: "repeat(2, 1fr)",
            xl: "repeat(5, 1fr)",
          }}
          gap={{ base: 3, md: 5 }}
          mb={{ base: 6, md: 10 }}
        >
          {cards.map((card, index) => {
            const IconComponent = card.icon;
            return (
              <MotionDiv
                key={card.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
              >
                <Box
                  bg="white"
                  borderRadius="2xl"
                  border="1px solid"
                  borderColor="gray.200"
                  boxShadow="sm"
                  p={{ base: 4, md: 5 }}
                  cursor={card.to ? "pointer" : "default"}
                  onClick={() => card.to && navigate(card.to)}
                  _hover={{ boxShadow: "md", transform: "translateY(-2px)" }}
                  transition="all 0.2s ease"
                >
                  <Flex justify="space-between" align="flex-start" mb={3}>
                    <Text fontSize="sm" fontWeight="600" color="gray.500">
                      {card.label}
                    </Text>
                    <Box
                      bg={card.bg}
                      color={card.iconColor}
                      borderRadius="lg"
                      p={2}
                      fontSize="18px"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      flexShrink={0}
                    >
                      <IconComponent />
                    </Box>
                  </Flex>
                  <Text
                    fontSize={{ base: "3xl", md: "4xl" }}
                    fontWeight="800"
                    color="gray.800"
                    lineHeight="1"
                  >
                    {loading ? "—" : card.value}
                  </Text>
                  <Text fontSize="xs" color="gray.400" mt={2}>
                    Active records
                  </Text>
                </Box>
              </MotionDiv>
            );
          })}
        </Grid>

        {/* ── Quick Actions ── */}
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.4 }}
        >
          <Box
            bg="white"
            borderRadius="2xl"
            border="1px solid"
            borderColor="gray.200"
            boxShadow="sm"
            p={{ base: 4, md: 6 }}
            mb={6}
          >
            <Text fontSize={{ base: "md", md: "lg" }} fontWeight="700" color="gray.800" mb={{ base: 4, md: 5 }}>
              Quick Actions
            </Text>
            <Grid
              templateColumns={{
                base: "1fr",
                sm: "repeat(2, 1fr)",
                    md: "repeat(3, 1fr)",
                    lg: "repeat(5, 1fr)",
              }}
              gap={{ base: 2, md: 3 }}
            >
              {quickActions.map((action) => {
                const ActionIcon = action.icon;
                return (
                  <Button
                    key={action.label}
                    variant="outline"
                    colorPalette={action.color}
                    borderRadius="xl"
                    onClick={() => navigate(action.to)}
                    size="md"
                    justifyContent="center"
                    fontSize={{ base: "xs", md: "sm" }}
                    px={{ base: 2, md: 4 }}
                    width="100%"
                  >
                    <ActionIcon />
                    {action.label}
                  </Button>
                );
              })}
            </Grid>
          </Box>
        </MotionDiv>

        {/* ── System Status ── */}
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.4 }}
        >
          <Box
            bg="white"
            borderRadius="2xl"
            border="1px solid"
            borderColor="gray.200"
            boxShadow="sm"
            p={{ base: 4, md: 6 }}
          >
            <Text fontSize={{ base: "md", md: "lg" }} fontWeight="700" color="gray.800" mb={4}>
              System Status
            </Text>
            <Box
              bg="green.50"
              border="1px solid"
              borderColor="green.200"
              borderRadius="xl"
              p={{ base: 4, md: 5 }}
            >
              <Flex align="center" gap={3} mb={2}>
                <Box
                  width="10px"
                  height="10px"
                  borderRadius="full"
                  bg="green.500"
                  flexShrink={0}
                />
                <Text fontWeight="700" color="green.700">
                  System Ready
                </Text>
              </Flex>
              <Text fontSize="sm" color="green.600">
                All services are running normally. Live data is shown in the stats
                above — {stats.foods} food items, {stats.employees} employees,{" "}
                {stats.payments} payment records, {stats.categories} categories,
                and {stats.pendingBookings} pending booking requests
                are currently active.
              </Text>
            </Box>
          </Box>
        </MotionDiv>
      </Box>
    </Box>
  );
};

export default Homepage;
