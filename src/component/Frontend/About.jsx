import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  VStack,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import Footer from "./Footer";
import Navbar from "./Navbar";
export default function About() {
  const features = [
    {
      icon: "👨‍🍳",
      title: "Expert Chefs",
      text: "Our chefs carefully prepare every dish with skill and creativity.",
    },
    {
      icon: "🌿",
      title: "Fresh Ingredients",
      text: "We choose quality ingredients to give you delicious flavors.",
    },
    {
      icon: "❤️",
      title: "Made With Love",
      text: "Every dish is prepared with passion and attention to detail.",
    },
  ];

  return (
    <>
   
    <Box
      bg="#111111"
      color="white"
      py={{ base: 16, md: 24 }}
      px={{ base: 5, md: 10 }}
    >
      <Box maxW="1200px" mx="auto">

        {/* Heading */}
        <VStack textAlign="center" gap={4}>
          <Text
            color="#D4A017"
            fontSize="sm"
            fontWeight="bold"
            letterSpacing="3px"
          >
            WHY TASTE RESTAURANT?
          </Text>

          <Heading
            fontSize={{ base: "3xl", md: "5xl" }}
          >
            Food Made With Passion
          </Heading>

          <Text
            color="gray.400"
            maxW="650px"
            lineHeight="1.8"
          >
            We don't just serve food. We create an experience
            that you want to remember.
          </Text>
        </VStack>


        {/* Feature Cards */}
        <Flex
          mt={14}
          gap={6}
          justify="center"
          direction={{ base: "column", md: "row" }}
        >

          {features.map((item) => (
            <Box
              key={item.title}
              flex="1"
              bg="#1c1c1c"
              p={8}
              borderRadius="2xl"
              textAlign="center"
              border="1px solid"
              borderColor="whiteAlpha.100"
              transition="0.3s"
              _hover={{
                transform: "translateY(-8px)",
                borderColor: "#D4A017",
              }}
            >

              <Text fontSize="50px">
                {item.icon}
              </Text>

              <Heading
                fontSize="xl"
                mt={5}
              >
                {item.title}
              </Heading>

              <Text
                color="gray.400"
                mt={4}
                lineHeight="1.7"
              >
                {item.text}
              </Text>

            </Box>
          ))}

        </Flex>


        {/* Button */}
        <Flex justify="center" mt={12}>
          <Link to="/menu"><Button
            bg="#D4A017"
            color="black"
            size="lg"
            px={8}
            borderRadius="full"
            fontWeight="bold"
            _hover={{
              bg: "#F0C75E",
              transform: "translateY(-2px)",
            }}
          >
            View Our Menu →
          </Button>
          </Link>
        
        </Flex>

      </Box>
    </Box>
   
    </>

  );
}