import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  HStack,
  Input,
  Stack,
  Text,
  Textarea,
  VStack,
  Badge,
} from '@chakra-ui/react';
import { FiUser, FiPhone, FiMail, FiMapPin, FiCreditCard, FiCheckCircle, FiShoppingBag } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { saveToaster } from '../components/ui/toaster';

const PAYMENT_METHODS = [
  { value: 'COD', label: 'Cash on Delivery', icon: '💵', desc: 'Pay when your order arrives' },
  { value: 'UPI', label: 'UPI', icon: '📱', desc: 'Pay via UPI apps' },
  { value: 'CARD', label: 'Card', icon: '💳', desc: 'Debit or credit card' },
];

const FieldLabel = ({ children }) => (
  <Text mb={2} fontWeight="600" fontSize="sm" color="gray.300">{children}</Text>
);

const CheckoutPage = () => {
  const navigate = useNavigate();
  const {
    cartItems, subtotal, itemDiscount, couponDiscount,
    tax, deliveryFee, grandTotal, coupon, clearCart,
  } = useCart();

  const [formData, setFormData] = useState({
    customerName: '',
    mobile: '',
    email: '',
    address: '',
    paymentMethod: 'COD',
  });
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Guard: redirect to cart if empty
  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems.length, navigate]);

  const handleChange = (event) => {
    setFormData((c) => ({ ...c, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async () => {
    if (isSubmitting) return; // Prevent duplicate submissions

    if (!formData.customerName.trim() || !formData.mobile.trim() || !formData.address.trim()) {
      saveToaster.create({
        title: 'Missing details',
        description: 'Please enter your name, mobile number, and delivery address.',
        type: 'error',
      });
      return;
    }

    if (!/^\d{10}$/.test(formData.mobile.trim())) {
      saveToaster.create({
        title: 'Invalid mobile',
        description: 'Please enter a valid 10-digit mobile number.',
        type: 'error',
      });
      return;
    }

    // Validate email if provided
    if (formData.email && formData.email.trim() && !/^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(formData.email.trim())) {
      saveToaster.create({
        title: 'Invalid email',
        description: 'Please enter a valid email address.',
        type: 'error',
      });
      return;
    }

    setIsSubmitting(true);
    setLoading(true);

    try {
      const payload = {
        customerName: formData.customerName.trim(),
        mobile: formData.mobile.trim(),
        email: formData.email.trim() || null,
        address: formData.address.trim(),
        paymentMethod: formData.paymentMethod,
        deliveryFee,
        couponCode: coupon?.code || null,
        couponDiscount,
        items: cartItems.map((item) => ({
          foodItemId: item.id,
          quantity: item.quantity,
        })),
      };

      const response = await axios.post('http://localhost:8081/orders/create', payload);
      
      // Only clear cart after successful order creation
      clearCart();
      
      saveToaster.create({
        title: 'Order placed!',
        description: `Order ${response.data.orderNumber || ''} has been created.`,
        type: 'success',
      });
      navigate('/order-success', { state: { order: response.data } });
    } catch (error) {
      const msg = error?.response?.data?.message || 'Unable to place order. Please try again.';
      saveToaster.create({ title: 'Order failed', description: msg, type: 'error' });
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  const formatINR = (v) => `₹${Number(v || 0).toFixed(2)}`;

  return (
    <Box minH="100vh" bg="#070B14" color="white" py={{ base: 8, md: 12 }}>
      <Container maxW="1200px">

        {/* Header */}
        <Flex align="center" gap={3} mb={8}>
          <Box w="44px" h="44px" borderRadius="xl" bg="blue.500" display="flex" alignItems="center" justifyContent="center" flexShrink={0}>
            <FiShoppingBag size={22} color="white" />
          </Box>
          <Box>
            <Text color="blue.400" fontSize="xs" fontWeight="700" letterSpacing="3px" textTransform="uppercase">Checkout</Text>
            <Heading fontSize={{ base: '2xl', md: '3xl' }} fontWeight="900">Complete your order</Heading>
          </Box>
        </Flex>

        <Flex direction={{ base: 'column', xl: 'row' }} gap={8} align="flex-start">

          {/* Left: Customer info + Payment */}
          <Stack flex="1.5" gap={6}>

            {/* Customer info card */}
            <Box bg="rgba(17,23,34,0.95)" border="1px solid" borderColor="whiteAlpha.100" borderRadius="2xl" p={{ base: 5, md: 7 }}>
              <Flex align="center" gap={3} mb={6}>
                <Box w="36px" h="36px" borderRadius="lg" bg="blue.900" display="flex" alignItems="center" justifyContent="center">
                  <FiUser size={18} color="#60A5FA" />
                </Box>
                <Heading size="md" fontWeight="800">Customer Information</Heading>
              </Flex>

              <Stack gap={4}>
                <Box>
                  <FieldLabel>Full Name *</FieldLabel>
                  <Box position="relative">
                    <Box position="absolute" left={3} top="50%" transform="translateY(-50%)" color="gray.600" zIndex={1}><FiUser size={15} /></Box>
                    <Input
                      name="customerName"
                      value={formData.customerName}
                      onChange={handleChange}
                      placeholder="e.g. Rahul Sharma"
                      bg="rgba(0,0,0,0.3)"
                      border="1px solid"
                      borderColor="whiteAlpha.200"
                      _hover={{ borderColor: 'blue.700' }}
                      _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px #3B82F6' }}
                      color="white"
                      _placeholder={{ color: 'gray.600' }}
                      borderRadius="xl"
                      pl={9}
                    />
                  </Box>
                </Box>

                <Box>
                  <FieldLabel>Mobile Number *</FieldLabel>
                  <Box position="relative">
                    <Box position="absolute" left={3} top="50%" transform="translateY(-50%)" color="gray.600" zIndex={1}><FiPhone size={15} /></Box>
                    <Input
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleChange}
                      placeholder="10-digit mobile number"
                      bg="rgba(0,0,0,0.3)"
                      border="1px solid"
                      borderColor="whiteAlpha.200"
                      _hover={{ borderColor: 'blue.700' }}
                      _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px #3B82F6' }}
                      color="white"
                      _placeholder={{ color: 'gray.600' }}
                      borderRadius="xl"
                      pl={9}
                      type="tel"
                      maxLength={10}
                    />
                  </Box>
                </Box>

                <Box>
                  <FieldLabel>Email (optional)</FieldLabel>
                  <Box position="relative">
                    <Box position="absolute" left={3} top="50%" transform="translateY(-50%)" color="gray.600" zIndex={1}><FiMail size={15} /></Box>
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      bg="rgba(0,0,0,0.3)"
                      border="1px solid"
                      borderColor="whiteAlpha.200"
                      _hover={{ borderColor: 'blue.700' }}
                      _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px #3B82F6' }}
                      color="white"
                      _placeholder={{ color: 'gray.600' }}
                      borderRadius="xl"
                      pl={9}
                    />
                  </Box>
                </Box>

                <Box>
                  <FieldLabel>Delivery Address *</FieldLabel>
                  <Box position="relative">
                    <Box position="absolute" left={3} top="14px" color="gray.600" zIndex={1}><FiMapPin size={15} /></Box>
                    <Textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="House/flat no., street, area, city, pincode"
                      bg="rgba(0,0,0,0.3)"
                      border="1px solid"
                      borderColor="whiteAlpha.200"
                      _hover={{ borderColor: 'blue.700' }}
                      _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px #3B82F6' }}
                      color="white"
                      _placeholder={{ color: 'gray.600' }}
                      borderRadius="xl"
                      pl={9}
                      rows={3}
                      resize="none"
                    />
                  </Box>
                </Box>
              </Stack>
            </Box>

            {/* Payment method card */}
            <Box bg="rgba(17,23,34,0.95)" border="1px solid" borderColor="whiteAlpha.100" borderRadius="2xl" p={{ base: 5, md: 7 }}>
              <Flex align="center" gap={3} mb={6}>
                <Box w="36px" h="36px" borderRadius="lg" bg="purple.900" display="flex" alignItems="center" justifyContent="center">
                  <FiCreditCard size={18} color="#A78BFA" />
                </Box>
                <Heading size="md" fontWeight="800">Payment Method</Heading>
              </Flex>

              <Stack gap={3}>
                {PAYMENT_METHODS.map((method) => {
                  const selected = formData.paymentMethod === method.value;
                  return (
                    <Box
                      as="label"
                      key={method.value}
                      display="flex"
                      alignItems="center"
                      gap={4}
                      p={4}
                      borderRadius="xl"
                      border="2px solid"
                      borderColor={selected ? 'blue.500' : 'whiteAlpha.100'}
                      bg={selected ? 'rgba(59,130,246,0.08)' : 'rgba(0,0,0,0.2)'}
                      cursor="pointer"
                      transition="all 0.2s"
                      _hover={{ borderColor: 'blue.700' }}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.value}
                        checked={selected}
                        onChange={(e) => setFormData((c) => ({ ...c, paymentMethod: e.target.value }))}
                        style={{ display: 'none' }}
                      />
                      <Box fontSize="24px" flexShrink={0}>{method.icon}</Box>
                      <Box flex="1">
                        <Text fontWeight="700" fontSize="sm">{method.label}</Text>
                        <Text color="gray.500" fontSize="xs">{method.desc}</Text>
                      </Box>
                      {selected && (
                        <Box color="blue.400"><FiCheckCircle size={20} /></Box>
                      )}
                    </Box>
                  );
                })}
              </Stack>
            </Box>
          </Stack>

          {/* Right: Order summary */}
          <Box
            flex="1"
            position={{ xl: 'sticky' }}
            top={{ xl: '100px' }}
            bg="rgba(17,23,34,0.95)"
            border="1px solid"
            borderColor="whiteAlpha.100"
            borderRadius="2xl"
            p={{ base: 5, md: 6 }}
          >
            <Heading size="md" mb={5} fontWeight="800">Order Summary</Heading>

            {/* Items list */}
            <Stack gap={2} mb={5}>
              {cartItems.map((item) => (
                <HStack key={item.id} justify="space-between">
                  <Text fontSize="sm" color="gray.300" isTruncated flex="1">
                    {item.name} × {item.quantity}
                  </Text>
                  <Text fontSize="sm" fontWeight="700" flexShrink={0}>
                    {formatINR(Number(item.price) * item.quantity)}
                  </Text>
                </HStack>
              ))}
            </Stack>

            <Box borderTop="1px solid" borderColor="whiteAlpha.200" pt={4}>
              <VStack align="stretch" gap={3}>
                <HStack justify="space-between">
                  <Text color="gray.400" fontSize="sm">Subtotal</Text>
                  <Text fontWeight="700">{formatINR(subtotal)}</Text>
                </HStack>

                {itemDiscount > 0 && (
                  <HStack justify="space-between">
                    <Text color="gray.400" fontSize="sm">Item discounts</Text>
                    <Text color="green.400" fontWeight="700">-{formatINR(itemDiscount)}</Text>
                  </HStack>
                )}

                {coupon && couponDiscount > 0 && (
                  <HStack justify="space-between">
                    <Flex align="center" gap={1.5}>
                      <Text color="gray.400" fontSize="sm">Coupon</Text>
                      <Badge colorPalette="green" borderRadius="full" fontSize="10px" px={1.5}>{coupon.code}</Badge>
                    </Flex>
                    <Text color="green.400" fontWeight="700">-{formatINR(couponDiscount)}</Text>
                  </HStack>
                )}

                <HStack justify="space-between">
                  <Text color="gray.400" fontSize="sm">Tax (5%)</Text>
                  <Text fontWeight="700">{formatINR(tax)}</Text>
                </HStack>

                <HStack justify="space-between">
                  <Text color="gray.400" fontSize="sm">Delivery</Text>
                  <Text fontWeight="700">{formatINR(deliveryFee)}</Text>
                </HStack>

                <Box borderTop="1px solid" borderColor="whiteAlpha.200" pt={3}>
                  <HStack justify="space-between">
                    <Text fontWeight="800" fontSize="md">Total</Text>
                    <Text fontSize="xl" fontWeight="900" color="blue.300">{formatINR(grandTotal)}</Text>
                  </HStack>
                  {(itemDiscount + couponDiscount) > 0 && (
                    <Text fontSize="xs" color="green.400" mt={1} textAlign="right">
                      Total savings: {formatINR(itemDiscount + couponDiscount)} 🎉
                    </Text>
                  )}
                </Box>
              </VStack>
            </Box>

            <Button
              mt={6}
              colorPalette="blue"
              size="lg"
              w="100%"
              borderRadius="xl"
              fontWeight="800"
              fontSize="md"
              onClick={handleSubmit}
              loading={loading}
            >
              <FiCheckCircle />
              Place Order — {formatINR(grandTotal)}
            </Button>

            <Button
              mt={3}
              variant="ghost"
              size="sm"
              w="100%"
              color="gray.500"
              onClick={() => navigate('/cart')}
              _hover={{ color: 'gray.300' }}
            >
              ← Back to Cart
            </Button>
          </Box>
        </Flex>
      </Container>
    </Box>
  );
};

export default CheckoutPage;
