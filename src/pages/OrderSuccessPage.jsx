import React, { useEffect } from 'react';
import { Box, Button, Container, Flex, Heading, HStack, Stack, Text, VStack, Badge } from '@chakra-ui/react';
import { FiCheckCircle, FiShoppingBag, FiList, FiHome } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';

const MotionBox = motion.div;

const OrderSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order;

  // If navigated here directly without order state, redirect
  useEffect(() => {
    if (!location.state) {
      // Allow viewing without state for bookmarks — just show generic success
    }
  }, []);

  const formatINR = (v) => `₹${Number(v || 0).toFixed(2)}`;

  return (
    <Box minH="100vh" bg="#070B14" color="white" py={{ base: 10, md: 16 }} px={4}>
      <Container maxW="680px">
        <MotionBox
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, type: 'spring', stiffness: 120 }}
        >
          <Box
            bg="rgba(17,23,34,0.95)"
            border="1px solid"
            borderColor="whiteAlpha.100"
            borderRadius="2xl"
            p={{ base: 8, md: 12 }}
            textAlign="center"
          >
            {/* Success icon */}
            <MotionBox
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            >
              <Box
                display="inline-flex"
                bg="green.900"
                borderRadius="full"
                p={5}
                mb={5}
                border="2px solid"
                borderColor="green.700"
              >
                <FiCheckCircle size={44} color="#34D399" />
              </Box>
            </MotionBox>

            <Heading fontSize={{ base: '2xl', md: '3xl' }} color="green.300" mb={3}>
              Order Placed Successfully!
            </Heading>

            <Text color="gray.400" maxW="440px" mx="auto" lineHeight="1.7">
              {order
                ? `Your order #${order.orderNumber} has been received. We'll start preparing it right away!`
                : 'Your order has been placed and is being prepared.'}
            </Text>

            {order && (
              <MotionBox
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
              >
                <Box
                  bg="rgba(0,0,0,0.3)"
                  border="1px solid"
                  borderColor="whiteAlpha.100"
                  borderRadius="xl"
                  p={5}
                  mt={7}
                  textAlign="left"
                >
                  <Text fontSize="xs" fontWeight="700" color="gray.500" letterSpacing="2px" textTransform="uppercase" mb={4}>
                    Order Details
                  </Text>

                  <VStack align="stretch" gap={3}>
                    {order.orderNumber && (
                      <HStack justify="space-between">
                        <Text color="gray.400" fontSize="sm">Order Number</Text>
                        <Text fontWeight="800" color="blue.300">#{order.orderNumber}</Text>
                      </HStack>
                    )}
                    {order.finalAmount != null && (
                      <HStack justify="space-between">
                        <Text color="gray.400" fontSize="sm">Total Amount</Text>
                        <Text fontWeight="800" color="white">{formatINR(order.finalAmount)}</Text>
                      </HStack>
                    )}
                    {order.paymentMethod && (
                      <HStack justify="space-between">
                        <Text color="gray.400" fontSize="sm">Payment</Text>
                        <Text fontWeight="700">{order.paymentMethod}</Text>
                      </HStack>
                    )}
                    {order.orderStatus && (
                      <HStack justify="space-between">
                        <Text color="gray.400" fontSize="sm">Status</Text>
                        <Badge colorPalette="green" borderRadius="full" px={3} py={1}>{order.orderStatus}</Badge>
                      </HStack>
                    )}
                    {order.customerName && (
                      <HStack justify="space-between">
                        <Text color="gray.400" fontSize="sm">Customer</Text>
                        <Text fontWeight="700">{order.customerName}</Text>
                      </HStack>
                    )}
                  </VStack>
                </Box>
              </MotionBox>
            )}

            <Stack gap={3} mt={8} direction={{ base: 'column', sm: 'row' }} justify="center">
              <Button colorPalette="blue" size="lg" borderRadius="xl" onClick={() => navigate('/menu')}>
                <FiShoppingBag />
                Continue Shopping
              </Button>
              <Button
                variant="outline"
                size="lg"
                borderRadius="xl"
                color="gray.300"
                borderColor="whiteAlpha.300"
                _hover={{ bg: 'whiteAlpha.50' }}
                onClick={() => navigate('/my-orders')}
              >
                <FiList />
                My Orders
              </Button>
            </Stack>

            <Button
              variant="ghost"
              size="sm"
              color="gray.600"
              mt={4}
              onClick={() => navigate('/')}
              _hover={{ color: 'gray.400' }}
            >
              <FiHome />
              Back to Home
            </Button>
          </Box>
        </MotionBox>
      </Container>
    </Box>
  );
};

export default OrderSuccessPage;
