import React, { useState } from 'react';
import {
  Badge,
  Box,
  Button,
  Container,
  Flex,
  Heading,
  HStack,
  Image,
  Input,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react';
import { FiMinus, FiPlus, FiShoppingBag, FiTag, FiTrash2, FiArrowRight, FiShoppingCart } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { saveToaster } from '../components/ui/toaster';

const MotionBox = motion.div;

const CartPage = () => {
  const navigate = useNavigate();
  const {
    cartItems, subtotal, itemDiscount, couponDiscount,
    tax, deliveryFee, grandTotal,
    coupon, applyCoupon, removeCoupon,
    removeFromCart, increaseQuantity, decreaseQuantity, clearCart,
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);

  const handleApplyCoupon = () => {
    if (!couponInput.trim()) return;
    setCouponLoading(true);
    setTimeout(() => {
      const result = applyCoupon(couponInput);
      if (result.success) {
        saveToaster.create({ title: 'Coupon applied!', description: result.message, type: 'success' });
        setCouponInput('');
      } else {
        saveToaster.create({ title: 'Invalid coupon', description: result.message, type: 'error' });
      }
      setCouponLoading(false);
    }, 600);
  };

  const handleProceedToCheckout = () => {
    if (cartItems.length === 0) {
      saveToaster.create({ title: 'Cart is empty', description: 'Please add at least one food item before checkout.', type: 'error' });
      return;
    }
    navigate('/checkout');
  };

  const formatINR = (val) => `₹${Number(val || 0).toFixed(2)}`;

  return (
    <Box minH="100vh" bg="#070B14" color="white" py={{ base: 8, md: 12 }}>
      <Container maxW="1200px">

        {/* Header */}
        <MotionBox initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <Flex align="center" gap={3} mb={8}>
            <Box w="44px" h="44px" borderRadius="xl" bg="blue.500" display="flex" alignItems="center" justifyContent="center" flexShrink={0}>
              <FiShoppingBag size={22} color="white" />
            </Box>
            <Box>
              <Text color="blue.400" fontSize="xs" fontWeight="700" letterSpacing="3px" textTransform="uppercase">Your Cart</Text>
              <Heading fontSize={{ base: '2xl', md: '3xl' }} fontWeight="900">
                {cartItems.length > 0 ? `${cartItems.length} item${cartItems.length > 1 ? 's' : ''} in your cart` : 'Your cart'}
              </Heading>
            </Box>
          </Flex>
        </MotionBox>

        {cartItems.length === 0 ? (
          /* Empty state */
          <MotionBox initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}>
            <Box bg="rgba(17,23,34,0.9)" border="1px solid" borderColor="whiteAlpha.100" borderRadius="2xl" p={{ base: 10, md: 16 }} textAlign="center">
              <Box display="inline-flex" bg="blue.900" borderRadius="full" p={6} mb={4}>
                <FiShoppingCart size={40} color="#60A5FA" />
              </Box>
              <Heading size="lg" color="white" mb={3}>Your cart is empty</Heading>
              <Text color="gray.400" maxW="400px" mx="auto">Add delicious food items from our menu to get started on your order.</Text>
              <Button mt={6} colorPalette="blue" borderRadius="xl" size="lg" onClick={() => navigate('/menu')}>
                <FiShoppingBag />
                Browse Menu
              </Button>
            </Box>
          </MotionBox>
        ) : (
          <Flex direction={{ base: 'column', xl: 'row' }} gap={8} align="flex-start">

            {/* Cart items */}
            <Box flex="1.4">
              <Flex justify="space-between" align="center" mb={4}>
                <Text color="gray.400" fontSize="sm">{cartItems.length} item{cartItems.length > 1 ? 's' : ''}</Text>
                <Button variant="ghost" size="sm" color="red.400" onClick={clearCart} _hover={{ bg: 'red.900', color: 'red.300' }}>
                  <FiTrash2 />
                  Clear all
                </Button>
              </Flex>

              <Stack gap={4}>
                <AnimatePresence>
                  {cartItems.map((item, index) => (
                    <MotionBox
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20, height: 0 }}
                      transition={{ delay: index * 0.06, duration: 0.3 }}
                    >
                      <Box
                        bg="rgba(17,23,34,0.95)"
                        border="1px solid"
                        borderColor="whiteAlpha.100"
                        borderRadius="2xl"
                        p={{ base: 4, md: 5 }}
                        _hover={{ borderColor: 'blue.800' }}
                        transition="border-color 0.2s"
                      >
                        <Flex gap={4} align={{ base: 'flex-start', sm: 'center' }} direction={{ base: 'column', sm: 'row' }}>
                          {/* Image */}
                          <Box flexShrink={0} position="relative">
                            <Image
                              src={item.image || 'https://images.unsplash.com/photo-1544025162-d76694265947?w=200'}
                              alt={item.name}
                              w={{ base: '100%', sm: '130px' }}
                              h={{ base: '180px', sm: '110px' }}
                              objectFit="cover"
                              borderRadius="xl"
                            />
                            {item.foodType && (
                              <Badge
                                position="absolute" top={2} left={2}
                                bg={item.foodType === 'VEG' ? 'green.500' : 'red.500'}
                                color="white" borderRadius="full" px={2} fontSize="10px"
                              >
                                {item.foodType}
                              </Badge>
                            )}
                          </Box>

                          {/* Info */}
                          <Box flex="1" w="100%">
                            <Flex justify="space-between" align="flex-start" gap={2}>
                              <Box>
                                <Text fontWeight="800" fontSize={{ base: 'md', md: 'lg' }}>{item.name}</Text>
                                <Text color="gray.500" fontSize="xs" mt={0.5}>{item.category?.name || 'Food'}</Text>
                              </Box>
                              <Button
                                variant="ghost" size="sm"
                                color="gray.600"
                                _hover={{ color: 'red.400', bg: 'red.900' }}
                                borderRadius="lg"
                                onClick={() => removeFromCart(item.id)}
                                p={1}
                              >
                                <FiTrash2 size={16} />
                              </Button>
                            </Flex>

                            <Flex mt={4} justify="space-between" align="center" flexWrap="wrap" gap={3}>
                              {/* Qty control */}
                              <HStack
                                bg="rgba(0,0,0,0.3)"
                                border="1px solid"
                                borderColor="whiteAlpha.100"
                                borderRadius="full"
                                p={1}
                                gap={0}
                              >
                                <Button
                                  size="sm" variant="ghost"
                                  borderRadius="full" p={2}
                                  _hover={{ bg: 'blue.800' }}
                                  onClick={() => decreaseQuantity(item.id)}
                                >
                                  <FiMinus size={14} />
                                </Button>
                                <Text minW="32px" textAlign="center" fontWeight="800" fontSize="md">{item.quantity}</Text>
                                <Button
                                  size="sm" variant="ghost"
                                  borderRadius="full" p={2}
                                  _hover={{ bg: 'blue.800' }}
                                  onClick={() => increaseQuantity(item.id)}
                                >
                                  <FiPlus size={14} />
                                </Button>
                              </HStack>

                              {/* Price */}
                              <Box textAlign="right">
                                <Text color="blue.300" fontSize="lg" fontWeight="900">
                                  {formatINR(Number(item.price) * item.quantity)}
                                </Text>
                                {item.quantity > 1 && (
                                  <Text color="gray.600" fontSize="xs">{formatINR(item.price)} each</Text>
                                )}
                              </Box>
                            </Flex>
                          </Box>
                        </Flex>
                      </Box>
                    </MotionBox>
                  ))}
                </AnimatePresence>
              </Stack>
            </Box>

            {/* Order summary */}
            <Box
              flex="1"
              position={{ xl: 'sticky' }}
              top={{ xl: '100px' }}
              bg="rgba(17,23,34,0.95)"
              border="1px solid"
              borderColor="whiteAlpha.100"
              borderRadius="2xl"
              p={6}
            >
              <Heading size="md" mb={5} fontWeight="800">Order Summary</Heading>

              {/* Coupon section */}
              <Box bg="rgba(0,0,0,0.25)" border="1px solid" borderColor="whiteAlpha.100" borderRadius="xl" p={4} mb={5}>
                <Flex align="center" gap={2} mb={3}>
                  <FiTag color="#60A5FA" size={16} />
                  <Text fontSize="sm" fontWeight="700" color="blue.300">Coupons &amp; Offers</Text>
                </Flex>

                {coupon ? (
                  <Flex align="center" justify="space-between" bg="green.900" border="1px solid" borderColor="green.700" borderRadius="lg" px={3} py={2}>
                    <Box>
                      <Text fontSize="sm" fontWeight="800" color="green.300">{coupon.code}</Text>
                      <Text fontSize="xs" color="green.400">{coupon.description}</Text>
                    </Box>
                    <Button size="xs" variant="ghost" color="red.400" onClick={removeCoupon} _hover={{ color: 'red.300' }}>
                      Remove
                    </Button>
                  </Flex>
                ) : (
                  <Flex gap={2}>
                    <Input
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                      placeholder="Enter coupon code"
                      borderColor="whiteAlpha.200"
                      bg="rgba(0,0,0,0.3)"
                      color="white"
                      _placeholder={{ color: 'gray.600' }}
                      borderRadius="lg"
                      fontSize="sm"
                      textTransform="uppercase"
                    />
                    <Button
                      colorPalette="blue"
                      borderRadius="lg"
                      size="md"
                      px={4}
                      onClick={handleApplyCoupon}
                      loading={couponLoading}
                      flexShrink={0}
                    >
                      Apply
                    </Button>
                  </Flex>
                )}

                <Text fontSize="10px" color="gray.600" mt={2}>Try: WELCOME10 · FLAT50 · SAVE20 · NEWUSER</Text>
              </Box>

              {/* Price breakdown */}
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

                <Box borderTop="1px solid" borderColor="whiteAlpha.200" pt={3} mt={1}>
                  <HStack justify="space-between">
                    <Text fontWeight="800" fontSize="md">Total</Text>
                    <Text fontSize="xl" fontWeight="900" color="blue.300">{formatINR(grandTotal)}</Text>
                  </HStack>
                  {(itemDiscount + couponDiscount) > 0 && (
                    <Text fontSize="xs" color="green.400" mt={1} textAlign="right">
                      You save {formatINR(itemDiscount + couponDiscount)} 🎉
                    </Text>
                  )}
                </Box>
              </VStack>

              <Button
                mt={5}
                colorPalette="blue"
                size="lg"
                w="100%"
                borderRadius="xl"
                fontWeight="800"
                onClick={handleProceedToCheckout}
              >
                Proceed to Checkout
                <FiArrowRight />
              </Button>

              <Button
                mt={3}
                variant="outline"
                size="md"
                w="100%"
                borderRadius="xl"
                color="gray.500"
                borderColor="whiteAlpha.200"
                _hover={{ bg: 'whiteAlpha.50' }}
                onClick={() => navigate('/menu')}
              >
                Continue Shopping
              </Button>
            </Box>
          </Flex>
        )}
      </Container>
    </Box>
  );
};

export default CartPage;
