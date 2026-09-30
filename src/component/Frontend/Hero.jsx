
import React from "react";
import {
  Box,
  Button,
  Flex,
  Heading,
  Text,
  HStack,
  Badge,
  VStack,
} from "@chakra-ui/react";

import { Link } from "react-router-dom";

const MotionBox = ({ initial, animate, transition, whileHover, whileInView, viewport, exit, layout, layoutId, ...props }) =>
  <Box {...props} />;

const MotionText = ({ initial, animate, transition, whileHover, whileInView, viewport, exit, layout, layoutId, ...props }) =>
  <Text {...props} />;

const Hero = () => {
  return (
    <Box
      minH="90vh"
      bg="#0B0B0B"
      color="white"
      position="relative"
      overflow="hidden"
    >
      {/* ================= BACKGROUND GLOW ================= */}

      <MotionBox
        position="absolute"
        w={{ base: "300px", md: "600px" }}
        h={{ base: "300px", md: "600px" }}
        bg="#D4A017"
        opacity="0.10"
        borderRadius="full"
        right={{ base: "-150px", md: "-200px" }}
        top="-180px"
        filter="blur(100px)"
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.08, 0.14, 0.08],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <MotionBox
        position="absolute"
        w="400px"
        h="400px"
        bg="#D4A017"
        opacity="0.06"
        borderRadius="full"
        left="-200px"
        bottom="-150px"
        filter="blur(100px)"
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* ================= DECORATIVE DOTS ================= */}

      <MotionBox
        position="absolute"
        top="25%"
        left="8%"
        w="8px"
        h="8px"
        bg="#D4A017"
        borderRadius="full"
        animate={{
          y: [0, -20, 0],
          opacity: [0.3, 1, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
        }}
      />

      <MotionBox
        position="absolute"
        right="12%"
        bottom="20%"
        w="6px"
        h="6px"
        bg="#D4A017"
        borderRadius="full"
        animate={{
          y: [0, 15, 0],
          opacity: [0.2, 1, 0.2],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
        }}
      />

      {/* ================= MAIN CONTENT ================= */}

      <Flex
        maxW="1250px"
        mx="auto"
        minH="90vh"
        px={{ base: 6, md: 10 }}
        py={{ base: 20, md: 10 }}
        align="center"
        position="relative"
        zIndex="2"
        direction={{ base: "column", lg: "row" }}
        justify="space-between"
        gap={{ base: 16, lg: 10 }}
      >

        {/* ================= LEFT SIDE ================= */}

        <MotionBox
          maxW="650px"
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: 0.8,
            ease: "easeOut",
          }}
        >

          {/* LABEL */}

          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <Badge
              bg="rgba(212,160,23,0.12)"
              color="#D4A017"
              px={5}
              py={2}
              borderRadius="full"
              fontSize="xs"
              letterSpacing="3px"
              border="1px solid rgba(212,160,23,0.25)"
            >
              WELCOME TO TASTE
            </Badge>
          </MotionBox>

          {/* HEADING */}

          <Heading
            mt={7}
            fontSize={{
              base: "4xl",
              sm: "5xl",
              md: "6xl",
              lg: "7xl",
            }}
            lineHeight="1.02"
            fontWeight="800"
            letterSpacing="-3px"
          >
            Delicious
            <br />

            <MotionText
              as="span"
              color="#D4A017"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              Food.
            </MotionText>{" "}

            <MotionText
              as="span"
              color="white"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              Beautiful
            </MotionText>

            <br />

            <MotionText
              as="span"
              color="#D4A017"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
            >
              Moments.
            </MotionText>
          </Heading>

          {/* DESCRIPTION */}

          <MotionText
            mt={7}
            maxW="580px"
            color="gray.400"
            fontSize={{ base: "md", md: "lg" }}
            lineHeight="1.8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 1.1,
              duration: 0.7,
            }}
          >
            Experience unforgettable flavors crafted with fresh
            ingredients, passion, and a touch of creativity.
            Your perfect dining experience starts here.
          </MotionText>

          {/* BUTTONS */}

          <MotionBox
            mt={9}
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 1.3,
              duration: 0.7,
            }}
          >
            <HStack
              gap={4}
              flexWrap="wrap"
            >

              {/* MENU BUTTON */}
              <Link to="/menu"><Button
                size="lg"
                px={8}
                h="56px"
                borderRadius="full"
                bg="#D4A017"
                color="black"
                fontWeight="bold"
                boxShadow="0 10px 30px rgba(212,160,23,0.2)"
                transition="all 0.3s"
                _hover={{
                  bg: "#F0C75E",
                  transform: "translateY(-4px)",
                  boxShadow:
                    "0 15px 40px rgba(212,160,23,0.35)",
                }}
              >
                Explore Menu →
              </Button></Link>
             

              {/* BOOK BUTTON */}
              <Link to="/menu"><Button
                size="lg"
                h="56px"
                px={8}
                borderRadius="full"
                variant="outline"
                borderColor="gray.600"
                color="white"
                transition="all 0.3s"
                _hover={{
                  borderColor: "#D4A017",
                  color: "#D4A017",
                  transform: "translateY(-4px)",
                  bg: "rgba(212,160,23,0.05)",
                }}
              >
                Book a Table
              </Button></Link>
            
            </HStack>
          </MotionBox>

          {/* ================= STATS ================= */}

          <MotionBox
            mt={12}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              delay: 1.5,
              duration: 0.8,
            }}
          >
            <HStack
              gap={{ base: 6, md: 10 }}
              flexWrap="wrap"
            >

              <Box>
                <Text
                  color="#D4A017"
                  fontSize="2xl"
                  fontWeight="bold"
                >
                  15+
                </Text>

                <Text
                  color="gray.500"
                  fontSize="sm"
                >
                  Years Experience
                </Text>
              </Box>

              <Box
                h="40px"
                w="1px"
                bg="gray.700"
              />

              <Box>
                <Text
                  color="#D4A017"
                  fontSize="2xl"
                  fontWeight="bold"
                >
                  50+
                </Text>

                <Text
                  color="gray.500"
                  fontSize="sm"
                >
                  Special Dishes
                </Text>
              </Box>

              <Box
                h="40px"
                w="1px"
                bg="gray.700"
              />

              <Box>
                <Text
                  color="#D4A017"
                  fontSize="2xl"
                  fontWeight="bold"
                >
                  4.9★
                </Text>

                <Text
                  color="gray.500"
                  fontSize="sm"
                >
                  Customer Rating
                </Text>
              </Box>

            </HStack>
          </MotionBox>

        </MotionBox>


        {/* ================= RIGHT SIDE ================= */}

        <MotionBox
          position="relative"
          w={{ base: "280px", sm: "360px", md: "430px" }}
          h={{ base: "280px", sm: "360px", md: "430px" }}
          initial={{
            opacity: 0,
            scale: 0.7,
            rotate: -10,
          }}
          animate={{
            opacity: 1,
            scale: 1,
            rotate: 0,
          }}
          transition={{
            duration: 1,
            delay: 0.4,
            ease: "easeOut",
          }}
        >

          {/* OUTER RING */}

          <MotionBox
            position="absolute"
            inset="0"
            border="1px solid rgba(212,160,23,0.2)"
            borderRadius="full"
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear",
            }}
          />

          {/* INNER GLOW */}

          <Box
            position="absolute"
            inset="35px"
            borderRadius="full"
            bg="radial-gradient(circle, rgba(212,160,23,0.22), rgba(212,160,23,0.02) 65%, transparent)"
            filter="blur(5px)"
          />

          {/* FOOD CARD */}

          <MotionBox
            position="absolute"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
            w="75%"
            h="75%"
            borderRadius="full"
            bg="#171717"
            border="1px solid rgba(255,255,255,0.08)"
            boxShadow="0 30px 80px rgba(0,0,0,0.6)"
            display="flex"
            alignItems="center"
            justifyContent="center"
            animate={{
              y: [0, -12, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >

            <Text
              fontSize={{
                base: "90px",
                sm: "120px",
                md: "150px",
              }}
              filter="drop-shadow(0 20px 20px rgba(0,0,0,0.5))"
            >
              🍕
            </Text>

          </MotionBox>


          {/* FLOATING BURGER */}

          <MotionBox
            position="absolute"
            top="5%"
            right="0"
            fontSize="50px"
            animate={{
              y: [0, -15, 0],
              rotate: [0, 8, 0],
            }}
            transition={{
              duration: 3.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            🍔
          </MotionBox>


          {/* FLOATING PASTA */}

          <MotionBox
            position="absolute"
            bottom="8%"
            left="-3%"
            fontSize="48px"
            animate={{
              y: [0, 12, 0],
              rotate: [0, -8, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            🍝
          </MotionBox>


          {/* FLOATING STAR */}

          <MotionBox
            position="absolute"
            top="20%"
            left="0"
            color="#D4A017"
            fontSize="24px"
            animate={{
              scale: [1, 1.4, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            ✦
          </MotionBox>


          {/* RATING CARD */}

          <MotionBox
            position="absolute"
            right="-5%"
            bottom="18%"
            px={4}
            py={3}
            bg="rgba(25,25,25,0.8)"
            backdropFilter="blur(12px)"
            border="1px solid rgba(255,255,255,0.08)"
            borderRadius="xl"
            boxShadow="0 15px 40px rgba(0,0,0,0.4)"
            animate={{
              y: [0, -8, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Text
              fontSize="xs"
              color="gray.500"
            >
              CUSTOMER RATING
            </Text>

            <Text
              color="#D4A017"
              fontWeight="bold"
              fontSize="lg"
            >
              ★ 4.9 / 5
            </Text>
          </MotionBox>

        </MotionBox>

      </Flex>

      {/* ================= BOTTOM FADE ================= */}

      <Box
        position="absolute"
        bottom="0"
        left="0"
        right="0"
        h="120px"
        bgGradient="linear(to-t, #111111, transparent)"
        pointerEvents="none"
      />

    </Box>
  );
};

export default Hero;

