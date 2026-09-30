import React, { useEffect, useMemo, useState } from 'react';
import {
  Badge,
  Box,
  Button,
  Container,
  Flex,
  Heading,
  HStack,
  Input,
  Select,
  SimpleGrid,
  Spinner,
  Text,
  VStack,
  IconButton,
} from '@chakra-ui/react';
import { FiSearch, FiFilter, FiCalendar, FiX, FiClock, FiUsers } from 'react-icons/fi';
import FoodCard from '../components/FoodCard';
import { getCategories, getFoods, searchFoods } from '../services/foodService';
import { createBooking, lookupBookingsByMobile, mapBookingValidationErrors } from '../services/bookingService';
import { useCart } from '../context/CartContext';
import { saveToaster } from '../components/ui/toaster';

const getCategoryEmoji = (categoryName) => {
  const name = categoryName?.toLowerCase() || "";
  if (name.includes("pizza")) return "🍕";
  if (name.includes("burger")) return "🍔";
  if (name.includes("pasta")) return "🍝";
  if (name.includes("drink") || name.includes("beverage")) return "🥤";
  if (name.includes("dessert") || name.includes("cake")) return "🍰";
  if (name.includes("starter") || name.includes("appetizer")) return "🍽";
  if (name.includes("main") || name.includes("course")) return "🍛";
  if (name.includes("salad")) return "🥗";
  return "🍽️";
};

const MenuPage = () => {
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('default');
  const [loading, setLoading] = useState(true);
  const [showBooking, setShowBooking] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    name: '',
    phone: '',
    date: '',
    time: '',
    guests: '',
    specialRequest: ''
  });
  const [bookingErrors, setBookingErrors] = useState({});
  const [bookingSubmitting, setBookingSubmitting] = useState(false);
  const [submittedBooking, setSubmittedBooking] = useState(null);
  const [lookupMobile, setLookupMobile] = useState('');
  const [lookupResults, setLookupResults] = useState([]);
  const [lookupLoading, setLookupLoading] = useState(false);

  const { cartItems, addToCart, increaseQuantity, decreaseQuantity } = useCart();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [foodData, categoryData] = await Promise.all([getFoods(), getCategories()]);
        setFoods(foodData || []);
        setCategories(categoryData || []);
      } catch (error) {
        saveToaster.create({
          title: 'Unable to load menu',
          description: 'Please check the backend server and try again.',
          type: 'error',
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!search.trim()) {
        const foodData = await getFoods();
        setFoods(foodData || []);
        return;
      }

      try {
        const result = await searchFoods(search);
        setFoods(result || []);
      } catch {
        saveToaster.create({
          title: 'Search failed',
          description: 'Unable to search food items.',
          type: 'error',
        });
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  const filteredFoods = useMemo(() => {
    let items = [...foods];

    if (selectedCategory !== 'ALL') {
      items = items.filter(
        (food) => food.category && food.category.id === Number(selectedCategory)
      );
    }

    if (sort === 'low-to-high') {
      items.sort((a, b) => Number(a.price) - Number(b.price));
    }

    if (sort === 'high-to-low') {
      items.sort((a, b) => Number(b.price) - Number(a.price));
    }

    return items;
  }, [foods, selectedCategory, sort]);

  const cartMap = useMemo(
    () =>
      cartItems.reduce((acc, item) => {
        acc[item.id] = item.quantity;
        return acc;
      }, {}),
    [cartItems]
  );

  const handleAddToCart = (item) => {
    if (!item.available) {
      saveToaster.create({
        title: 'Unavailable item',
        description: 'This food item is currently out of stock.',
        type: 'error',
      });
      return;
    }

    addToCart(item);
    saveToaster.create({
      title: 'Added to cart',
      description: `${item.name} has been added to your cart.`,
      type: 'success',
    });
  };

  const validateBookingForm = () => {
    const errors = {};
    
    if (!bookingForm.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!bookingForm.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!/^[0-9]{10}$/.test(bookingForm.phone.replace(/\D/g, ''))) {
      errors.phone = 'Please enter a valid 10-digit phone number';
    }
    
    if (!bookingForm.date) {
      errors.date = 'Date is required';
    } else {
      const selectedDate = new Date(bookingForm.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        errors.date = 'Cannot book for past dates';
      }
    }
    
    if (!bookingForm.time) {
      errors.time = 'Time is required';
    } else {
      const [hours, minutes] = bookingForm.time.split(':').map(Number);
      if (hours < 11 || hours > 22 || (hours === 22 && minutes > 0)) {
        errors.time = 'Bookings are available between 11:00 AM and 10:00 PM';
      }
    }
    
    if (!bookingForm.guests) {
      errors.guests = 'Number of guests is required';
    } else if (parseInt(bookingForm.guests) < 1 || parseInt(bookingForm.guests) > 20) {
      errors.guests = 'Number of guests must be between 1 and 20';
    }
    
    setBookingErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();

    if (!validateBookingForm()) {
      return;
    }

    setBookingSubmitting(true);
    try {
      const bookingTime = bookingForm.time.length >= 5
        ? bookingForm.time.slice(0, 5)
        : bookingForm.time;

      const created = await createBooking({
        customerName: bookingForm.name.trim(),
        mobile: bookingForm.phone.replace(/\D/g, ''),
        bookingDate: bookingForm.date,
        bookingTime,
        guests: Number(bookingForm.guests),
        specialRequest: bookingForm.specialRequest.trim() || null,
      });

      setSubmittedBooking(created);
      setBookingForm({
        name: '',
        phone: '',
        date: '',
        time: '',
        guests: '',
        specialRequest: ''
      });
      setBookingErrors({});
      setShowBooking(false);

      saveToaster.create({
        title: 'Booking Request Submitted',
        description: `Booking #${created.id} has been sent to the restaurant. Status: Pending Approval.`,
        type: 'success',
      });
    } catch (error) {
      const mapped = mapBookingValidationErrors(error);
      if (Object.keys(mapped).length > 0) {
        setBookingErrors((prev) => ({ ...prev, ...mapped }));
      }
      saveToaster.create({
        title: 'Unable to submit booking',
        description: error?.response?.data?.message || 'Please check your details and try again.',
        type: 'error',
      });
    } finally {
      setBookingSubmitting(false);
    }
  };

  const handleLookupStatus = async () => {
    const mobile = lookupMobile.replace(/\D/g, '');
    if (!/^\d{10}$/.test(mobile)) {
      saveToaster.create({
        title: 'Enter a valid mobile number',
        description: 'Use the 10-digit number from your booking request.',
        type: 'error',
      });
      return;
    }

    setLookupLoading(true);
    try {
      const results = await lookupBookingsByMobile(mobile);
      setLookupResults(results || []);
      if (!results || results.length === 0) {
        saveToaster.create({
          title: 'No bookings found',
          description: 'We could not find a reservation for this mobile number.',
          type: 'error',
        });
      }
    } catch (error) {
      saveToaster.create({
        title: 'Unable to check status',
        description: error?.response?.data?.message || 'Please try again.',
        type: 'error',
      });
    } finally {
      setLookupLoading(false);
    }
  };

  const handleBookingChange = (field, value) => {
    setBookingForm(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (bookingErrors[field]) {
      setBookingErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const clearFilters = () => {
    setSearch('');
    setSelectedCategory('ALL');
    setSort('default');
  };

  if (loading) {
    return (
      <Box minH="100vh" bg="#070B14" color="white" py={{ base: 8, md: 14 }}>
        <Container maxW="1250px">
          <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} spacing={8}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Box
                key={i}
                bg="rgba(16,23,37,0.9)"
                border="1px solid"
                borderColor="whiteAlpha.100"
                borderRadius="2xl"
                overflow="hidden"
                h="400px"
              >
                <Box h="220px" bg="gray.800" />
                <Box p={5}>
                  <Box h={6} w="70%" bg="gray.700" borderRadius="4" mb={3} />
                  <Box h={4} w="40%" bg="gray.700" borderRadius="4" mb={4} />
                  <Box h={4} w="100%" bg="gray.700" borderRadius="4" mb={2} />
                  <Box h={4} w="80%" bg="gray.700" borderRadius="4" mb={4} />
                  <Box h={10} w="100%" bg="gray.700" borderRadius="lg" />
                </Box>
              </Box>
            ))}
          </SimpleGrid>
        </Container>
      </Box>
    );
  }

  return (
    <Box minH="100vh" bg="#070B14" color="white">
      {/* Hero Section */}
      <Box
        position="relative"
        bg="linear-gradient(135deg, rgba(7,11,20,0.95) 0%, rgba(17,23,34,0.9) 100%)"
        py={{ base: 12, md: 20 }}
        borderBottom="1px solid"
        borderColor="whiteAlpha.100"
      >
        <Container maxW="1250px">
          <Box
            textAlign="center"
          >
            <Badge
              bg="rgba(212,160,23,0.15)"
              color="#D4A017"
              border="1px solid"
              borderColor="#D4A017"
              px={4}
              py={1.5}
              borderRadius="full"
              fontSize="xs"
              fontWeight="700"
              letterSpacing="2px"
              mb={6}
            >
              OUR MENU
            </Badge>
            
            <Heading
              fontSize={{ base: '3xl', md: '5xl', lg: '6xl' }}
              fontWeight="900"
              lineHeight="1.1"
              mb={4}
            >
              Discover Something
              <Text as="span" color="#D4A017" display={{ base: 'block', md: 'inline' }}>
                {' '}Delicious
              </Text>
            </Heading>
            
            <Text
              maxW="600px"
              mx="auto"
              color="gray.400"
              fontSize={{ base: 'md', md: 'lg' }}
              lineHeight="1.7"
              mb={8}
            >
              Explore our carefully crafted dishes, from traditional favorites to modern creations
            </Text>

            {/* Search Bar */}
            <Box
              maxW="500px"
              mx="auto"
              position="relative"
            >
              <HStack
                bg="rgba(255,255,255,0.05)"
                border="1px solid"
                borderColor="whiteAlpha.200"
                borderRadius="full"
                px={5}
                py={3}
                transition="all 0.3s"
                _focusWithin={{
                  borderColor: '#D4A017',
                  bg: 'rgba(255,255,255,0.08)',
                  boxShadow: '0 0 20px rgba(212,160,23,0.15)',
                }}
              >
                <FiSearch color="#D4A017" size={20} />
                <Input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search for dishes..."
                  variant="unstyled"
                  color="white"
                  fontSize="md"
                  _placeholder={{ color: 'gray.500' }}
                />
                {search && (
                  <IconButton
                    aria-label="Clear search"
                    icon={<FiX />}
                    size="sm"
                    variant="ghost"
                    color="gray.400"
                    onClick={() => setSearch('')}
                    _hover={{ color: 'white' }}
                  />
                )}
              </HStack>
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxW="1250px" py={{ base: 8, md: 12 }}>
        {/* Filters Section */}
        <Box mb={10}>
          <Flex
            direction={{ base: 'column', md: 'row' }}
            gap={4}
            justify="space-between"
            align={{ base: 'stretch', md: 'center' }}
            mb={6}
          >
            {/* Categories */}
            <HStack
              spacing={2}
              overflowX="auto"
              pb={2}
              css={{
                '&::-webkit-scrollbar': {
                  height: '4px',
                },
                '&::-webkit-scrollbar-track': {
                  background: 'rgba(255,255,255,0.05)',
                  borderRadius: '10px',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: '#D4A017',
                  borderRadius: '10px',
                },
              }}
            >
              <Button
                key="all"
                size="sm"
                borderRadius="full"
                px={4}
                fontSize="sm"
                fontWeight="600"
                bg={selectedCategory === 'ALL' ? '#D4A017' : 'transparent'}
                color={selectedCategory === 'ALL' ? 'black' : 'gray.300'}
                border="1px solid"
                borderColor={selectedCategory === 'ALL' ? '#D4A017' : 'whiteAlpha.200'}
                _hover={{ 
                  transform: 'scale(1.05)',
                  borderColor: '#D4A017',
                  bg: selectedCategory === 'ALL' ? '#D4A017' : 'rgba(212,160,23,0.1)'
                }}
                _active={{ transform: 'scale(0.95)' }}
                transition="transform 0.2s"
                onClick={() => setSelectedCategory('ALL')}
              >
                All
              </Button>

              {categories.map((category) => (
                <Button
                  key={category.id}
                  size="sm"
                  borderRadius="full"
                  px={4}
                  fontSize="sm"
                  fontWeight="600"
                  bg={selectedCategory === String(category.id) ? '#D4A017' : 'transparent'}
                  color={selectedCategory === String(category.id) ? 'black' : 'gray.300'}
                  border="1px solid"
                  borderColor={selectedCategory === String(category.id) ? '#D4A017' : 'whiteAlpha.200'}
                  _hover={{ 
                    transform: 'scale(1.05)',
                    borderColor: '#D4A017',
                    bg: selectedCategory === String(category.id) ? '#D4A017' : 'rgba(212,160,23,0.1)'
                  }}
                  _active={{ transform: 'scale(0.95)' }}
                  transition="transform 0.2s"
                  onClick={() => setSelectedCategory(String(category.id))}
                  whiteSpace="nowrap"
                >
                  {getCategoryEmoji(category.name)} {category.name}
                </Button>
              ))}
            </HStack>

            {/* Sort */}
            <Box display={{ base: 'none', md: 'block' }}>
              <Text fontSize="sm" color="gray.400">
                Sort by: Default
              </Text>
            </Box>
          </Flex>
        </Box>

        {/* Food Grid */}
        {filteredFoods.length === 0 ? (
          <Box
            textAlign="center"
            py={20}
          >
            <Box
              w="100px"
              h="100px"
              mx="auto"
              borderRadius="full"
              bg="rgba(212,160,23,0.1)"
              display="flex"
              alignItems="center"
              justifyContent="center"
              mb={6}
            >
              <FiFilter size={40} color="#D4A017" />
            </Box>
            <Heading fontSize="2xl" mb={3}>
              No dishes found
            </Heading>
            <Text color="gray.400" mb={6} maxW="400px" mx="auto">
              Try adjusting your search or filters to find what you're looking for.
            </Text>
            <Button
              bg="#D4A017"
              color="black"
              borderRadius="full"
              px={8}
              fontWeight="700"
              _hover={{ bg: '#E5B52A' }}
              onClick={clearFilters}
            >
              Clear Filters
            </Button>
          </Box>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} spacing={6}>
            {filteredFoods.map((item) => (
              <Box
                key={item.id}
              >
                <FoodCard
                  item={item}
                  cartQuantity={cartMap[item.id] || 0}
                  onAddToCart={handleAddToCart}
                  onIncrease={increaseQuantity}
                  onDecrease={decreaseQuantity}
                />
              </Box>
            ))}
          </SimpleGrid>
        )}

        {/* Table Booking Section */}
        <Box mt={20}>
          <Box
            bg="linear-gradient(135deg, rgba(212,160,23,0.1) 0%, rgba(17,23,34,0.9) 100%)"
            border="1px solid"
            borderColor="rgba(212,160,23,0.3)"
            borderRadius="3xl"
            p={{ base: 8, md: 12 }}
            position="relative"
            overflow="hidden"
          >
            {/* Decorative Elements */}
            <Box
              position="absolute"
              top="-50px"
              right="-50px"
              w="200px"
              h="200px"
              bg="rgba(212,160,23,0.1)"
              borderRadius="full"
              filter="blur(60px)"
            />
            <Box
              position="absolute"
              bottom="-50px"
              left="-50px"
              w="150px"
              h="150px"
              bg="rgba(212,160,23,0.08)"
              borderRadius="full"
              filter="blur(50px)"
            />

            <Flex
              direction={{ base: 'column', lg: 'row' }}
              gap={8}
              position="relative"
              zIndex={1}
            >
              <Box flex={1}>
                <Badge
                  bg="rgba(212,160,23,0.2)"
                  color="#D4A017"
                  px={3}
                  py={1}
                  borderRadius="full"
                  fontSize="xs"
                  fontWeight="700"
                  letterSpacing="1px"
                  mb={4}
                >
                  RESERVATION
                </Badge>
                
                <Heading
                  fontSize={{ base: '2xl', md: '3xl' }}
                  fontWeight="800"
                  mb={4}
                >
                  Reserve Your Table
                </Heading>
                
                <Text
                  color="gray.400"
                  fontSize={{ base: 'md', md: 'lg' }}
                  lineHeight="1.7"
                  mb={6}
                >
                  Planning a special meal? Reserve your table in advance and let us make your dining experience unforgettable.
                </Text>

                <HStack spacing={6} mb={6}>
                  <HStack>
                    <Box
                      w="12"
                      h="12"
                      borderRadius="full"
                      bg="rgba(212,160,23,0.15)"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <FiClock color="#D4A017" />
                    </Box>
                    <Box>
                      <Text fontSize="sm" color="gray.400">Opening Hours</Text>
                      <Text fontWeight="600">11 AM - 10 PM</Text>
                    </Box>
                  </HStack>
                  
                  <HStack>
                    <Box
                      w="12"
                      h="12"
                      borderRadius="full"
                      bg="rgba(212,160,23,0.15)"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <FiUsers color="#D4A017" />
                    </Box>
                    <Box>
                      <Text fontSize="sm" color="gray.400">Capacity</Text>
                      <Text fontWeight="600">Up to 20 guests</Text>
                    </Box>
                  </HStack>
                </HStack>

                {!showBooking && (
                  <Button
                    bg="#D4A017"
                    color="black"
                    borderRadius="full"
                    px={8}
                    size="lg"
                    fontWeight="700"
                    leftIcon={<FiCalendar />}
                    _hover={{ bg: '#E5B52A', transform: 'translateY(-2px)' }}
                    transition="all 0.3s"
                    onClick={() => {
                      setSubmittedBooking(null);
                      setShowBooking(true);
                    }}
                  >
                    {submittedBooking ? 'Book Another Table' : 'Book a Table'}
                  </Button>
                )}
              </Box>

              {submittedBooking && !showBooking && (
                <Box
                  flex={1}
                  bg="rgba(0,0,0,0.3)"
                  border="1px solid"
                  borderColor="rgba(212,160,23,0.4)"
                  borderRadius="2xl"
                  p={{ base: 6, md: 8 }}
                >
                  <Badge bg="rgba(212,160,23,0.2)" color="#D4A017" mb={3} borderRadius="full" px={3} py={1}>
                    Pending Approval
                  </Badge>
                  <Heading fontSize="xl" fontWeight="700" mb={2}>
                    Booking Request Submitted
                  </Heading>
                  <Text color="gray.400" mb={4}>
                    Your request has been sent to the restaurant. This is not a confirmed reservation yet.
                  </Text>
                  <VStack align="stretch" gap={2} fontSize="sm">
                    <Text><strong>Booking ID:</strong> #{submittedBooking.id}</Text>
                    <Text><strong>Status:</strong> {submittedBooking.status}</Text>
                    <Text><strong>Date:</strong> {submittedBooking.bookingDate}</Text>
                    <Text><strong>Time:</strong> {submittedBooking.bookingTime}</Text>
                    <Text><strong>Guests:</strong> {submittedBooking.guests}</Text>
                  </VStack>
                </Box>
              )}

              {showBooking && (
                <Box
                  flex={1}
                  bg="rgba(0,0,0,0.3)"
                  border="1px solid"
                  borderColor="whiteAlpha.100"
                  borderRadius="2xl"
                  p={{ base: 6, md: 8 }}
                >
                  <Flex justify="space-between" align="center" mb={6}>
                    <Heading fontSize="xl" fontWeight="700">
                      Booking Details
                    </Heading>
                    <IconButton
                      aria-label="Close booking form"
                      icon={<FiX />}
                      variant="ghost"
                      color="gray.400"
                      onClick={() => setShowBooking(false)}
                      _hover={{ color: 'white' }}
                    />
                  </Flex>

                  <VStack gap={4} as="form" onSubmit={handleBookingSubmit}>
                    <Box w="full">
                      <Text fontSize="sm" color="gray.400" mb={2}>
                        Full Name *
                      </Text>
                      <Input
                        value={bookingForm.name}
                        onChange={(e) => handleBookingChange('name', e.target.value)}
                        placeholder="Enter your name"
                        bg="rgba(255,255,255,0.05)"
                        border="1px solid"
                        borderColor={bookingErrors.name ? 'red.500' : 'whiteAlpha.200'}
                        borderRadius="lg"
                        color="white"
                        _placeholder={{ color: 'gray.500' }}
                        _focus={{
                          borderColor: '#D4A017',
                          boxShadow: '0 0 0 1px #D4A017',
                        }}
                      />
                      {bookingErrors.name && (
                        <Text fontSize="xs" color="red.400" mt={1}>
                          {bookingErrors.name}
                        </Text>
                      )}
                    </Box>

                    <Box w="full">
                      <Text fontSize="sm" color="gray.400" mb={2}>
                        Phone Number *
                      </Text>
                      <Input
                        value={bookingForm.phone}
                        onChange={(e) => handleBookingChange('phone', e.target.value)}
                        placeholder="Enter 10-digit number"
                        bg="rgba(255,255,255,0.05)"
                        border="1px solid"
                        borderColor={bookingErrors.phone ? 'red.500' : 'whiteAlpha.200'}
                        borderRadius="lg"
                        color="white"
                        _placeholder={{ color: 'gray.500' }}
                        _focus={{
                          borderColor: '#D4A017',
                          boxShadow: '0 0 0 1px #D4A017',
                        }}
                      />
                      {bookingErrors.phone && (
                        <Text fontSize="xs" color="red.400" mt={1}>
                          {bookingErrors.phone}
                        </Text>
                      )}
                    </Box>

                    <HStack w="full" gap={4}>
                      <Box flex={1}>
                        <Text fontSize="sm" color="gray.400" mb={2}>
                          Date *
                        </Text>
                        <Input
                          type="date"
                          value={bookingForm.date}
                          onChange={(e) => handleBookingChange('date', e.target.value)}
                          bg="rgba(255,255,255,0.05)"
                          border="1px solid"
                          borderColor={bookingErrors.date ? 'red.500' : 'whiteAlpha.200'}
                          borderRadius="lg"
                          color="white"
                          min={new Date().toISOString().split('T')[0]}
                          _focus={{
                            borderColor: '#D4A017',
                            boxShadow: '0 0 0 1px #D4A017',
                          }}
                          css={{
                            '&::-webkit-calendar-picker-indicator': {
                              filter: 'invert(1)',
                              cursor: 'pointer',
                            },
                          }}
                        />
                        {bookingErrors.date && (
                          <Text fontSize="xs" color="red.400" mt={1}>
                            {bookingErrors.date}
                          </Text>
                        )}
                      </Box>

                      <Box flex={1}>
                        <Text fontSize="sm" color="gray.400" mb={2}>
                          Time *
                        </Text>
                        <Input
                          type="time"
                          value={bookingForm.time}
                          onChange={(e) => handleBookingChange('time', e.target.value)}
                          bg="rgba(255,255,255,0.05)"
                          border="1px solid"
                          borderColor={bookingErrors.time ? 'red.500' : 'whiteAlpha.200'}
                          borderRadius="lg"
                          color="white"
                          _focus={{
                            borderColor: '#D4A017',
                            boxShadow: '0 0 0 1px #D4A017',
                          }}
                          css={{
                            '&::-webkit-calendar-picker-indicator': {
                              filter: 'invert(1)',
                              cursor: 'pointer',
                            },
                          }}
                        />
                        {bookingErrors.time && (
                          <Text fontSize="xs" color="red.400" mt={1}>
                            {bookingErrors.time}
                          </Text>
                        )}
                      </Box>
                    </HStack>

                    <Box w="full">
                      <Text fontSize="sm" color="gray.400" mb={2}>
                        Number of Guests *
                      </Text>
                      <Input
                        type="number"
                        value={bookingForm.guests}
                        onChange={(e) => handleBookingChange('guests', e.target.value)}
                        placeholder="Enter number of guests"
                        bg="rgba(255,255,255,0.05)"
                        border="1px solid"
                        borderColor={bookingErrors.guests ? 'red.500' : 'whiteAlpha.200'}
                        borderRadius="lg"
                        color="white"
                        min="1"
                        max="20"
                        _placeholder={{ color: 'gray.500' }}
                        _focus={{
                          borderColor: '#D4A017',
                          boxShadow: '0 0 0 1px #D4A017',
                        }}
                      />
                      {bookingErrors.guests && (
                        <Text fontSize="xs" color="red.400" mt={1}>
                          {bookingErrors.guests}
                        </Text>
                      )}
                    </Box>

                    <Box w="full">
                      <Text fontSize="sm" color="gray.400" mb={2}>
                        Special Request (Optional)
                      </Text>
                      <Input
                        value={bookingForm.specialRequest}
                        onChange={(e) => handleBookingChange('specialRequest', e.target.value)}
                        placeholder="Any dietary requirements or special occasions?"
                        bg="rgba(255,255,255,0.05)"
                        border="1px solid"
                        borderColor="whiteAlpha.200"
                        borderRadius="lg"
                        color="white"
                        _placeholder={{ color: 'gray.500' }}
                        _focus={{
                          borderColor: '#D4A017',
                          boxShadow: '0 0 0 1px #D4A017',
                        }}
                      />
                    </Box>

                    <Button
                      type="submit"
                      w="full"
                      bg="#D4A017"
                      color="black"
                      borderRadius="full"
                      size="lg"
                      fontWeight="700"
                      _hover={{ bg: '#E5B52A' }}
                      mt={2}
                      loading={bookingSubmitting}
                      disabled={bookingSubmitting}
                    >
                      {bookingSubmitting ? 'Submitting...' : 'Submit Booking Request'}
                    </Button>
                  </VStack>
                </Box>
              )}
            </Flex>

            <Box mt={8} position="relative" zIndex={1}>
              <Text fontSize="sm" color="gray.400" mb={3}>
                Already submitted a request? Check status with your mobile number.
              </Text>
              <Flex gap={3} direction={{ base: 'column', sm: 'row' }}>
                <Input
                  value={lookupMobile}
                  onChange={(e) => setLookupMobile(e.target.value)}
                  placeholder="10-digit mobile number"
                  bg="rgba(255,255,255,0.05)"
                  border="1px solid"
                  borderColor="whiteAlpha.200"
                  borderRadius="lg"
                  color="white"
                  _placeholder={{ color: 'gray.500' }}
                />
                <Button
                  bg="whiteAlpha.200"
                  color="white"
                  borderRadius="lg"
                  onClick={handleLookupStatus}
                  loading={lookupLoading}
                >
                  Check Status
                </Button>
              </Flex>
              {lookupResults.length > 0 && (
                <VStack align="stretch" gap={3} mt={4}>
                  {lookupResults.map((booking) => (
                    <Box
                      key={booking.id}
                      bg="rgba(0,0,0,0.25)"
                      border="1px solid"
                      borderColor="whiteAlpha.100"
                      borderRadius="xl"
                      p={4}
                    >
                      <Flex justify="space-between" gap={3} flexWrap="wrap">
                        <Text fontWeight="700">#{booking.id} · {booking.customerName}</Text>
                        <Badge colorPalette={booking.status === 'APPROVED' ? 'green' : booking.status === 'REJECTED' ? 'red' : 'orange'}>
                          {booking.status}
                        </Badge>
                      </Flex>
                      <Text fontSize="sm" color="gray.400" mt={1}>
                        {booking.bookingDate} at {booking.bookingTime} · {booking.guests} guests
                      </Text>
                      {booking.adminNote && (
                        <Text fontSize="sm" color="gray.500" mt={1}>Note: {booking.adminNote}</Text>
                      )}
                    </Box>
                  ))}
                </VStack>
              )}
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default MenuPage;
