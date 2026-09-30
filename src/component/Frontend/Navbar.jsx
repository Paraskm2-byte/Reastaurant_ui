import React from 'react';
import {
  Box,
  Flex,
  HStack,
  Text,
  Button,
  IconButton,
  Drawer,
  Portal,
  Badge,
} from '@chakra-ui/react';

import { FiMenu, FiX, FiArrowRight, FiShoppingCart } from 'react-icons/fi';

import { Link, Link as RouterLink, useLocation } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

function Navbar() {
  const location = useLocation();
  const { cartCount } = useCart();

  const links = [
    { name: "Home", path: "/" },
    { name: "Menu", path: "/menu" },
    { name: "About", path: "/about" },
    { name: "Gallery", path: "/gallery" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <Box
      position="sticky"
      top="0"
      zIndex="1000"
      bg="rgba(17,17,17,0.95)"
      backdropFilter="blur(12px)"
      borderBottom="1px solid"
      borderColor="gray.800"
    >

      <Flex
        maxW="1250px"
        mx="auto"
        px={{ base: 5, md: 8 }}
        py={4}
        align="center"
        justify="space-between"
      >

        {/* ================= LOGO ================= */}

        <Box
          as={RouterLink}
          to="/"
          textDecoration="none"
        >
          <Text
            fontSize={{ base: "2xl", md: "3xl" }}
            fontWeight="900"
            letterSpacing="3px"
            color="#D4A017"
          >
            TASTE
          </Text>

          <Text
            fontSize="9px"
            letterSpacing="4px"
            color="gray.400"
            textAlign="center"
            mt="-1"
          >
            RESTAURANT
          </Text>
        </Box>


        {/* ================= DESKTOP LINKS ================= */}

        <HStack
          display={{ base: "none", lg: "flex" }}
          gap={2}
        >

          {links.map((link) => {
            const active =
              location.pathname === link.path;

            return (
              <Box
                key={link.path}
                position="relative"
              >
                <Box
                  as={RouterLink}
                  to={link.path}
                  px={4}
                  py={2}
                  color={
                    active
                      ? "#D4A017"
                      : "gray.300"
                  }
                  fontWeight="500"
                  textDecoration="none"
                  transition="0.3s"
                  _hover={{
                    color: "#D4A017",
                  }}
                >
                  {link.name}
                </Box>

                {/* ACTIVE LINE */}

                {active && (
                  <Box
                    position="absolute"
                    bottom="-5px"
                    left="16px"
                    right="16px"
                    height="2px"
                    background="#D4A017"
                    borderRadius="10px"
                  />
                )}
              </Box>
            );
          })}

        </HStack>


        <HStack display={{ base: 'none', lg: 'flex' }} spacing={3}>
          <Button
            as={RouterLink}
            to="/cart"
            variant="outline"
            color="white"
            borderColor="gray.700"
            borderRadius="full"
            position="relative"
            _hover={{ borderColor: '#D4A017', color: '#D4A017' }}
          >
            <FiShoppingCart />
            {cartCount > 0 && (
              <Badge
                ml={2}
                bg="blue.500"
                color="white"
                borderRadius="full"
                minW="24px"
                textAlign="center"
              >
                {cartCount}
              </Badge>
            )}
          </Button>
          <Link to="/menu"> <Button
            as={RouterLink}
            to="/menu"
            bg="#D4A017"
            color="black"
            px={6}
            borderRadius="full"
            fontWeight="700"
            _hover={{
              bg: '#E5B52A',
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 25px rgba(212,160,23,0.25)',
            }}
            transition="0.3s"
          >
            Book a Table
            <FiArrowRight />
          </Button>
          </Link>
         
        </HStack>


        {/* ================= MOBILE MENU ================= */}

        <Drawer.Root placement="end">

          <Drawer.Trigger asChild>

            <IconButton
              display={{ base: "flex", lg: "none" }}
              aria-label="Open menu"
              variant="outline"
              color="white"
              borderColor="gray.700"
              _hover={{
                borderColor: "#D4A017",
                color: "#D4A017",
              }}
            >
              <FiMenu />
            </IconButton>

          </Drawer.Trigger>


          <Portal>

            <Drawer.Backdrop />

            <Drawer.Positioner>

              <Drawer.Content
                bg="#111111"
                color="white"
                maxW="320px"
              >

                {/* MOBILE HEADER */}

                <Drawer.Header
                  borderBottom="1px solid"
                  borderColor="gray.800"
                >

                  <Flex
                    justify="space-between"
                    align="center"
                  >

                    <Text
                      fontSize="2xl"
                      fontWeight="900"
                      color="#D4A017"
                      letterSpacing="3px"
                    >
                      TASTE
                    </Text>

                    <Drawer.CloseTrigger asChild>

                      <IconButton
                        aria-label="Close menu"
                        variant="ghost"
                        color="white"
                        _hover={{
                          color: "#D4A017",
                        }}
                      >
                        <FiX />
                      </IconButton>

                    </Drawer.CloseTrigger>

                  </Flex>

                </Drawer.Header>


                {/* MOBILE LINKS */}

                <Drawer.Body>

                  <Flex
                    direction="column"
                    gap={3}
                    mt={5}
                  >

                    {links.map((link) => {

                      const active =
                        location.pathname ===
                        link.path;

                      return (
                        <Box
                          key={link.path}
                          as={RouterLink}
                          to={link.path}
                          px={4}
                          py={4}
                          borderRadius="lg"
                          bg={
                            active
                              ? "rgba(212,160,23,0.12)"
                              : "transparent"
                          }
                          color={
                            active
                              ? "#D4A017"
                              : "gray.300"
                          }
                          fontWeight="600"
                          _hover={{
                            bg: "rgba(212,160,23,0.12)",
                            color: "#D4A017",
                          }}
                        >
                          {link.name}
                        </Box>
                      );
                    })}


                    <Button
                      as={RouterLink}
                      to="/cart"
                      variant="outline"
                      color="white"
                      borderColor="gray.700"
                      borderRadius="full"
                      mt={5}
                      size="lg"
                      leftIcon={<FiShoppingCart />}
                    >
                      Cart ({cartCount})
                    </Button>

                    <Button
                      as={RouterLink}
                      to="/menu"
                      bg="#D4A017"
                      color="black"
                      borderRadius="full"
                      mt={2}
                      size="lg"
                    >
                      Book a Table
                    </Button>

                  </Flex>

                </Drawer.Body>

              </Drawer.Content>

            </Drawer.Positioner>

          </Portal>

        </Drawer.Root>

      </Flex>

    </Box>
  );
}

export default Navbar;