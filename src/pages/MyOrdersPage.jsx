import React, { useEffect, useState } from 'react';
import {
  Badge,
  Box,
  Button,
  Container,
  Flex,
  Heading,
  HStack,
  Spinner,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react';
import { FiPackage, FiRefreshCw, FiShoppingBag } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const MotionBox = motion.div;

const STATUS_COLORS = {
  PLACED: 'blue',
  CONFIRMED: 'purple',
  PREPARING: 'orange',
  READY: 'yellow',
  DELIVERED: 'green',
  CANCELLED: 'red',
};

const MyOrdersPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadOrders = async () => {
    setLoading(true);
    setError(false);
    try {
      const response = await axios.get('http://localhost:8081/orders');
      setOrders(response.data || []);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadOrders(); }, []);

  const formatINR = (v) => `₹${Number(v || 0).toFixed(2)}`;

  const getItemLabel = (item) =>
    (item.foodName || item.name || item.foodItem?.name || 'Item') + ' × ' + (item.quantity || 1);

  if (loading) {
    return (
      <Box minH="100vh" bg="#070B14" display="flex" alignItems="center" justifyContent="center">
        <VStack gap={4}>
          <Spinner size="xl" color="blue.400" borderWidth="3px" />
          <Text color="gray.400">Loading your orders...</Text>
        </VStack>
      </Box>
    );
  }

  return (
    <Box minH="100vh" bg="#070B14" color="white" py={{ base: 8, md: 12 }}>
      <Container maxW="900px">

        {/* Header */}
        <Flex align="center" justify="space-between" mb={8} gap={4} flexWrap="wrap">
          <Flex align="center" gap={3}>
            <Box w="44px" h="44px" borderRadius="xl" bg="blue.500" display="flex" alignItems="center" justifyContent="center" flexShrink={0}>
              <FiPackage size={22} color="white" />
            </Box>
            <Box>
              <Text color="blue.400" fontSize="xs" fontWeight="700" letterSpacing="3px" textTransform="uppercase">Order History</Text>
              <Heading fontSize={{ base: '2xl', md: '3xl' }} fontWeight="900">My Orders</Heading>
            </Box>
          </Flex>
          <Button variant="outline" size="sm" borderRadius="xl" borderColor="whiteAlpha.300" color="gray.400" _hover={{ bg: 'whiteAlpha.50' }} onClick={loadOrders}>
            <FiRefreshCw size={14} />
            Refresh
          </Button>
        </Flex>

        {error ? (
          <Box bg="rgba(17,23,34,0.9)" border="1px solid" borderColor="red.900" borderRadius="2xl" p={8} textAlign="center">
            <Text color="red.400" fontWeight="700" mb={2}>Failed to load orders</Text>
            <Text color="gray.500" fontSize="sm" mb={4}>Please check your connection and try again.</Text>
            <Button colorPalette="blue" size="sm" onClick={loadOrders}>Try Again</Button>
          </Box>
        ) : orders.length === 0 ? (
          <Box bg="rgba(17,23,34,0.9)" border="1px solid" borderColor="whiteAlpha.100" borderRadius="2xl" p={12} textAlign="center">
            <Box display="inline-flex" bg="blue.900" borderRadius="full" p={6} mb={4}><FiPackage size={36} color="#60A5FA" /></Box>
            <Heading size="md" mb={3}>No orders yet</Heading>
            <Text color="gray.400" mb={6}>Your orders will appear here once you place them.</Text>
            <Button colorPalette="blue" borderRadius="xl" onClick={() => navigate('/menu')}>
              <FiShoppingBag />
              Order Now
            </Button>
          </Box>
        ) : (
          <Stack gap={4}>
            {orders.map((order, index) => (
              <MotionBox
                key={order.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06, duration: 0.3 }}
              >
                <Box
                  bg="rgba(17,23,34,0.95)"
                  border="1px solid"
                  borderColor="whiteAlpha.100"
                  borderRadius="2xl"
                  p={{ base: 5, md: 6 }}
                  _hover={{ borderColor: 'blue.900' }}
                  transition="border-color 0.2s"
                >
                  <Flex justify="space-between" align="flex-start" gap={4} flexWrap="wrap" mb={4}>
                    <Box>
                      <HStack gap={2} mb={1}>
                        <Text fontWeight="900" fontSize="lg" color="white">
                          #{order.orderNumber || order.id}
                        </Text>
                        <Badge
                          colorPalette={STATUS_COLORS[order.orderStatus] || 'gray'}
                          borderRadius="full"
                          px={3}
                          py={1}
                          fontSize="xs"
                        >
                          {order.orderStatus || 'PLACED'}
                        </Badge>
                      </HStack>
                      {order.createdAt && (
                        <Text color="gray.500" fontSize="xs">
                          {new Date(order.createdAt).toLocaleString('en-IN', {
                            day: '2-digit', month: 'short', year: 'numeric',
                            hour: '2-digit', minute: '2-digit',
                          })}
                        </Text>
                      )}
                    </Box>
                    <Box textAlign="right">
                      <Text color="blue.300" fontSize="xl" fontWeight="900">{formatINR(order.finalAmount)}</Text>
                      {order.paymentMethod && (
                        <Text color="gray.500" fontSize="xs" mt={0.5}>{order.paymentMethod}</Text>
                      )}
                    </Box>
                  </Flex>

                  {order.items && order.items.length > 0 && (
                    <Box bg="rgba(0,0,0,0.2)" borderRadius="xl" p={3}>
                      <Text fontSize="xs" color="gray.500" mb={2} letterSpacing="1px" textTransform="uppercase">Items</Text>
                      <Stack gap={1}>
                        {order.items.map((item, i) => (
                          <HStack key={i} justify="space-between">
                            <Text fontSize="sm" color="gray.300">{getItemLabel(item)}</Text>
                            {(item.price || item.unitPrice) && (
                              <Text fontSize="sm" color="gray.500">{formatINR((item.price || item.unitPrice) * (item.quantity || 1))}</Text>
                            )}
                          </HStack>
                        ))}
                      </Stack>
                    </Box>
                  )}

                  {order.address && (
                    <Text fontSize="xs" color="gray.600" mt={3}>📍 {order.address}</Text>
                  )}
                </Box>
              </MotionBox>
            ))}
          </Stack>
        )}
      </Container>
    </Box>
  );
};

export default MyOrdersPage;
