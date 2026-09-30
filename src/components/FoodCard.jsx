import React from 'react';
import {
  Box,
  Button,
  Badge,
  Heading,
  HStack,
  Image,
  Text,
  VStack,
} from '@chakra-ui/react';
import { FiHeart, FiMinus, FiPlus, FiShoppingCart } from 'react-icons/fi';

const getDiscountedPrice = (price, discountValue, discountType) => {
  if (!discountValue || discountValue <= 0) return Number(price);
  if (discountType === 'PERCENTAGE') return Number(price) - (Number(price) * Number(discountValue)) / 100;
  return Math.max(Number(price) - Number(discountValue), 0);
};

const FoodCard = ({ item, cartQuantity, onAddToCart, onIncrease, onDecrease }) => {
  const discountedPrice = getDiscountedPrice(item.price, item.discountValue, item.discountType);
  const isDiscounted = discountedPrice < Number(item.price);

  return (
    <Box
      transition="transform 0.25s ease, box-shadow 0.25s ease"
      bg="rgba(16,23,37,0.9)"
      border="1px solid"
      borderColor="whiteAlpha.100"
      borderRadius="2xl"
      overflow="hidden"
      boxShadow="0 18px 40px rgba(13,27,52,0.25)"
      _hover={{ transform: 'translateY(-6px) scale(1.01)', borderColor: 'blue.800' }}
    >
      <Box position="relative" overflow="hidden" h="220px">
        <Image
          src={item.image || 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400'}
          alt={item.name}
          w="100%"
          h="100%"
          objectFit="cover"
          transition="0.5s ease"
          _hover={{ transform: 'scale(1.08)' }}
        />

        {item.foodType && (
          <Badge
            position="absolute" top={3} left={3}
            bg={item.foodType === 'VEG' ? 'green.500' : 'red.500'}
            color="white" borderRadius="full" px={2} py={1} fontSize="xs" fontWeight="700"
          >
            {item.foodType}
          </Badge>
        )}

        <Box
          as="button"
          position="absolute" top={3} right={3}
          w="32px" h="32px"
          borderRadius="full"
          bg="blackAlpha.700"
          color="white"
          display="flex" alignItems="center" justifyContent="center"
          border="none"
          cursor="pointer"
          _hover={{ bg: 'blue.500' }}
          transition="background 0.2s"
          aria-label="Favorite"
        >
          <FiHeart size={14} />
        </Box>

        {isDiscounted && (
          <Badge
            position="absolute" bottom={3} left={3}
            bg="orange.500" color="white" borderRadius="full" px={2} py={1} fontSize="xs" fontWeight="700"
          >
            {item.discountType === 'PERCENTAGE' ? `${item.discountValue}% OFF` : `₹${item.discountValue} OFF`}
          </Badge>
        )}
      </Box>

      <VStack align="stretch" p={5} gap={3}>
        <HStack justify="space-between" align="start">
          <Box flex="1" minW={0}>
            <Heading as="h3" size="md" fontWeight="800" isTruncated>{item.name}</Heading>
            <Text fontSize="xs" color="gray.500" mt={1}>{item.category?.name || 'General'}</Text>
          </Box>
          <VStack align="end" gap={0} flexShrink={0}>
            {isDiscounted && (
              <Text as="span" textDecoration="line-through" color="gray.500" fontSize="sm">
                ₹{Number(item.price).toFixed(2)}
              </Text>
            )}
            <Text color="blue.400" fontSize="lg" fontWeight="900">₹{discountedPrice.toFixed(2)}</Text>
          </VStack>
        </HStack>

        <Text color="gray.400" minH="44px" fontSize="sm" lineHeight="1.6" noOfLines={2}>{item.description}</Text>

        <HStack justify="space-between" pt={2}>
          <Text fontSize="xs" color={item.available ? 'green.300' : 'red.300'} fontWeight="600">
            {item.available ? '● Available' : '● Unavailable'}
          </Text>

          {cartQuantity > 0 ? (
            <HStack bg="gray.900" borderRadius="full" border="1px solid" borderColor="whiteAlpha.100" p={1} gap={0}>
              <Button
                size="sm" variant="ghost" borderRadius="full" p={2}
                onClick={() => onDecrease(item.id)}
                _hover={{ bg: 'blue.800' }}
              >
                <FiMinus size={13} />
              </Button>
              <Text minW="24px" textAlign="center" fontWeight="800" fontSize="sm">{cartQuantity}</Text>
              <Button
                size="sm" variant="ghost" borderRadius="full" p={2}
                onClick={() => onIncrease(item.id)}
                _hover={{ bg: 'blue.800' }}
              >
                <FiPlus size={13} />
              </Button>
            </HStack>
          ) : (
            <Button
              size="sm"
              bg="blue.500"
              color="white"
              borderRadius="lg"
              _hover={{ bg: 'blue.600' }}
              onClick={() => onAddToCart(item)}
              disabled={!item.available}
            >
              <FiShoppingCart size={14} />
              Add
            </Button>
          )}
        </HStack>
      </VStack>
    </Box>
  );
};

export default FoodCard;
