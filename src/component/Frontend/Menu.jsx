import React from "react";

import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  Image,
  Button,
  HStack,
  VStack,
  Badge,
  IconButton,
  Divider,
} from "@chakra-ui/react";

import {
  FiHeart,
  FiShoppingCart,
  FiCoffee,
  FiDroplet,
  FiStar,
  FiPackage,
} from "react-icons/fi";

const MotionBox = ({ initial, animate, transition, whileHover, whileInView, viewport, exit, layout, layoutId, ...props }) =>
  <Box {...props} />;


// ======================================================
// MENU ITEM CARD
// ======================================================

function MenuItem({
  image,
  name,
  price,
  description,
  tag = "Fresh",
}) {

  return (

    <MotionBox
      whileHover={{
        y: -7,
      }}

      transition={{
        duration: 0.25,
      }}
    >

      <Box
        bg="#101725"
        border="1px solid"
        borderColor="whiteAlpha.100"
        borderRadius="2xl"
        overflow="hidden"
        position="relative"

        _hover={{
          borderColor: "blue.500",
          boxShadow:
            "0 18px 45px rgba(30,100,255,0.18)",
        }}

        transition="0.3s"
      >

        {/* IMAGE */}

        <Box
          h="190px"
          position="relative"
          overflow="hidden"
        >

          <Image
            src={image}
            alt={name}
            w="100%"
            h="100%"
            objectFit="cover"

            transition="0.5s"

            _hover={{
              transform: "scale(1.08)",
            }}
          />


          {/* TAG */}

          <Badge
            position="absolute"
            top={3}
            left={3}
            bg="blue.500"
            color="white"
            px={3}
            py={1}
            borderRadius="full"
            fontSize="xs"
          >
            {tag}
          </Badge>


          {/* HEART */}

          <IconButton
            aria-label="Favorite"
            position="absolute"
            top={3}
            right={3}
            borderRadius="full"
            bg="blackAlpha.700"
            color="white"

            _hover={{
              bg: "blue.500",
              transform: "scale(1.1)",
            }}

            transition="0.2s"
          >

            <FiHeart />

          </IconButton>

        </Box>


        {/* CONTENT */}

        <VStack
          align="stretch"
          gap={3}
          p={5}
        >

          <HStack
            justify="space-between"
            align="start"
          >

            <Heading
              fontSize="lg"
              fontWeight="800"
              lineHeight="1.3"
            >
              {name}
            </Heading>


            <Text
              color="blue.400"
              fontSize="lg"
              fontWeight="900"
              whiteSpace="nowrap"
            >
              ₹{price}
            </Text>

          </HStack>


          <Text
            color="gray.400"
            fontSize="sm"
            lineHeight="1.6"
            minH="45px"
          >
            {description}
          </Text>


          <HStack
            justify="space-between"
            pt={2}
          >

            <Badge
              bg="whiteAlpha.100"
              color="gray.300"
              px={3}
              py={1}
              borderRadius="full"
            >
              {tag}
            </Badge>


            <Button
              size="sm"
              bg="blue.500"
              color="white"
              borderRadius="lg"
              px={5}

              _hover={{
                bg: "blue.600",
                transform: "translateY(-2px)",
              }}
            >

              <FiShoppingCart />

              Add to Cart

            </Button>

          </HStack>

        </VStack>

      </Box>

    </MotionBox>

  );
}


// ======================================================
// SECTION HEADER
// ======================================================

function MenuSection({
  icon,
  title,
  subtitle,
  children,
}) {

  return (

    <Box mb={20}>

      {/* SECTION TITLE */}

      <VStack
        gap={2}
        mb={8}
        textAlign="center"
      >

        <HStack
          bg="blue.500"
          color="white"
          px={7}
          py={2.5}
          borderRadius="full"
          fontWeight="900"
          fontSize={{
            base: "md",
            md: "lg",
          }}

          boxShadow="0 10px 30px rgba(30,100,255,0.2)"
        >

          {icon}

          <Text>
            {title}
          </Text>

        </HStack>


        <Text
          color="gray.500"
          fontSize="sm"
        >
          {subtitle}
        </Text>

      </VStack>


      {/* ITEMS */}

      <SimpleGrid
        columns={{
          base: 1,
          sm: 2,
          lg: 3,
        }}
        gap={7}
      >

        {children}

      </SimpleGrid>

    </Box>

  );
}


// ======================================================
// MAIN MENU PAGE
// ======================================================

export default function Menu() {

  return (

    <Box
      minH="100vh"
      bg="#070B14"
      color="white"
      py={{
        base: 10,
        md: 16,
      }}
    >

      <Container
        maxW="1250px"
      >


        {/* ================================================= */}
        {/* HERO / HEADER */}
        {/* ================================================= */}

        <VStack
          textAlign="center"
          gap={4}
          mb={20}
        >

          <Badge
            bg="blue.500"
            color="white"
            px={5}
            py={2}
            borderRadius="full"
            letterSpacing="3px"
          >

            OUR MENU

          </Badge>


          <Heading
            fontSize={{
              base: "3xl",
              sm: "4xl",
              md: "6xl",
            }}
            fontWeight="900"
            lineHeight="1.1"
          >

            Delicious Food,

            <Text
              as="span"
              color="blue.400"
            >
              {" "}Made For You
            </Text>

          </Heading>


          <Text
            maxW="700px"
            color="gray.400"
            fontSize={{
              base: "sm",
              md: "md",
            }}
            lineHeight="1.8"
          >

            Discover our delicious selection of freshly
            prepared pizzas, snacks, beverages, shakes
            and much more.

          </Text>

        </VStack>


        {/* ================================================= */}
        {/* PIZZA */}
        {/* ================================================= */}

        <MenuSection
          icon={<FiStar />}
          title="PIZZA"
          subtitle="Freshly Baked • Loaded With Cheese"
        >

          <MenuItem
            image="/images/margherita.jpg"
            name="Margherita Pizza"
            price="199"
            description="Loaded mozzarella cheese with our signature pizza sauce."
            tag="Popular"
          />

          <MenuItem
            image="/images/cheese-corn.jpg"
            name="Cheese & Corn Pizza"
            price="249"
            description="Sweet corn, mozzarella cheese and delicious herbs."
            tag="Veg"
          />

          <MenuItem
            image="/images/paneer-pizza.jpg"
            name="Cheese & Paneer Pizza"
            price="299"
            description="Soft paneer, cheese and special pizza seasoning."
            tag="Chef's Choice"
          />

          <MenuItem
            image="/images/farm-fresh.jpg"
            name="Farm Fresh Pizza"
            price="299"
            description="Onion, capsicum, tomato, mushroom and cheese."
            tag="Fresh"
          />

          <MenuItem
            image="/images/tandoori.jpg"
            name="Tandoori Pizza"
            price="329"
            description="Tandoori paneer, onion, capsicum and creamy cheese."
            tag="Spicy"
          />

          <MenuItem
            image="/images/supreme.jpg"
            name="Supreme Blast Pizza"
            price="399"
            description="Loaded with vegetables, paneer and extra cheese."
            tag="Special"
          />

        </MenuSection>


        {/* ================================================= */}
        {/* SNACKS */}
        {/* ================================================= */}

        <MenuSection
          icon={<FiPackage />}
          title="SNACKS"
          subtitle="Crispy • Hot • Delicious"
        >

          <MenuItem
            image="/images/garlic-bread.jpg"
            name="Stuffed Garlic Bread"
            price="130"
            description="Soft garlic bread stuffed with cheese and served with dip."
            tag="Popular"
          />

          <MenuItem
            image="/images/garlic-sticks.jpg"
            name="Garlic Bread Sticks"
            price="100"
            description="Crispy garlic bread sticks with cheesy dip."
            tag="Fresh"
          />

          <MenuItem
            image="/images/fries.jpg"
            name="French Fries"
            price="80"
            description="Golden crispy fries served hot and fresh."
            tag="Crispy"
          />

          <MenuItem
            image="/images/peri-fries.jpg"
            name="Peri Peri Fries"
            price="90"
            description="Crispy fries coated with spicy peri peri seasoning."
            tag="Spicy"
          />

          <MenuItem
            image="/images/calzone.jpg"
            name="Cheesy Calzone"
            price="130"
            description="Baked calzone filled with delicious cheese."
            tag="New"
          />

          <MenuItem
            image="/images/zinger-parcel.jpg"
            name="Zingy Parcel"
            price="140"
            description="Crispy parcel filled with spicy delicious stuffing."
            tag="Special"
          />

        </MenuSection>


        {/* ================================================= */}
        {/* PASTA */}
        {/* ================================================= */}

        <MenuSection
          icon={<FiCoffee />}
          title="ITALIAN PASTA"
          subtitle="Creamy • Cheesy • Italian"
        >

          <MenuItem
            image="/images/red-pasta.jpg"
            name="Red Sauce Pasta"
            price="110"
            description="Pasta tossed in rich and flavorful red sauce."
            tag="Classic"
          />

          <MenuItem
            image="/images/white-pasta.jpg"
            name="White Sauce Pasta"
            price="120"
            description="Creamy white sauce pasta with herbs and cheese."
            tag="Creamy"
          />

          <MenuItem
            image="/images/mix-pasta.jpg"
            name="Mix Pasta"
            price="130"
            description="Perfect combination of creamy white and spicy red sauce."
            tag="Popular"
          />

          <MenuItem
            image="/images/tandoori-pasta.jpg"
            name="Tandoori Pasta"
            price="140"
            description="Italian pasta with an Indian tandoori twist."
            tag="Special"
          />

        </MenuSection>


        {/* ================================================= */}
        {/* BURGERS */}
        {/* ================================================= */}

        <MenuSection
          icon={<FiPackage />}
          title="BURGER"
          subtitle="Loaded • Juicy • Delicious"
        >

          <MenuItem
            image="/images/burger.jpg"
            name="Classic Burger"
            price="120"
            description="Classic veggie patty with fresh vegetables and sauce."
            tag="Classic"
          />

          <MenuItem
            image="/images/paneer-burger.jpg"
            name="Paneer Burger"
            price="150"
            description="Crispy paneer patty with cheese and special sauce."
            tag="Popular"
          />

          <MenuItem
            image="/images/spicy-burger.jpg"
            name="Spicy Burger"
            price="140"
            description="Spicy crispy patty with fresh vegetables."
            tag="Spicy"
          />

        </MenuSection>


        {/* ================================================= */}
        {/* SANDWICH */}
        {/* ================================================= */}

        <MenuSection
          icon={<FiPackage />}
          title="SANDWICH"
          subtitle="Fresh • Toasted • Tasty"
        >

          <MenuItem
            image="/images/cheese-corn-sandwich.jpg"
            name="Cheese Corn Sandwich"
            price="80"
            description="Cheesy sandwich loaded with sweet corn."
            tag="Popular"
          />

          <MenuItem
            image="/images/spicy-sandwich.jpg"
            name="Hot & Spicy Sandwich"
            price="90"
            description="Toasted sandwich with spicy filling and cheese."
            tag="Spicy"
          />

          <MenuItem
            image="/images/makhani-sandwich.jpg"
            name="Makhani Sandwich"
            price="110"
            description="Creamy makhani filling with cheese and vegetables."
            tag="Special"
          />

        </MenuSection>


        {/* ================================================= */}
        {/* WRAPS */}
        {/* ================================================= */}

        <MenuSection
          icon={<FiPackage />}
          title="WRAPS"
          subtitle="Freshly Wrapped • Full Of Flavor"
        >

          <MenuItem
            image="/images/saucy-wrap.jpg"
            name="Saucy Wrap"
            price="80"
            description="Soft wrap filled with vegetables and creamy sauce."
            tag="Fresh"
          />

          <MenuItem
            image="/images/spicy-wrap.jpg"
            name="Spicy Wrap"
            price="90"
            description="Spicy vegetable filling wrapped in soft flatbread."
            tag="Spicy"
          />

          <MenuItem
            image="/images/paneer-wrap.jpg"
            name="Paneer Tandoori Wrap"
            price="129"
            description="Tandoori paneer with fresh vegetables and creamy sauce."
            tag="Popular"
          />

        </MenuSection>


        {/* ================================================= */}
        {/* SHAKES & ICE CREAM */}
        {/* ================================================= */}

        <MenuSection
          icon={<FiCoffee />}
          title="SHAKES & ICE CREAMS"
          subtitle="Cold • Creamy • Refreshing"
        >

          <MenuItem
            image="/images/oreo-shake.jpg"
            name="Oreo Shake"
            price="99"
            description="Creamy chocolate shake loaded with Oreo."
            tag="Popular"
          />

          <MenuItem
            image="/images/chocolate-shake.jpg"
            name="Chocolate Shake"
            price="99"
            description="Rich and creamy chocolate milkshake."
            tag="Classic"
          />

          <MenuItem
            image="/images/strawberry-shake.jpg"
            name="Strawberry Shake"
            price="99"
            description="Sweet and creamy strawberry milkshake."
            tag="Fresh"
          />

          <MenuItem
            image="/images/vanilla-shake.jpg"
            name="Vanilla Shake"
            price="99"
            description="Smooth and creamy classic vanilla shake."
            tag="Classic"
          />

          <MenuItem
            image="/images/butterscotch.jpg"
            name="Butter Scotch"
            price="99"
            description="Rich butterscotch flavored creamy dessert."
            tag="Special"
          />

          <MenuItem
            image="/images/icecream.jpg"
            name="Ice Cream"
            price="80"
            description="Creamy chilled ice cream with your favorite flavor."
            tag="Sweet"
          />

        </MenuSection>


        {/* ================================================= */}
        {/* COLD DRINKS */}
        {/* ================================================= */}

        <MenuSection
          icon={<FiDroplet />}
          title="COLD DRINKS & BEVERAGES"
          subtitle="Chilled • Refreshing • Perfect With Food"
        >

          <MenuItem
            image="/images/cold-coffee.jpg"
            name="Cold Coffee"
            price="79"
            description="Chilled creamy coffee served with a smooth finish."
            tag="Popular"
          />

          <MenuItem
            image="/images/coke.jpg"
            name="Coke"
            price="60"
            description="Refreshing chilled soft drink."
            tag="Cold"
          />

          <MenuItem
            image="/images/mocktail.jpg"
            name="Fresh Mocktail"
            price="110"
            description="Refreshing fruity mocktail served chilled."
            tag="Fresh"
          />

          <MenuItem
            image="/images/lemonade.jpg"
            name="Fresh Lemonade"
            price="70"
            description="Freshly prepared chilled lemon drink."
            tag="Refreshing"
          />

        </MenuSection>


        {/* ================================================= */}
        {/* SPECIAL COMBO */}
        {/* ================================================= */}

        <Box
          bg="linear-gradient(135deg, #101725, #111d35)"
          border="1px solid"
          borderColor="blue.500"
          borderRadius="3xl"
          p={{
            base: 6,
            md: 10,
          }}
          mb={10}
          textAlign="center"
          boxShadow="0 20px 60px rgba(30,100,255,0.15)"
        >

          <Badge
            bg="blue.500"
            color="white"
            px={5}
            py={2}
            borderRadius="full"
            mb={4}
          >
            SPECIAL OFFER
          </Badge>


          <Heading
            fontSize={{
              base: "2xl",
              md: "4xl",
            }}
            fontWeight="900"
          >
            Make Your Own Combo
          </Heading>


          <Text
            color="gray.400"
            maxW="600px"
            mx="auto"
            mt={3}
          >
            Choose your favorite pizza, snack and beverage
            and create your perfect meal.
          </Text>


          <Button
            mt={6}
            bg="blue.500"
            color="white"
            size="lg"
            borderRadius="xl"
            px={8}

            _hover={{
              bg: "blue.600",
              transform: "translateY(-3px)",
            }}
          >
            Explore Combos
          </Button>

        </Box>


        {/* ================================================= */}
        {/* BOTTOM */}
        {/* ================================================= */}

        <Divider
          borderColor="whiteAlpha.200"
          mb={8}
        />


        <VStack
          textAlign="center"
          gap={2}
          pb={5}
        >

          <Text
            color="blue.400"
            fontWeight="900"
            fontSize="lg"
          >
            Fresh • Delicious • Made With Love
          </Text>


          <Text
            color="gray.500"
            fontSize="sm"
          >
            All prices are displayed in Indian Rupees (₹)
          </Text>

        </VStack>

      </Container>

    </Box>

  );
}