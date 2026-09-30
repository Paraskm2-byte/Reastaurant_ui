import { AnimatePresence } from "framer-motion";

import React, { useState } from "react";
import {
  Box,
  Container,
  Flex,
  Heading,
  Text,
  Button,
  SimpleGrid,
  Image,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import Footer from "./Footer";
import Navbar from "./Navbar";

const MotionBox = ({ initial, animate, transition, whileHover, whileInView, viewport, exit, layout, layoutId, ...props }) =>
  <Box {...props} />;

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState("All");

  const images = [
    {
      id: 1,
      image:
        "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=1000&q=80",
      title: "Elegant Restaurant",
      category: "Restaurant",
    },
    {
      id: 2,
      image:
        "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1000&q=80",
      title: "Delicious Food",
      category: "Food",
    },
    {
      id: 3,
      image:
        "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1000&q=80",
      title: "Classic Burger",
      category: "Food",
    },
    {
      id: 4,
      image:
        "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=1000&q=80",
      title: "Fresh Pasta",
      category: "Food",
    },
    {
      id: 5,
      image:
        "https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=1000&q=80",
      title: "Italian Pizza",
      category: "Food",
    },
    {
      id: 6,
      image:
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1000&q=80",
      title: "Special Dishes",
      category: "Events",
    },
  ];

  const categories = ["All", "Food", "Restaurant", "Events"];

  const filteredImages =
    activeCategory === "All"
      ? images
      : images.filter((item) => item.category === activeCategory);

  return (
    <>
   
    <Box
      minH="100vh"
      bg="#080808"
      color="white"
      py={{ base: 16, md: 24 }}
      position="relative"
      overflow="hidden"
    >
      {/* BACKGROUND EFFECTS */}

      <Box
        position="absolute"
        top="-250px"
        right="-200px"
        w="500px"
        h="500px"
        bg="#D4A017"
        opacity="0.07"
        filter="blur(120px)"
        borderRadius="full"
      />

      <Box
        position="absolute"
        bottom="-250px"
        left="-200px"
        w="500px"
        h="500px"
        bg="#D4A017"
        opacity="0.05"
        filter="blur(120px)"
        borderRadius="full"
      />

      <Container
        maxW="1250px"
        position="relative"
        zIndex="2"
      >
        {/* HEADER */}

        <MotionBox
          textAlign="center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          mb={12}
        >
          <Text
            color="#D4A017"
            fontSize="sm"
            fontWeight="700"
            letterSpacing="5px"
            mb={4}
          >
            OUR GALLERY
          </Text>

          <Heading
            fontSize={{
              base: "3xl",
              sm: "4xl",
              md: "6xl",
            }}
            fontWeight="800"
            lineHeight="1.1"
          >
            Moments Worth
            <Box
              as="span"
              color="#D4A017"
              display="block"
            >
              Remembering
            </Box>
          </Heading>

          <Text
            maxW="650px"
            mx="auto"
            mt={5}
            color="gray.500"
            fontSize={{ base: "sm", md: "md" }}
            lineHeight="1.8"
          >
            Take a look inside our restaurant and discover
            delicious food, beautiful interiors and memorable
            dining experiences.
          </Text>
        </MotionBox>

        {/* CATEGORY BUTTONS */}

        <Flex
          justify="center"
          gap={3}
          flexWrap="wrap"
          mb={12}
        >
          {categories.map((category, index) => (
            <MotionBox
              key={category}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: index * 0.08,
                duration: 0.4,
              }}
            >
              <Button
                onClick={() => setActiveCategory(category)}
                size="md"
                borderRadius="full"
                px={7}
                bg={
                  activeCategory === category
                    ? "#D4A017"
                    : "transparent"
                }
                color={
                  activeCategory === category
                    ? "black"
                    : "gray.400"
                }
                border="1px solid"
                borderColor={
                  activeCategory === category
                    ? "#D4A017"
                    : "whiteAlpha.200"
                }
                _hover={{
                  bg:
                    activeCategory === category
                      ? "#E8B52A"
                      : "whiteAlpha.100",
                  color:
                    activeCategory === category
                      ? "black"
                      : "#D4A017",
                  borderColor: "#D4A017",
                  transform: "translateY(-2px)",
                }}
                transition="all 0.25s"
              >
                {category}
              </Button>
            </MotionBox>
          ))}
        </Flex>

        {/* GALLERY */}

        <AnimatePresence mode="wait">
          <SimpleGrid
            key={activeCategory}
            columns={{
              base: 1,
              sm: 2,
              lg: 3,
            }}
            gap={6}
          >
            {filteredImages.map((item, index) => (
              <MotionBox
                key={item.id}
                initial={{
                  opacity: 0,
                  y: 40,
                  scale: 0.95,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.08,
                }}
                position="relative"
                h={{
                  base: "330px",
                  md: index === 0 ? "420px" : "330px",
                }}
                borderRadius="25px"
                overflow="hidden"
                cursor="pointer"
                bg="#111"
                border="1px solid"
                borderColor="whiteAlpha.100"
                _hover={{
                  borderColor: "#D4A017",
                }}
              >
                {/* IMAGE */}

                <Image
                  src={item.image}
                  alt={item.title}
                  w="100%"
                  h="100%"
                  objectFit="cover"
                  loading="lazy"
                  transition="transform 0.7s ease"
                  _hover={{
                    transform: "scale(1.08)",
                  }}
                />

                {/* DARK GRADIENT */}

                <Box
                  position="absolute"
                  inset="0"
                  bgGradient="linear(to-t, black, transparent 70%)"
                />

                {/* GOLD HOVER GLOW */}

                <Box
                  position="absolute"
                  inset="0"
                  bg="#D4A017"
                  opacity="0"
                  transition="opacity 0.4s"
                  _hover={{
                    opacity: 0.08,
                  }}
                />

                {/* TOP CATEGORY */}

                <Box
                  position="absolute"
                  top="18px"
                  left="18px"
                  px={4}
                  py={2}
                  bg="rgba(0,0,0,0.55)"
                  backdropFilter="blur(10px)"
                  borderRadius="full"
                  border="1px solid"
                  borderColor="whiteAlpha.200"
                >
                  <Text
                    fontSize="10px"
                    fontWeight="700"
                    letterSpacing="2px"
                    color="#D4A017"
                  >
                    {item.category.toUpperCase()}
                  </Text>
                </Box>

                {/* VIEW BUTTON */}

                <MotionBox
                  position="absolute"
                  top="18px"
                  right="18px"
                  w="45px"
                  h="45px"
                  borderRadius="full"
                  bg="rgba(0,0,0,0.6)"
                  backdropFilter="blur(10px)"
                  border="1px solid"
                  borderColor="whiteAlpha.300"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  fontSize="20px"
                  whileHover={{
                    scale: 1.15,
                    backgroundColor: "#D4A017",
                    color: "black",
                  }}
                  whileTap={{
                    scale: 0.9,
                  }}
                >
                  ↗
                </MotionBox>

                {/* CONTENT */}

                <Box
                  position="absolute"
                  bottom="0"
                  left="0"
                  right="0"
                  p={6}
                >
                  <Text
                    color="#D4A017"
                    fontSize="xs"
                    fontWeight="700"
                    letterSpacing="2px"
                    mb={2}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </Text>

                  <Heading
                    fontSize={{
                      base: "xl",
                      md: "2xl",
                    }}
                    fontWeight="700"
                  >
                    {item.title}
                  </Heading>

                  <Text
                    color="gray.400"
                    fontSize="sm"
                    mt={2}
                  >
                    Discover the experience →
                  </Text>
                </Box>

                {/* GOLD BORDER */}

                <Box
                  position="absolute"
                  inset="0"
                  border="1px solid"
                  borderColor="#D4A017"
                  borderRadius="25px"
                  opacity="0"
                  transition="opacity 0.3s"
                  pointerEvents="none"
                  _hover={{
                    opacity: 0.6,
                  }}
                />
              </MotionBox>
            ))}
          </SimpleGrid>
        </AnimatePresence>

        {/* BOTTOM CTA */}

        <MotionBox
          textAlign="center"
          mt={16}
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Text
            color="gray.500"
            fontSize="sm"
            mb={5}
          >
            More delicious moments are waiting for you.
          </Text>
          <Link to="/fullGallery"><Button
            bg="#D4A017"
            color="black"
            px={10}
            h="56px"
            borderRadius="full"
            fontWeight="700"
            fontSize="md"
            _hover={{
              bg: "#E8B52A",
              transform: "translateY(-3px)",
              boxShadow:
                "0 15px 40px rgba(212,160,23,0.25)",
            }}
            _active={{
              transform: "scale(0.96)",
            }}
            transition="all 0.25s"
          >
            View Full Gallery →
          </Button>
          </Link>
          
        </MotionBox>
      </Container>
    </Box>
  
    </>
  );
}

