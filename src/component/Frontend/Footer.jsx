import React from "react";
import {
  Box,
  Container,
  Grid,
  GridItem,
  Heading,
  Text,
  Link,
  HStack,
  VStack,
  Separator,
} from "@chakra-ui/react";

const Footer = () => {
  return (
    <Box bg="#111111" color="white" pt={14} pb={6}>
      <Container maxW="1200px">

        {/* TOP FOOTER */}
        <Grid
          templateColumns={{
            base: "1fr",
            md: "2fr 1fr 1fr 1fr",
          }}
          gap={10}
        >

          {/* ABOUT */}
          <GridItem>
            <Heading
              size="lg"
              color="#D4A017"
              mb={4}
            >
              TASTE
            </Heading>

            <Text
              color="gray.400"
              lineHeight="1.8"
              maxW="350px"
            >
              Delicious food, beautiful moments.
              We serve freshly prepared dishes
              made with passion and love.
            </Text>
          </GridItem>


          {/* QUICK LINKS */}
          <GridItem>
            <Heading size="md" mb={5}>
              Quick Links
            </Heading>

            <VStack align="start" gap={3}>
              <Link href="/" color="gray.400">
                Home
              </Link>

              <Link href="/menu" color="gray.400">
                Menu
              </Link>

              <Link href="/about" color="gray.400">
                About
              </Link>

              <Link href="/gallery" color="gray.400">
                Gallery
              </Link>

              <Link href="/contact" color="gray.400">
                Contact
              </Link>
            </VStack>
          </GridItem>


          {/* CONTACT */}
          <GridItem>
            <Heading size="md" mb={5}>
              Contact
            </Heading>

            <VStack align="start" gap={3}>
              <Text color="gray.400">
                📍 Chandigarh, India
              </Text>

              <Text color="gray.400">
                📞 +91 98765 43210
              </Text>

              <Text color="gray.400">
                ✉️ hello@taste.com
              </Text>
            </VStack>
          </GridItem>


          {/* OPENING HOURS */}
          <GridItem>
            <Heading size="md" mb={5}>
              Opening Hours
            </Heading>

            <VStack align="start" gap={3}>
              <Text color="gray.400">
                Monday - Friday
              </Text>

              <Text color="#D4A017">
                11:00 AM - 10:00 PM
              </Text>

              <Text color="gray.400">
                Saturday - Sunday
              </Text>

              <Text color="#D4A017">
                10:00 AM - 11:00 PM
              </Text>
            </VStack>
          </GridItem>

        </Grid>


        {/* LINE */}
        <Separator my={10} borderColor="gray.700" />


        {/* BOTTOM FOOTER */}
        <HStack
          justify="space-between"
          flexDirection={{
            base: "column",
            md: "row",
          }}
          gap={4}
        >
          <Text color="gray.500" fontSize="sm">
            © 2026 TASTE Restaurant. All rights reserved.
          </Text>

          <HStack gap={5}>
            <Link color="gray.500" fontSize="sm">
              Privacy Policy
            </Link>

            <Link color="gray.500" fontSize="sm">
              Terms & Conditions
            </Link>
          </HStack>
        </HStack>

      </Container>
    </Box>
  );
};

export default Footer;