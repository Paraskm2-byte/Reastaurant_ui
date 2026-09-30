
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

const MotionBox = ({ initial, animate, transition, whileHover, whileInView, viewport, exit, layout, layoutId, ...props }) =>
  <Box {...props} />;

export default function FullGallery() {
  const [filter, setFilter] = useState("All");

  const gallery = [
    {
      id: 1,
      title: "Signature Burger",
      category: "Food",
      image:
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1200&q=85",
    },
    {
      id: 2,
      title: "Fine Dining",
      category: "Restaurant",
      image:
        "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=1200&q=85",
    },
    {
      id: 3,
      title: "Fresh Pasta",
      category: "Food",
      image:
        "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=1200&q=85",
    },
    {
      id: 4,
      title: "Premium Steak",
      category: "Food",
      image:
        "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=85",
    },
    {
      id: 5,
      title: "Restaurant Interior",
      category: "Restaurant",
      image:
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=85",
    },
    {
      id: 6,
      title: "Italian Pizza",
      category: "Food",
      image:
        "https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=1200&q=85",
    },
    {
      id: 7,
      title: "Evening Dinner",
      category: "Events",
      image:
        "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=1200&q=85",
    },
    {
      id: 8,
      title: "Chef's Special",
      category: "Food",
      image:
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=85",
    },
    {
      id: 9,
      title: "Luxury Dining",
      category: "Restaurant",
      image:
        "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1200&q=85",
    },
  ];

  const categories = ["All", "Food", "Restaurant", "Events"];

  const filteredGallery =
    filter === "All"
      ? gallery
      : gallery.filter((item) => item.category === filter);

  return (
    <Box
      bg="#070707"
      color="white"
      minH="100vh"
      overflow="hidden"
    >
      {/* =====================================================
          HERO
      ====================================================== */}

      <Box
        position="relative"
        h={{ base: "520px", md: "620px" }}
        overflow="hidden"
      >
        {/* HERO IMAGE */}

        <Image
          src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=2000&q=85"
          alt="Restaurant"
          position="absolute"
          inset="0"
          w="100%"
          h="100%"
          objectFit="cover"
          filter="brightness(0.38)"
          transform="scale(1.04)"
        />

        {/* DARK GRADIENT */}

        <Box
          position="absolute"
          inset="0"
          bgGradient="
            linear(
              to-b,
              rgba(0,0,0,0.35),
              rgba(0,0,0,0.75)
            )
          "
        />

        {/* GOLD GLOW */}

        <Box
          position="absolute"
          top="-180px"
          left="50%"
          transform="translateX(-50%)"
          w="500px"
          h="500px"
          borderRadius="full"
          bg="#D4A017"
          opacity="0.10"
          filter="blur(130px)"
        />

        {/* HERO CONTENT */}

        <Flex
          position="relative"
          zIndex="2"
          h="100%"
          align="center"
          justify="center"
          textAlign="center"
          px={5}
        >
          <MotionBox
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Text
              color="#D4A017"
              fontSize="xs"
              fontWeight="800"
              letterSpacing="6px"
              mb={5}
            >
              THE EXPERIENCE
            </Text>

            <Heading
              fontSize={{
                base: "4xl",
                sm: "5xl",
                md: "7xl",
              }}
              fontWeight="800"
              lineHeight="0.95"
              letterSpacing="-3px"
            >
              Our
              <Box
                as="span"
                display="block"
                color="#D4A017"
              >
                Gallery
              </Box>
            </Heading>

            <Text
              maxW="600px"
              mx="auto"
              mt={7}
              color="gray.300"
              fontSize={{ base: "sm", md: "md" }}
              lineHeight="1.8"
            >
              A visual journey through our food,
              atmosphere, celebrations and unforgettable
              dining moments.
            </Text>

            <MotionBox
              mt={8}
              animate={{
                y: [0, 8, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Text
                color="whiteAlpha.600"
                fontSize="sm"
              >
                ↓ Explore the collection
              </Text>
            </MotionBox>
          </MotionBox>
        </Flex>
      </Box>

      {/* =====================================================
          GALLERY SECTION
      ====================================================== */}

      <Container
        maxW="1300px"
        py={{ base: 16, md: 24 }}
      >
        {/* SECTION HEADER */}

        <Flex
          direction={{ base: "column", md: "row" }}
          justify="space-between"
          align={{ base: "flex-start", md: "end" }}
          gap={8}
          mb={12}
        >
          <Box>
            <Text
              color="#D4A017"
              fontSize="xs"
              fontWeight="800"
              letterSpacing="4px"
              mb={3}
            >
              DISCOVER
            </Text>

            <Heading
              fontSize={{
                base: "3xl",
                md: "5xl",
              }}
              fontWeight="800"
            >
              Moments From
              <Box
                as="span"
                color="#D4A017"
              >
                {" "}Our World
              </Box>
            </Heading>
          </Box>

          <Text
            color="gray.500"
            maxW="400px"
            fontSize="sm"
            lineHeight="1.8"
          >
            From carefully prepared dishes to beautiful
            evenings, every moment tells a story.
          </Text>
        </Flex>

        {/* =====================================================
            FILTERS
        ====================================================== */}

        <Flex
          gap={3}
          flexWrap="wrap"
          mb={12}
        >
          {categories.map((category, index) => (
            <MotionBox
              key={category}
              initial={{
                opacity: 0,
                y: 15,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: index * 0.08,
              }}
            >
              <Button
                onClick={() => setFilter(category)}
                borderRadius="full"
                px={7}
                h="44px"
                bg={
                  filter === category
                    ? "#D4A017"
                    : "transparent"
                }
                color={
                  filter === category
                    ? "black"
                    : "gray.400"
                }
                border="1px solid"
                borderColor={
                  filter === category
                    ? "#D4A017"
                    : "whiteAlpha.200"
                }
                fontSize="sm"
                _hover={{
                  bg:
                    filter === category
                      ? "#E8B52A"
                      : "whiteAlpha.100",
                  color:
                    filter === category
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

        {/* =====================================================
            MASONRY-STYLE GALLERY
        ====================================================== */}

        <AnimatePresence mode="wait">
          <SimpleGrid
            key={filter}
            columns={{
              base: 1,
              sm: 2,
              lg: 3,
            }}
            gap={5}
          >
            {filteredGallery.map((item, index) => (
              <MotionBox
                key={item.id}
                initial={{
                  opacity: 0,
                  y: 40,
                  scale: 0.96,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                }}
                transition={{
                  duration: 0.55,
                  delay: index * 0.07,
                  ease: [0.22, 1, 0.36, 1],
                }}
                position="relative"
                overflow="hidden"
                borderRadius="24px"
                h={{
                  base: "360px",
                  sm: "390px",
                  lg:
                    index % 5 === 0
                      ? "500px"
                      : "390px",
                }}
                bg="#111"
                cursor="pointer"
                role="group"
                border="1px solid"
                borderColor="whiteAlpha.100"
               
                whileHover={{
                  y: -7,
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
                  transition="transform 0.8s ease"
                  _groupHover={{
                    transform: "scale(1.09)",
                  }}
                />

                {/* GRADIENT */}

                <Box
                  position="absolute"
                  inset="0"
                  bgGradient="
                    linear(
                      to-t,
                      rgba(0,0,0,0.95),
                      rgba(0,0,0,0.15) 65%,
                      transparent
                    )
                  "
                />

                {/* GOLD HOVER */}

                <Box
                  position="absolute"
                  inset="0"
                  bg="#D4A017"
                  opacity="0"
                  transition="opacity 0.4s"
                  _groupHover={{
                    opacity: 0.08,
                  }}
                />

                {/* CATEGORY */}

                <Box
                  position="absolute"
                  top="18px"
                  left="18px"
                  px={4}
                  py={2}
                  borderRadius="full"
                  bg="rgba(0,0,0,0.55)"
                  backdropFilter="blur(12px)"
                  border="1px solid"
                  borderColor="whiteAlpha.200"
                >
                  <Text
                    color="#D4A017"
                    fontSize="9px"
                    fontWeight="800"
                    letterSpacing="2px"
                  >
                    {item.category.toUpperCase()}
                  </Text>
                </Box>

                {/* NUMBER */}

                <Text
                  position="absolute"
                  top="20px"
                  right="22px"
                  color="whiteAlpha.500"
                  fontSize="sm"
                  fontWeight="600"
                >
                  {String(item.id).padStart(2, "0")}
                </Text>

                {/* VIEW ICON */}

                <MotionBox
                  position="absolute"
                  right="18px"
                  bottom="105px"
                  w="48px"
                  h="48px"
                  borderRadius="full"
                  bg="#D4A017"
                  color="black"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  fontSize="20px"
                  opacity="0"
                  transform="scale(0.7)"
                  transition="all 0.3s"
                  _groupHover={{
                    opacity: 1,
                    transform: "scale(1)",
                  }}
                  whileHover={{
                    scale: 1.12,
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
                    fontSize="10px"
                    fontWeight="800"
                    letterSpacing="2px"
                    mb={2}
                  >
                    FEATURED MOMENT
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

                  <Flex
                    align="center"
                    gap={2}
                    mt={3}
                    color="gray.400"
                    fontSize="sm"
                  >
                    <Box
                      w="20px"
                      h="1px"
                      bg="#D4A017"
                    />

                    <Text>
                      Explore moment
                    </Text>
                  </Flex>
                </Box>

                {/* BORDER */}

                <Box
                  position="absolute"
                  inset="0"
                  border="1px solid"
                  borderColor="#D4A017"
                  borderRadius="24px"
                  opacity="0"
                  pointerEvents="none"
                  transition="opacity 0.3s"
                  _groupHover={{
                    opacity: 0.6,
                  }}
                />
              </MotionBox>
            ))}
          </SimpleGrid>
        </AnimatePresence>

        {/* =====================================================
            BOTTOM CTA
        ====================================================== */}

        <MotionBox
          mt={24}
          position="relative"
          overflow="hidden"
          borderRadius="30px"
          border="1px solid"
          borderColor="whiteAlpha.100"
          bg="#101010"
          p={{
            base: 8,
            md: 14,
          }}
          textAlign="center"
          initial={{
            opacity: 0,
            y: 40,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.7,
          }}
        >
          {/* GLOW */}

          <Box
            position="absolute"
            top="-150px"
            left="50%"
            transform="translateX(-50%)"
            w="400px"
            h="300px"
            borderRadius="full"
            bg="#D4A017"
            opacity="0.08"
            filter="blur(100px)"
          />

          <Box position="relative">
            <Text
              color="#D4A017"
              fontSize="xs"
              fontWeight="800"
              letterSpacing="4px"
              mb={4}
            >
              YOUR TABLE AWAITS
            </Text>

            <Heading
              fontSize={{
                base: "2xl",
                md: "4xl",
              }}
              fontWeight="800"
            >
              Don't Just See It.
              <Box
                as="span"
                color="#D4A017"
              >
                {" "}Experience It.
              </Box>
            </Heading>

            <Text
              color="gray.500"
              maxW="550px"
              mx="auto"
              mt={4}
              fontSize="sm"
              lineHeight="1.8"
            >
              Come and create your own unforgettable
              moments with us.
            </Text>

            <MotionBox
              display="inline-block"
              mt={8}
              whileHover={{
                scale: 1.05,
                y: -3,
              }}
              whileTap={{
                scale: 0.96,
              }}
            >
              <Button
                h="56px"
                px={10}
                borderRadius="full"
                bg="#D4A017"
                color="black"
                fontWeight="800"
                fontSize="md"
                _hover={{
                  bg: "#E8B52A",
                  boxShadow:
                    "0 15px 45px rgba(212,160,23,0.25)",
                }}
              >
                Reserve Your Table →
              </Button>
            </MotionBox>
          </Box>
        </MotionBox>
      </Container>
    </Box>
  );
}
