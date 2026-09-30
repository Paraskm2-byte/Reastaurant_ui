import React from "react";
import {
  Box,
  Flex,
  Heading,
  Text,
  Input,
  Textarea,
  Button,
  VStack,
  HStack,
} from "@chakra-ui/react";
import Footer from "./Footer";
import Navbar from "./Navbar";

export default function Contact() {
  return (
    <>
  
    <Box
      bg="#111111"
      color="white"
      py={{ base: 16, md: 24 }}
      px={{ base: 5, md: 10 }}
    >
      <Box maxW="1200px" mx="auto">

        {/* HEADER */}
        <Box textAlign="center" mb={12}>
          <Text
            color="#D4A017"
            fontSize="sm"
            fontWeight="bold"
            letterSpacing="3px"
          >
            GET IN TOUCH
          </Text>

          <Heading
            mt={3}
            fontSize={{ base: "3xl", md: "5xl" }}
          >
            We'd Love To Hear From You
          </Heading>

          <Text
            color="gray.400"
            maxW="600px"
            mx="auto"
            mt={4}
          >
            Have a question or want to reserve a table?
            Get in touch with us.
          </Text>
        </Box>


        {/* CONTACT + FORM */}
        <Flex
          direction={{ base: "column", md: "row" }}
          gap={10}
        >

          {/* LEFT SIDE */}
          <Box flex="1">

            <Heading fontSize="2xl" mb={7}>
              Contact Information
            </Heading>

            <VStack
              align="stretch"
              gap={6}
            >

              {/* LOCATION */}
              <HStack align="start">
                <Text fontSize="25px">
                  📍
                </Text>

                <Box>
                  <Text fontWeight="bold">
                    Our Location
                  </Text>

                  <Text
                    color="gray.400"
                    mt={1}
                  >
                    123 Food Street,
                    Chandigarh, Punjab, India
                  </Text>
                </Box>
              </HStack>


              {/* PHONE */}
              <HStack align="start">
                <Text fontSize="25px">
                  📞
                </Text>

                <Box>
                  <Text fontWeight="bold">
                    Phone
                  </Text>

                  <Text color="gray.400" mt={1}>
                    +91 98765 43210
                  </Text>
                </Box>
              </HStack>


              {/* EMAIL */}
              <HStack align="start">
                <Text fontSize="25px">
                  ✉️
                </Text>

                <Box>
                  <Text fontWeight="bold">
                    Email
                  </Text>

                  <Text color="gray.400" mt={1}>
                    hello@tasterestaurant.com
                  </Text>
                </Box>
              </HStack>


              {/* HOURS */}
              <Box
                bg="#1c1c1c"
                p={6}
                borderRadius="2xl"
              >
                <Text
                  color="#D4A017"
                  fontWeight="bold"
                  mb={4}
                >
                  🕐 Opening Hours
                </Text>

                <Flex justify="space-between">
                  <Text color="gray.400">
                    Monday - Friday
                  </Text>

                  <Text>
                    11 AM - 10 PM
                  </Text>
                </Flex>

                <Flex
                  justify="space-between"
                  mt={3}
                >
                  <Text color="gray.400">
                    Saturday - Sunday
                  </Text>

                  <Text>
                    10 AM - 11 PM
                  </Text>
                </Flex>
              </Box>

            </VStack>
          </Box>


          {/* RIGHT SIDE FORM */}
          <Box
            flex="1"
            bg="#1c1c1c"
            p={{ base: 6, md: 8 }}
            borderRadius="2xl"
          >

            <Heading fontSize="2xl" mb={6}>
              Send Us A Message
            </Heading>

            <VStack gap={5}>

              <Input
                placeholder="Your Name"
                size="lg"
                bg="#111111"
                borderColor="gray.700"
              />

              <Input
                placeholder="Your Email"
                type="email"
                size="lg"
                bg="#111111"
                borderColor="gray.700"
              />

              <Input
                placeholder="Phone Number"
                size="lg"
                bg="#111111"
                borderColor="gray.700"
              />

              <Textarea
                placeholder="Your Message"
                minH="150px"
                bg="#111111"
                borderColor="gray.700"
              />

              <Button
                w="100%"
                size="lg"
                bg="#D4A017"
                color="black"
                borderRadius="full"
                fontWeight="bold"
                _hover={{
                  bg: "#F0C75E",
                }}
              >
                Send Message →
              </Button>

            </VStack>
          </Box>

        </Flex>


        {/* ========================= */}
        {/* LOCATION MAP */}
        {/* ========================= */}

        <Box mt={20}>

          <Box textAlign="center" mb={8}>

            <Text
              color="#D4A017"
              fontSize="sm"
              fontWeight="bold"
              letterSpacing="3px"
            >
              FIND US
            </Text>

            <Heading
              mt={3}
              fontSize={{ base: "3xl", md: "4xl" }}
            >
              Visit Our Restaurant
            </Heading>

            <Text
              color="gray.400"
              mt={3}
            >
              We'd love to welcome you.
            </Text>

          </Box>


          {/* MAP */}
          <Box
            w="100%"
            h={{ base: "300px", md: "450px" }}
            borderRadius="2xl"
            overflow="hidden"
            border="1px solid"
            borderColor="whiteAlpha.200"
          >

            <iframe
              title="Restaurant Location"
              src="https://www.google.com/maps?q=Chandigarh,India&output=embed"
              width="100%"
              height="100%"
              style={{
                border: 0,
              }}
              loading="lazy"
              allowFullScreen
            />

          </Box>

        </Box>

      </Box>
    </Box>
  
    </>
  );
}