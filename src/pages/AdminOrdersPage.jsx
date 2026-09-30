import React, { useEffect, useState } from 'react';
import {
  Badge,
  Box,
  Container,
  Heading,
  HStack,
  Spinner,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react';
import axios from 'axios';
import { saveToaster } from '../components/ui/toaster';

const statusOptions = [
  'PLACED',
  'CONFIRMED',
  'PREPARING',
  'READY',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
  'CANCELLED',
];

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const loadOrders = async () => {
    try {
      const response = await axios.get('http://localhost:8081/orders');
      setOrders(response.data || []);
    } catch (error) {
      saveToaster.create({
        title: 'Unable to load orders',
        description: 'Please check the backend server and try again.',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (orderId, nextStatus) => {
    setUpdatingId(orderId);

    try {
      await axios.put(`http://localhost:8081/orders/${orderId}/status?orderStatus=${nextStatus}`);
      await loadOrders();
      saveToaster.create({
        title: 'Order updated',
        description: `Status changed to ${nextStatus}.`,
        type: 'success',
      });
    } catch (error) {
      saveToaster.create({
        title: 'Unable to update order',
        description: error?.response?.data?.message || 'Please try again.',
        type: 'error',
      });
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <Box minH="60vh" display="flex" alignItems="center" justifyContent="center">
        <Spinner size="xl" color="blue.500" />
      </Box>
    );
  }

  return (
    <Container maxW="1200px" py={{ base: 8, md: 12 }}>
      <Heading mb={6}>Admin Orders</Heading>

      <Stack spacing={4}>
        {orders.length === 0 ? (
          <Box bg="rgba(17,23,34,0.9)" border="1px solid" borderColor="whiteAlpha.100" borderRadius="2xl" p={6}>
            <Text color="gray.400">No orders found.</Text>
          </Box>
        ) : (
          orders.map((order) => (
            <Box
              key={order.id}
              bg="rgba(17,23,34,0.9)"
              border="1px solid"
              borderColor="whiteAlpha.100"
              borderRadius="2xl"
              p={6}
            >
              <HStack justify="space-between" align="start" flexWrap="wrap" gap={4}>
                <VStack align="start" spacing={1}>
                  <Text fontSize="lg" fontWeight="800">{order.orderNumber}</Text>
                  <Text color="gray.400">{new Date(order.createdAt).toLocaleString()}</Text>
                </VStack>

                <Badge colorScheme={order.paymentStatus === 'PAID' ? 'green' : 'orange'}>
                  Payment: {order.paymentStatus}
                </Badge>
              </HStack>

              <Box mt={5}>
                <Text fontWeight="700" mb={2}>Customer</Text>
                <Text>{order.customerName}</Text>
                <Text color="gray.400">{order.mobile}</Text>
                <Text color="gray.400">{order.address}</Text>
              </Box>

              <Box mt={5}>
                <Text fontWeight="700" mb={2}>Items</Text>
                <Stack spacing={1}>
                  {order.items?.map((item) => (
                    <Text key={`${order.id}-${item.foodName}`} color="gray.300">
                      {item.foodName} × {item.quantity}
                    </Text>
                  ))}
                </Stack>
              </Box>

              <Box mt={5}>
                <Text fontWeight="700" mb={2}>Summary</Text>
                <Text>Total: ₹{Number(order.finalAmount || 0).toFixed(2)}</Text>
                <Text>Payment Method: {order.paymentMethod}</Text>
              </Box>

              <Box mt={5}>
                <Text fontWeight="700" mb={2}>Update Status</Text>
                <Box
                  as="select"
                  value={order.orderStatus}
                  onChange={(event) => handleStatusChange(order.id, event.target.value)}
                  bg="gray.900"
                  border="1px solid"
                  borderColor="whiteAlpha.200"
                  borderRadius="md"
                  px={3}
                  py={2}
                  color="white"
                  disabled={updatingId === order.id}
                  width="100%"
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status} style={{ background: '#111827', color: 'white' }}>
                      {status}
                    </option>
                  ))}
                </Box>
              </Box>
            </Box>
          ))
        )}
      </Stack>
    </Container>
  );
};

export default AdminOrdersPage;
