import React, { useState } from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  HStack,
  VStack,
  Button,
  Image,
  Badge,
} from "@chakra-ui/react";

import { AnimatePresence } from "framer-motion";

import { FiArrowLeft, FiShoppingBag } from "react-icons/fi";

import { Link as RouterLink } from "react-router-dom";


const menuItems = [
  {
    id: 1,
    name: "Garlic Bread",
    category: "Starters",
    price: "₹149",
    image:
      "https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?auto=format&fit=crop&w=800&q=80",
    description:
      "Freshly baked bread with garlic butter and herbs.",
  },

  {
    id: 2,
    name: "Tomato Soup",
    category: "Starters",
    price: "₹129",
    image:
      "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80",
    description:
      "Warm tomato soup prepared with fresh ingredients.",
  },

  {
    id: 3,
    name: "Margherita Pizza",
    category: "Pizza",
    price: "₹299",
    image:
      "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80",
    description:
      "Mozzarella, tomato sauce and fresh basil.",
  },

  {
    id: 4,
    name: "Pepperoni Pizza",
    category: "Pizza",
    price: "₹349",
    image:
      "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=800&q=80",
    description:
      "Crispy crust with spicy pepperoni and cheese.",
  },

  {
    id: 5,
    name: "Classic Burger",
    category: "Burgers",
    price: "₹249",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
    description:
      "Juicy grilled patty with vegetables and special sauce.",
  },

  {
    id: 6,
    name: "Chicken Burger",
    category: "Burgers",
    price: "₹299",
    image:
      "https://images.unsplash.com/photo-1606755962773-d324e0a13086?auto=format&fit=crop&w=800&q=80",
    description:
      "Crispy chicken with lettuce and creamy sauce.",
  },

  {
    id: 7,
    name: "Creamy Pasta",
    category: "Pasta",
    price: "₹279",
    image:
      "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=800&q=80",
    description:
      "Creamy Italian pasta with parmesan cheese.",
  },

  {
    id: 8,
    name: "Alfredo Pasta",
    category: "Pasta",
    price: "₹319",
    image:
      "https://images.unsplash.com/photo-1551892374-ecf8754cf8b0?auto=format&fit=crop&w=800&q=80",
    description:
      "Classic Alfredo sauce with perfectly cooked pasta.",
  },

  {
    id: 9,
    name: "Chocolate Brownie",
    category: "Desserts",
    price: "₹199",
    image:
      "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80",
    description:
      "Rich chocolate brownie served warm.",
  },

  {
    id: 10,
    name: "Cheesecake",
    category: "Desserts",
    price: "₹229",
    image:
      "https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=800&q=80",
    description:
      "Creamy cheesecake with a delicious biscuit base.",
  },
];


function FullMenu() {

  const [category, setCategory] = useState("All");

  const categories = [
    "All",
    "Starters",
    "Pizza",
    "Burgers",
    "Pasta",
    "Desserts",
  ];


  const filteredItems =
    category === "All"
      ? menuItems
      : menuItems.filter(
          (item) => item.category === category
        );


  return (
    <Box
      minH="100vh"
      bg="#111111"
      color="white"
      py={{ base: 12, md: 20 }}
    >

      <Container maxW="1200px">


        {/* ================= HEADER ================= */}

        <VStack
          textAlign="center"
          gap={4}
          mb={12}
        >

          <Text
            color="#D4A017"
            fontSize="sm"
            fontWeight="700"
            letterSpacing="5px"
          >
            TASTE RESTAURANT
          </Text>


          <Heading
            fontSize={{
              base: "4xl",
              md: "6xl",
            }}
            fontWeight="900"
          >
            Our{" "}
            <Box
              as="span"
              color="#D4A017"
            >
              Full Menu
            </Box>
          </Heading>


          <Text
            maxW="650px"
            color="gray.400"
            fontSize="lg"
          >
            From delicious starters to indulgent
            desserts, discover something special
            for every craving.
          </Text>

        </VStack>


        {/* ================= BACK BUTTON ================= */}

        <Button
          as={RouterLink}
          to="/menu"
          variant="ghost"
          color="gray.400"
          mb={8}
          _hover={{
            color: "#D4A017",
          }}
        >
          <FiArrowLeft />
          Back to Menu
        </Button>


        {/* ================= CATEGORY ================= */}

        <HStack
          justify="center"
          flexWrap="wrap"
          gap={3}
          mb={14}
        >

          {categories.map((item) => {

            const active = category === item;

            return (
              <Button
                key={item}
                onClick={() => setCategory(item)}
                borderRadius="full"
                px={6}
                bg={
                  active
                    ? "#D4A017"
                    : "#1B1B1B"
                }
                color={
                  active
                    ? "black"
                    : "gray.300"
                }
                border="1px solid"
                borderColor={
                  active
                    ? "#D4A017"
                    : "gray.700"
                }
                _hover={{
                  bg: "#D4A017",
                  color: "black",
                }}
              >
                {item}
              </Button>
            );

          })}

        </HStack>


        {/* ================= FOOD ================= */}

        <AnimatePresence mode="popLayout">

          <SimpleGrid
            columns={{
              base: 1,
              sm: 2,
              lg: 3,
            }}
            gap={7}
          >

            {filteredItems.map((item, index) => (

              <Box
                key={item.id}
                bg="#181818"
                borderRadius="2xl"
                overflow="hidden"
                border="1px solid"
                borderColor="gray.800"
                transition="transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease"
                _hover={{
                  borderColor: "#D4A017",
                  boxShadow:
                    "0 20px 45px rgba(0,0,0,0.4)",
                  transform: "translateY(-8px)",
                }}
              >

                {/* IMAGE */}

                <Box
                  position="relative"
                  overflow="hidden"
                >

                  <Image
                    src={item.image}
                    alt={item.name}
                    w="100%"
                    h="230px"
                    objectFit="cover"
                    transition="0.6s"

                    _groupHover={{
                      transform: "scale(1.08)",
                    }}
                  />


                  <Badge
                    position="absolute"
                    top={4}
                    left={4}
                    bg="#D4A017"
                    color="black"
                    px={3}
                    py={1}
                    borderRadius="full"
                  >
                    {item.category}
                  </Badge>

                </Box>


                {/* DETAILS */}

                <VStack
                  align="stretch"
                  p={5}
                  gap={3}
                >

                  <HStack
                    justify="space-between"
                    align="start"
                  >

                    <Heading
                      size="md"
                    >
                      {item.name}
                    </Heading>

                    <Text
                      color="#D4A017"
                      fontWeight="800"
                      fontSize="lg"
                    >
                      {item.price}
                    </Text>

                  </HStack>


                  <Text
                    color="gray.400"
                    fontSize="sm"
                    lineHeight="1.7"
                  >
                    {item.description}
                  </Text>


                  <Button
                    mt={2}
                    bg="#D4A017"
                    color="black"
                    borderRadius="lg"
                    _hover={{
                      bg: "#E5B52A",
                      transform:
                        "translateY(-2px)",
                    }}
                  >
                    <FiShoppingBag />
                    Order Now
                  </Button>

                </VStack>

              </Box>

            ))}

          </SimpleGrid>

        </AnimatePresence>

      </Container>

    </Box>
  );
}

export default FullMenu;