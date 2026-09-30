import React, { useEffect, useState } from "react";
import {
    Box,
    Flex,
    Grid,
    GridItem,
    Heading,
    Text,
    Image,
    Button,
    IconButton,
    Input,
    VStack,
    HStack,
    Separator,
} from "@chakra-ui/react";

import {
    FiMinus,
    FiPlus,
    FiTrash2,
    FiArrowLeft,
    FiShoppingBag,
    FiTag,
} from "react-icons/fi";

const MotionBox = ({ initial, animate, transition, whileHover, whileInView, viewport, exit, layout, layoutId, ...props }) =>
  <Box {...props} />;

const MotionButton = ({ initial, animate, transition, whileHover, whileInView, viewport, exit, layout, layoutId, ...props }) =>
  <Button {...props} />;


const cartItems = [
    {
        id: 1,
        name: "Classic Chicken Burger",
        description: "Crispy chicken, fresh lettuce & special sauce",
        price: 249,
        quantity: 2,
        image:
            "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=500&q=80",
    },
    {
        id: 2,
        name: "Creamy Paneer Pizza",
        description: "Loaded with paneer, mozzarella & herbs",
        price: 399,
        quantity: 1,
        image:
            "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=500&q=80",
    },
    {
        id: 3,
        name: "Chocolate Shake",
        description: "Rich chocolate milkshake with creamy topping",
        price: 149,
        quantity: 1,
        image:
            "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=500&q=80",
    },
];


export default function Cart() {

const subtotal=390;
    const delivery = 40;
    const tax = 60;
    const total = subtotal + delivery + tax;
    const [quantity, setQuantity] = useState(1);
    const [final, setFinal] = useState();
    

    const additems = () => {

        setQuantity(prev => prev + 1);

    }


    const minusitems = () => {
        if (quantity > 1) {
            setQuantity(prev => prev - 1);

        }
    }




    return (
        <Box
            minH="100vh"
            bg="#080B12"
            color="white"
            px={{ base: 4, md: 8, lg: 16 }}
            py={{ base: 10, md: 16 }}
            position="relative"
            overflow="hidden"
        >

            {/* ==================================================
          BACKGROUND GLOW
      ================================================== */}

            <Box
                position="absolute"
                top="-180px"
                left="-150px"
                w="450px"
                h="450px"
                borderRadius="full"
                bg="blue.500"
                opacity=".12"
                filter="blur(120px)"
            />

            <Box
                position="absolute"
                right="-150px"
                bottom="-150px"
                w="450px"
                h="450px"
                borderRadius="full"
                bg="cyan.400"
                opacity=".08"
                filter="blur(120px)"
            />

            {/* ==================================================
          HEADER
      ================================================== */}

            <MotionBox
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                maxW="1300px"
                mx="auto"
                mb={12}
            >
                <HStack spacing={3} mb={3}>
                    <Box
                        w="42px"
                        h="42px"
                        borderRadius="xl"
                        bg="blue.500"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        boxShadow="0 0 30px rgba(59,130,246,.35)"
                    >
                        <FiShoppingBag size={20} />
                    </Box>

                    <Text
                        color="blue.300"
                        fontSize="sm"
                        fontWeight="700"
                        letterSpacing="3px"
                        textTransform="uppercase"
                    >
                        Your Order
                    </Text>
                </HStack>

                <Heading
                    fontSize={{ base: "4xl", md: "6xl" }}
                    fontWeight="900"
                    letterSpacing="-2px"
                >
                    Your Cart
                    <Text
                        as="span"
                        color="blue.400"
                        ml={2}
                    >
                        .
                    </Text>
                </Heading>

                <Text
                    color="gray.400"
                    fontSize="lg"
                    mt={3}
                >
                    Your favorite food is just one step away.
                </Text>
            </MotionBox>

            {/* ==================================================
          MAIN CONTENT
      ================================================== */}

            <Grid
                maxW="1300px"
                mx="auto"
                templateColumns={{
                    base: "1fr",
                    lg: "1.6fr .8fr",
                }}
                gap={8}
                position="relative"
            >

                {/* ==================================================
            CART ITEMS
        ================================================== */}

                <GridItem>

                    <VStack spacing={5} align="stretch">

                        {cartItems.map((item, index) => (

                            <MotionBox
                                key={item.id}
                                initial={{
                                    opacity: 0,
                                    x: -50,
                                }}
                                animate={{
                                    opacity: 1,
                                    x: 0,
                                }}
                                transition={{
                                    duration: 0.5,
                                    delay: index * 0.15,
                                }}
                                bg="rgba(17,23,34,.85)"
                                border="1px solid"
                                borderColor="whiteAlpha.100"
                                borderRadius="2xl"
                                p={{ base: 4, md: 5 }}
                                backdropFilter="blur(15px)"
                                _hover={{
                                    borderColor: "blue.400",
                                    transform: "translateY(-4px)",
                                    boxShadow:
                                        "0 15px 45px rgba(37,99,235,.15)",
                                }}
                                transition="all .3s ease"
                            >

                                <Flex
                                    gap={5}
                                    align="center"
                                    direction={{ base: "column", sm: "row" }}
                                >

                                    {/* FOOD IMAGE */}

                                    <Box
                                        position="relative"
                                        flexShrink={0}
                                    >
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            w={{ base: "100%", sm: "135px" }}
                                            h={{ base: "210px", sm: "135px" }}
                                            objectFit="cover"
                                            borderRadius="xl"
                                        />

                                        <Box
                                            position="absolute"
                                            inset="0"
                                            borderRadius="xl"
                                            boxShadow="inset 0 0 30px rgba(0,0,0,.25)"
                                        />
                                    </Box>

                                    {/* DETAILS */}

                                    <Box flex="1" w="100%">

                                        <Flex
                                            justify="space-between"
                                            align="start"
                                            gap={3}
                                        >

                                            <Box>
                                                <Heading
                                                    fontSize="xl"
                                                    fontWeight="800"
                                                >
                                                    {item.name}
                                                </Heading>

                                                <Text
                                                    color="gray.400"
                                                    fontSize="sm"
                                                    mt={2}
                                                    lineHeight="1.6"
                                                >
                                                    {item.description}
                                                </Text>
                                            </Box>

                                            <IconButton
                                                aria-label="Remove item"
                                                variant="ghost"
                                                color="gray.500"
                                                _hover={{
                                                    color: "red.400",
                                                    bg: "red.400",
                                                    bgOpacity: ".1",
                                                }}
                                            >
                                                <FiTrash2 />
                                            </IconButton>

                                        </Flex>

                                        <Flex
                                            mt={6}
                                            justify="space-between"
                                            align="center"
                                        >

                                            {/* QUANTITY */}

                                            <HStack
                                                bg="#080B12"
                                                border="1px solid"
                                                borderColor="whiteAlpha.100"
                                                borderRadius="full"
                                                p="4px"
                                                spacing={1}
                                            >

                                                <IconButton
                                                    aria-label="Decrease"
                                                    size="sm"
                                                    borderRadius="full"
                                                    variant="ghost"
                                                    color="gray.300"
                                                    _hover={{
                                                        bg: "blue.500",
                                                    }} onClick={() => minusitems()}
                                                >
                                                    <FiMinus size={14} />
                                                </IconButton>

                                                <Text
                                                    w="30px"
                                                    textAlign="center"
                                                    fontWeight="800"
                                                >
                                                    {quantity}
                                                </Text>

                                                <IconButton
                                                    aria-label="Increase"
                                                    size="sm"
                                                    borderRadius="full"
                                                    variant="ghost"
                                                    color="gray.300"
                                                    _hover={{
                                                        bg: "blue.500",
                                                    }} onClick={() => additems()}
                                                >
                                                    <FiPlus size={14} />
                                                </IconButton>

                                            </HStack>

                                            {/* PRICE */}

                                            <Text
                                                fontSize="xl"
                                                fontWeight="900"
                                                color="blue.300"
                                            >
                                                ₹{item.price * quantity}
                                            </Text>

                                        </Flex>

                                    </Box>

                                </Flex>

                            </MotionBox>

                        ))}

                    </VStack>

                    {/* CONTINUE SHOPPING */}

                    <MotionButton
                        mt={7}
                        variant="ghost"
                        color="gray.300"
                        whileHover={{ x: -5 }}
                        _hover={{
                            color: "blue.300",
                            bg: "transparent",
                        }}
                    >
                        <FiArrowLeft />
                        Continue Shopping
                    </MotionButton>

                </GridItem>

                {/* ==================================================
            ORDER SUMMARY
        ================================================== */}

                <GridItem>

                    <MotionBox
                        initial={{
                            opacity: 0,
                            x: 50,
                        }}
                        animate={{
                            opacity: 1,
                            x: 0,
                        }}
                        transition={{
                            duration: 0.7,
                            delay: 0.3,
                        }}
                        bg="rgba(17,23,34,.9)"
                        border="1px solid"
                        borderColor="whiteAlpha.100"
                        borderRadius="3xl"
                        p={{ base: 6, md: 8 }}
                        position="sticky"
                        top="30px"
                        backdropFilter="blur(20px)"
                        boxShadow="0 20px 60px rgba(0,0,0,.3)"
                    >

                        <Heading
                            fontSize="2xl"
                            fontWeight="900"
                            mb={7}
                        >
                            Order Summary
                        </Heading>

                        {/* SUMMARY ROWS */}

                        <VStack
                            spacing={5}
                            align="stretch"
                        >

                            <Flex justify="space-between">
                                <Text color="gray.400">
                                    Subtotal
                                </Text>
                             
                                <Text fontWeight="700">
                                    ₹{subtotal}
                                </Text>
                            </Flex>

                            <Flex justify="space-between">
                                <Text color="gray.400">
                                    Delivery
                                </Text>

                                <Text fontWeight="700">
                                    ₹{delivery}
                                </Text>
                            </Flex>

                            <Flex justify="space-between">
                                <Text color="gray.400">
                                    Tax
                                </Text>

                                <Text fontWeight="700">
                                    ₹{tax}
                                </Text>
                            </Flex>

                            <Separator borderColor="whiteAlpha.200" />

                            <Flex
                                justify="space-between"
                                align="center"
                            >
                                <Text
                                    fontSize="lg"
                                    fontWeight="700"
                                >
                                    Total
                                </Text>

                                <Text
                                    fontSize="3xl"
                                    fontWeight="900"
                                    color="blue.300"
                                >
                                    ₹{total}
                                </Text>
                            </Flex>

                        </VStack>

                        {/* PROMO */}

                        <Box mt={8}>

                            <HStack mb={3}>
                                <FiTag color="#60A5FA" />

                                <Text
                                    fontSize="sm"
                                    fontWeight="700"
                                >
                                    Have a promo code?
                                </Text>
                            </HStack>

                            <Flex gap={2}>

                                <Input
                                    placeholder="Enter code"
                                    bg="#080B12"
                                    border="1px solid"
                                    borderColor="whiteAlpha.200"
                                    borderRadius="xl"
                                    _focus={{
                                        borderColor: "blue.400",
                                        boxShadow:
                                            "0 0 0 1px #3182CE",
                                    }}
                                />

                                <Button
                                    borderRadius="xl"
                                    px={6}
                                    bg="whiteAlpha.100"
                                    _hover={{
                                        bg: "blue.500",
                                    }}
                                >
                                    Apply
                                </Button>

                            </Flex>

                        </Box>

                        {/* CHECKOUT */}

                        <MotionButton
                            mt={8}
                            w="100%"
                            h="58px"
                            borderRadius="xl"
                            bg="blue.500"
                            fontSize="md"
                            fontWeight="800"
                            boxShadow="0 10px 30px rgba(37,99,235,.3)"
                            whileHover={{
                                scale: 1.02,
                            }}
                            whileTap={{
                                scale: 0.97,
                            }}
                            _hover={{
                                bg: "blue.400",
                                boxShadow:
                                    "0 15px 40px rgba(37,99,235,.45)",
                            }}
                        >
                            Proceed to Checkout →
                        </MotionButton>

                        <Text
                            textAlign="center"
                            color="gray.500"
                            fontSize="xs"
                            mt={4}
                        >
                            Secure checkout • Fast delivery • Fresh food
                        </Text>

                    </MotionBox>

                </GridItem>

            </Grid>

        </Box>
    );
}