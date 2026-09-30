import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  Badge,
  Box,
  Button,
  Dialog,
  Flex,
  Grid,
  Input,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";
import {
  FaBowlFood,
  FaCakeCandles,
  FaChartSimple,
  FaGlassWater,
  FaBurger,
  FaLeaf,
  FaMagnifyingGlass,
  FaPen,
  FaPizzaSlice,
  FaPlus,
  FaTrashCan,
  FaUtensils,
} from "react-icons/fa6";
import { deleteToaster, saveToaster, updateToaster } from "../components/ui/toaster";

const MotionDiv = motion.div;

const API = axios.create({ baseURL: "http://localhost:8081" });

const emptyForm = {
  name: "",
  description: "",
  image: "",
  price: "",
  quantity: "",
  foodType: "VEG",
  categoryId: "",
  discountType: "",
  discountValue: "",
  available: true,
};

const defaultCategories = [
  { id: 1, name: "Pizza" },
  { id: 2, name: "Burger" },
  { id: 3, name: "Pasta" },
  { id: 4, name: "Drinks" },
  { id: 5, name: "Desserts" },
  { id: 6, name: "Starters" },
  { id: 7, name: "Main Course" },
  { id: 8, name: "Salads" },
];

const getCategoryEmoji = (categoryName) => {
  const name = categoryName?.toLowerCase() || "";
  if (name.includes("pizza")) return "🍕";
  if (name.includes("burger")) return "🍔";
  if (name.includes("pasta")) return "🍝";
  if (name.includes("drink") || name.includes("beverage")) return "🥤";
  if (name.includes("dessert") || name.includes("cake")) return "🍰";
  if (name.includes("starter") || name.includes("appetizer")) return "🍽";
  if (name.includes("main") || name.includes("course")) return "🍛";
  if (name.includes("salad")) return "🥗";
  return "🍽️";
};

const NativeSelect = ({ value, onChange, name, children, style, ...rest }) => (
  <select
    name={name}
    value={value}
    onChange={onChange}
    style={{
      width: "100%",
      height: "40px",
      borderRadius: "12px",
      border: "1px solid #E2E8F0",
      background: "white",
      color: "#1A202C",
      paddingLeft: "16px",
      paddingRight: "16px",
      fontSize: "14px",
      outline: "none",
      cursor: "pointer",
      ...style,
    }}
    {...rest}
  >
    {children}
  </select>
);

const SectionLabel = ({ children }) => (
  <Text
    fontSize="xs"
    fontWeight="700"
    letterSpacing="0.1em"
    textTransform="uppercase"
    color="blue.500"
    mb={3}
    mt={1}
  >
    {children}
  </Text>
);

const Addfooditem = () => {
  // ── All state (unchanged) ──
  const [data, setData] = useState([]);
  const [categories, setCategories] = useState(defaultCategories);
  const [id, setId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [foodTypeFilter, setFoodTypeFilter] = useState("all");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt-desc");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [imageLoadError, setImageLoadError] = useState(false);

  // ── All functions (unchanged) ──
  const getData = async () => {
    try {
      const foodResponse = await API.get("/fooditems/getdata");
      const nextFoodItems = Array.isArray(foodResponse.data) ? foodResponse.data : [];
      setData(nextFoodItems);
    } catch (error) {
      saveToaster.create({
        title: "Unable to load food items",
        description: "Please check the backend server and reload the page.",
        type: "error",
      });
      setData([]);
    }
  };

  const getCategories = async () => {
    try {
      const categoryResponse = await API.get("/categories");
      const nextCategories = Array.isArray(categoryResponse.data) ? categoryResponse.data : defaultCategories;
      setCategories(nextCategories);
    } catch (error) {
      console.error("Failed to load categories, using defaults:", error);
      setCategories(defaultCategories);
    }
  };

  const getCategoryId = (item) => item.category?.id ?? item.categoryId ?? null;

  const getCategoryName = (item) => {
    const categoryId = getCategoryId(item);
    const category = categories.find((cat) => String(cat.id) === String(categoryId));
    return category?.name || "-";
  };

  useEffect(() => {
    getData();
    getCategories();
  }, []);

  const stats = useMemo(() => ({
    total: data.length,
    available: data.filter((item) => item.available).length,
    veg: data.filter((item) => item.foodType === "VEG").length,
    discount: data.filter((item) => Boolean(item.discountType)).length,
  }), [data]);

  const filteredData = useMemo(() => {
    let items = [...data];
    if (searchTerm.trim()) {
      const query = searchTerm.trim().toLowerCase();
      items = items.filter(
        (item) =>
          item.name?.toLowerCase().includes(query) ||
          item.description?.toLowerCase().includes(query)
      );
    }
    if (categoryFilter !== "all") {
      items = items.filter((item) => String(getCategoryId(item)) === String(categoryFilter));
    }
    if (foodTypeFilter !== "all") {
      items = items.filter((item) => item.foodType === foodTypeFilter);
    }
    if (availabilityFilter !== "all") {
      items = items.filter((item) =>
        availabilityFilter === "available" ? item.available : !item.available
      );
    }
    items.sort((a, b) => {
      switch (sortBy) {
        case "name-asc": return (a.name || "").localeCompare(b.name || "");
        case "name-desc": return (b.name || "").localeCompare(a.name || "");
        case "price-asc": return Number(a.price) - Number(b.price);
        case "price-desc": return Number(b.price) - Number(a.price);
        case "createdAt-desc": return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        default: return 0;
      }
    });
    return items;
  }, [data, searchTerm, categoryFilter, foodTypeFilter, availabilityFilter, sortBy]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    if (name === "image") setImageLoadError(false);
  };

  const resetForm = () => {
    setForm({ ...emptyForm });
    setId(null);
    setImageLoadError(false);
  };

  const validateForm = () => {
    if (!form.name?.trim()) return "Food name is required.";
    if (!form.description?.trim()) return "Description is required.";
    if (!form.image?.trim()) return "Image URL is required.";
    if (!form.categoryId) return "Please select a category.";
    const categoryExists = categories.some((cat) => String(cat.id) === String(form.categoryId));
    if (!categoryExists) return "Please select a valid category.";
    if (!form.foodType) return "Please select VEG or NON_VEG.";
    const price = Number(form.price);
    if (!Number.isFinite(price) || price <= 0) return "Price must be greater than 0.";
    const quantity = Number(form.quantity);
    if (!Number.isFinite(quantity) || quantity < 0) return "Quantity cannot be negative.";
    if (form.discountType) {
      const discountValue = Number(form.discountValue || 0);
      if (!Number.isFinite(discountValue) || discountValue < 0) return "Discount value cannot be negative.";
      if (form.discountType === "PERCENTAGE" && discountValue > 100) return "Percentage discount cannot be greater than 100.";
      if (form.discountType === "FIXED_AMOUNT" && discountValue > price) return "Fixed discount cannot exceed the item price.";
    }
    return null;
  };

  const onsubmit = async () => {
    const validationMessage = validateForm();
    if (validationMessage) {
      saveToaster.create({ title: "Validation failed", description: validationMessage, type: "error" });
      return;
    }
    setLoading(true);
    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      image: form.image.trim(),
      price: Number(form.price),
      quantity: Number(form.quantity),
      foodType: form.foodType,
      categoryId: Number(form.categoryId),
      available: form.available,
      ...(form.discountType ? {
        discountType: form.discountType,
        discountValue: form.discountValue === "" ? 0 : Number(form.discountValue),
      } : {}),
    };
    try {
      if (id === null) {
        await API.post("/fooditems/create", payload);
        saveToaster.create({ description: "Food item created successfully", type: "success", duration: 1500 });
      } else {
        await API.put(`/fooditems/update/${id}`, payload);
        updateToaster.create({ description: "Food item updated successfully", type: "success", duration: 1500 });
      }
      resetForm();
      await getData();
    } catch (error) {
      saveToaster.create({
        title: "Food item save failed",
        description: error.response?.data?.message || "Please verify the API payload and try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const del = async (foodId) => {
    try {
      await API.delete(`/fooditems/delete/${foodId}`);
      setDeleteTarget(null);
      await getData();
      deleteToaster.create({ description: "Food item deleted successfully", type: "success", duration: 1500 });
    } catch (error) {
      saveToaster.create({
        title: "Delete failed",
        description: error.response?.data?.message || "Unable to delete this food item.",
        type: "error",
      });
    }
  };

  const edit = (item) => {
    setId(item.id);
    setForm({
      name: item.name || "",
      description: item.description || "",
      image: item.image || "",
      price: item.price ?? "",
      quantity: item.quantity ?? "",
      foodType: item.foodType || "VEG",
      categoryId: getCategoryId(item) != null ? String(getCategoryId(item)) : "",
      discountType: item.discountType || "",
      discountValue: item.discountValue ?? "",
      available: item.available ?? true,
    });
    setImageLoadError(false);
  };

  const formatPrice = (value) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(Number(value || 0));

  const renderDiscount = (item) => {
    if (!item.discountType) return <Text fontSize="sm" color="gray.400">—</Text>;
    if (item.discountType === "PERCENTAGE") return <Badge colorPalette="orange" borderRadius="full" px={2} py={1} fontSize="xs">{item.discountValue}% off</Badge>;
    return <Badge colorPalette="purple" borderRadius="full" px={2} py={1} fontSize="xs">{formatPrice(item.discountValue)} off</Badge>;
  };

  const statCards = [
    { label: "Total Items", value: stats.total, icon: <FaBowlFood />, color: "#2563eb", bg: "#eff6ff", borderColor: "#bfdbfe" },
    { label: "Available", value: stats.available, icon: <FaChartSimple />, color: "#16a34a", bg: "#f0fdf4", borderColor: "#bbf7d0" },
    { label: "Veg Items", value: stats.veg, icon: <FaLeaf />, color: "#0891b2", bg: "#ecfeff", borderColor: "#a5f3fc" },
    { label: "On Discount", value: stats.discount, icon: <FaCakeCandles />, color: "#ea580c", bg: "#fff7ed", borderColor: "#fed7aa" },
  ];

  return (
    <Box minH="100vh" bg="gray.50" py={{ base: 5, md: 8, lg: 10 }}>
      <Box w="100%" maxW="1400px" mx="auto" px={{ base: 3, sm: 4, md: 6, lg: 8 }}>

        {/* ── Page entrance animation wrapper ── */}
        <MotionDiv initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

          {/* ── Page Header ── */}
          <Box mb={{ base: 6, md: 8 }}>
            <Flex align="center" gap={3} mb={2}>
              <Box
                bg="blue.500"
                color="white"
                borderRadius="xl"
                p={{ base: 2, md: 3 }}
                fontSize={{ base: "lg", md: "xl" }}
                display="flex"
                alignItems="center"
                justifyContent="center"
                flexShrink={0}
              >
                <FaBowlFood />
              </Box>
              <Box>
                <Text
                  fontSize="xs"
                  fontWeight="700"
                  letterSpacing="0.16em"
                  color="blue.500"
                  textTransform="uppercase"
                  mb={0.5}
                >
                  Restaurant admin
                </Text>
                <Text fontSize={{ base: "xl", sm: "2xl", md: "3xl" }} fontWeight="800" color="gray.800" lineHeight="1.2">
                  Food Menu
                </Text>
              </Box>
            </Flex>
            <Text fontSize={{ base: "sm", md: "md" }} color="gray.500" pl={{ base: 0, sm: "52px" }}>
              Create, update, and manage your restaurant menu items.
            </Text>
          </Box>

          {/* ── Stats cards ── */}
          <Grid
            templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)", xl: "repeat(4, 1fr)" }}
            gap={{ base: 3, md: 4 }}
            mb={{ base: 6, md: 8 }}
          >
            {statCards.map((stat, index) => (
              <MotionDiv
                key={stat.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08, duration: 0.35 }}
              >
                <Box
                  bg="white"
                  borderRadius="2xl"
                  border="1px solid"
                  borderColor="gray.200"
                  borderLeft="4px solid"
                  borderLeftColor={stat.borderColor}
                  boxShadow="sm"
                  p={{ base: 4, md: 5 }}
                  transition="all 0.2s"
                  _hover={{ boxShadow: "md", transform: "translateY(-1px)" }}
                >
                  <Flex justify="space-between" align="center" mb={3}>
                    <Text fontSize="sm" color="gray.500" fontWeight="600">{stat.label}</Text>
                    <Box bg={stat.bg} color={stat.color} borderRadius="lg" p={2} fontSize="lg" display="flex" alignItems="center" justifyContent="center" flexShrink={0}>
                      {stat.icon}
                    </Box>
                  </Flex>
                  <Text fontSize={{ base: "2xl", md: "3xl" }} fontWeight="800" color="gray.800">{stat.value}</Text>
                </Box>
              </MotionDiv>
            ))}
          </Grid>

          {/* ── Form Card (full-width, centered, maxW) ── */}
          <MotionDiv initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.4 }}>
            <Box
              w="100%"
              maxW="900px"
              mx="auto"
              bg="white"
              borderRadius="2xl"
              boxShadow="sm"
              border="1px solid"
              borderColor="gray.200"
              p={{ base: 4, sm: 5, md: 7 }}
              mb={{ base: 6, md: 8 }}
            >
              {/* Form card header */}
              <Flex align="center" gap={3} mb={2}>
                <Box bg="blue.50" color="blue.500" borderRadius="xl" p={2.5} fontSize="xl" display="flex" alignItems="center" justifyContent="center" flexShrink={0}>
                  <FaBowlFood />
                </Box>
                <Box>
                  <Text fontSize={{ base: "md", md: "lg" }} fontWeight="700" color="gray.800">
                    {id === null ? "Add New Food Item" : "Update Food Item"}
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    {id === null ? "Fill in the details to add a new menu item." : "Edit the details and save changes."}
                  </Text>
                </Box>
              </Flex>

              {/* Accent line */}
              <Box h="2px" bg="blue.100" borderRadius="full" mb={6} mt={3} />

              {/* Image preview */}
              <Box mb={5} borderRadius="2xl" border="1px solid" borderColor="gray.200" bg="gray.50" overflow="hidden">
                {form.image && !imageLoadError ? (
                  <Box as="img" src={form.image} alt={form.name || "Food preview"} onError={() => setImageLoadError(true)}
                    style={{ width: "100%", objectFit: "cover", display: "block" }}
                    h={{ base: "160px", sm: "180px", md: "220px" }}
                  />
                ) : (
                  <Box h={{ base: "160px", sm: "180px", md: "220px" }} display="flex" alignItems="center" justifyContent="center" bg="gray.50">
                    <Stack align="center" gap={2}>
                      <Box bg="blue.50" color="blue.300" borderRadius="full" p={4} fontSize="2xl" display="flex" alignItems="center" justifyContent="center">
                        <FaBowlFood />
                      </Box>
                      <Text fontWeight="600" color="gray.600" fontSize="sm">Food image preview</Text>
                      <Text fontSize="xs" color="gray.400" textAlign="center" px={4}>
                        {form.image ? "Image is unavailable" : "Paste an image URL above to see a preview"}
                      </Text>
                    </Stack>
                  </Box>
                )}
              </Box>

              <Stack gap={6}>
                {/* Basic Information */}
                <Box>
                  <SectionLabel>Basic Information</SectionLabel>
                  <Box h="1px" bg="gray.100" mb={4} />
                  <Stack gap={4}>
                    <Box>
                      <Text fontSize="sm" fontWeight="600" color="gray.700" mb={2}>Food Name</Text>
                      <Input name="name" value={form.name} onChange={handleChange} placeholder="e.g. Margherita Pizza" borderRadius="xl" borderColor="gray.200" />
                    </Box>
                    <Box>
                      <Text fontSize="sm" fontWeight="600" color="gray.700" mb={2}>Description</Text>
                      <Textarea name="description" value={form.description} onChange={handleChange} placeholder="Describe the food item, ingredients, or special notes" minH="100px" borderRadius="xl" borderColor="gray.200" />
                    </Box>
                    <Box>
                      <Text fontSize="sm" fontWeight="600" color="gray.700" mb={2}>Image URL</Text>
                      <Input name="image" value={form.image} onChange={handleChange} placeholder="https://example.com/image.jpg" borderRadius="xl" borderColor="gray.200" />
                    </Box>
                  </Stack>
                </Box>

                {/* Pricing & Inventory */}
                <Box>
                  <SectionLabel>Pricing &amp; Inventory</SectionLabel>
                  <Box h="1px" bg="gray.100" mb={4} />
                  <Grid templateColumns={{ base: "1fr", sm: "1fr 1fr" }} gap={4}>
                    <Box>
                      <Text fontSize="sm" fontWeight="600" color="gray.700" mb={2}>Price (₹)</Text>
                      <Input name="price" value={form.price} onChange={handleChange} type="number" placeholder="299" borderRadius="xl" borderColor="gray.200" />
                    </Box>
                    <Box>
                      <Text fontSize="sm" fontWeight="600" color="gray.700" mb={2}>Quantity</Text>
                      <Input name="quantity" value={form.quantity} onChange={handleChange} type="number" placeholder="0" borderRadius="xl" borderColor="gray.200" />
                    </Box>
                  </Grid>
                </Box>

                {/* Category & Type */}
                <Box>
                  <SectionLabel>Category &amp; Type</SectionLabel>
                  <Box h="1px" bg="gray.100" mb={4} />
                  <Grid templateColumns={{ base: "1fr", sm: "1fr 1fr" }} gap={4}>
                    <Box>
                      <Text fontSize="sm" fontWeight="600" color="gray.700" mb={2}>Category</Text>
                      <NativeSelect name="categoryId" value={form.categoryId} onChange={handleChange}>
                        <option value="">Select category</option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>{getCategoryEmoji(cat.name)} {cat.name}</option>
                        ))}
                      </NativeSelect>
                    </Box>
                    <Box>
                      <Text fontSize="sm" fontWeight="600" color="gray.700" mb={2}>Food Type</Text>
                      <NativeSelect name="foodType" value={form.foodType} onChange={handleChange}>
                        <option value="VEG">🟢 VEG</option>
                        <option value="NON_VEG">🔴 NON_VEG</option>
                      </NativeSelect>
                    </Box>
                  </Grid>
                </Box>

                {/* Discount */}
                <Box>
                  <SectionLabel>Discount</SectionLabel>
                  <Box h="1px" bg="gray.100" mb={4} />
                  <Grid templateColumns={{ base: "1fr", sm: "1fr 1fr" }} gap={4}>
                    <Box>
                      <Text fontSize="sm" fontWeight="600" color="gray.700" mb={2}>Discount Type</Text>
                      <NativeSelect name="discountType" value={form.discountType} onChange={handleChange}>
                        <option value="">No discount</option>
                        <option value="PERCENTAGE">Percentage (%)</option>
                        <option value="FIXED_AMOUNT">Fixed Amount (₹)</option>
                      </NativeSelect>
                    </Box>
                    {form.discountType && (
                      <Box>
                        <Text fontSize="sm" fontWeight="600" color="gray.700" mb={2}>Discount Value</Text>
                        <Input name="discountValue" value={form.discountValue} onChange={handleChange} type="number" placeholder="10" borderRadius="xl" borderColor="gray.200" />
                      </Box>
                    )}
                  </Grid>
                </Box>

                {/* Availability */}
                <Box>
                  <SectionLabel>Availability</SectionLabel>
                  <Box h="1px" bg="gray.100" mb={4} />
                  <Flex align="center" justify="space-between" bg="gray.50" border="1px solid" borderColor="gray.200" borderRadius="xl" p={4}>
                    <Box>
                      <Text fontSize="sm" fontWeight="700" color="gray.800">Available to customers</Text>
                      <Text fontSize="xs" color="gray.500">Toggle off to hide this item from the menu</Text>
                    </Box>
                    <Box as="label" display="flex" alignItems="center" gap={2} fontSize="sm" color="gray.700" cursor="pointer">
                      <input type="checkbox" name="available" checked={form.available} onChange={handleChange} />
                      <span>{form.available ? "Yes" : "No"}</span>
                    </Box>
                  </Flex>
                </Box>
              </Stack>

              {/* Form actions */}
              <Box h="1px" bg="gray.100" mt={6} mb={5} />
              <Flex justify={{ base: "stretch", sm: "flex-end" }} gap={3} direction={{ base: "column", sm: "row" }}>
                <Button variant="outline" borderRadius="xl" onClick={resetForm} w={{ base: "100%", sm: "auto" }}>
                  Reset
                </Button>
                <Button colorPalette="blue" borderRadius="xl" onClick={onsubmit} loading={loading} w={{ base: "100%", sm: "auto" }}>
                  {id === null ? "Save Food Item" : "Update Food Item"}
                </Button>
              </Flex>
            </Box>
          </MotionDiv>

          {/* ── Items Panel (full-width below form) ── */}
          <MotionDiv initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.4 }}>
            <Box w="100%" bg="white" borderRadius="2xl" boxShadow="sm" border="1px solid" borderColor="gray.200" p={{ base: 4, md: 6 }}>

              {/* Panel header */}
              <Flex align="center" gap={3} mb={2}>
                <Box bg="blue.50" color="blue.500" borderRadius="xl" p={2.5} fontSize="xl" display="flex" alignItems="center" justifyContent="center" flexShrink={0}>
                  <FaUtensils />
                </Box>
                <Box flex="1" minW={0}>
                  <Text fontSize={{ base: "md", md: "lg" }} fontWeight="700" color="gray.800">Food Items</Text>
                  <Text fontSize="sm" color="gray.500">
                    Showing {filteredData.length} of {data.length} item{data.length === 1 ? "" : "s"}
                  </Text>
                </Box>
                <Box width={{ base: "140px", md: "200px" }} flexShrink={0}>
                  <NativeSelect value={sortBy} onChange={(event) => setSortBy(event.target.value)} style={{ width: "100%" }}>
                    <option value="createdAt-desc">Newest first</option>
                    <option value="name-asc">Name A–Z</option>
                    <option value="name-desc">Name Z–A</option>
                    <option value="price-asc">Price low–high</option>
                    <option value="price-desc">Price high–low</option>
                  </NativeSelect>
                </Box>
              </Flex>

              <Box h="2px" bg="gray.100" borderRadius="full" mb={5} mt={3} />

              {/* Category filter pills */}
              <Box bg="gray.50" border="1px solid" borderColor="gray.200" borderRadius="xl" p={3} mb={4}>
                <Text fontSize="xs" fontWeight="700" color="gray.500" mb={2} textTransform="uppercase" letterSpacing="0.08em">Filter by Category</Text>
                <Flex gap={1.5} overflowX="auto" pb={1} mx={-1} px={1} css={{ scrollbarWidth: "none", "&::-webkit-scrollbar": { display: "none" } }}>
                  <Button onClick={() => setCategoryFilter("all")} borderRadius="full" whiteSpace="nowrap" flexShrink={0} size="xs" fontSize="xs" variant={categoryFilter === "all" ? "solid" : "outline"} colorPalette={categoryFilter === "all" ? "blue" : "gray"}>
                    All
                  </Button>
                  {categories.map((cat) => {
                    const active = String(categoryFilter) === String(cat.id);
                    return (
                      <Button key={cat.id} onClick={() => setCategoryFilter(String(cat.id))} borderRadius="full" whiteSpace="nowrap" flexShrink={0} size="xs" fontSize="xs" variant={active ? "solid" : "outline"} colorPalette={active ? "blue" : "gray"}>
                        {getCategoryEmoji(cat.name)} {cat.name}
                      </Button>
                    );
                  })}
                </Flex>
              </Box>

              {/* Search + filters */}
              <Grid templateColumns={{ base: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" }} gap={3} mb={5}>
                <Box position="relative">
                  <Box as="span" position="absolute" left={3} top="50%" transform="translateY(-50%)" color="gray.400" zIndex={1} fontSize="14px" display="flex" alignItems="center">
                    <FaMagnifyingGlass />
                  </Box>
                  <Input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search food items..." borderRadius="xl" borderColor="gray.200" bg="white" pl={9} />
                </Box>
                <NativeSelect value={foodTypeFilter} onChange={(event) => setFoodTypeFilter(event.target.value)}>
                  <option value="all">All food types</option>
                  <option value="VEG">🟢 Veg</option>
                  <option value="NON_VEG">🔴 Non-Veg</option>
                </NativeSelect>
                <NativeSelect value={availabilityFilter} onChange={(event) => setAvailabilityFilter(event.target.value)}>
                  <option value="all">All availability</option>
                  <option value="available">Available</option>
                  <option value="unavailable">Unavailable</option>
                </NativeSelect>
              </Grid>

              {/* Empty state */}
              {filteredData.length === 0 ? (
                <Box border="1px dashed" borderColor="gray.200" borderRadius="xl" p={{ base: 8, md: 12 }} textAlign="center" bg="gray.50">
                  <Box display="inline-flex" bg="gray.100" borderRadius="full" p={4} mb={3} fontSize="2xl" color="gray.400"><FaBowlFood /></Box>
                  <Text fontWeight="700" color="gray.700" fontSize="lg">No food items found</Text>
                  <Text fontSize="sm" color="gray.500" mt={1}>Try adjusting your search or filters.</Text>
                </Box>
              ) : (
                <>
                  {/* Desktop table (lg+) */}
                  <Box display={{ base: "none", lg: "block" }} overflowX="auto" borderRadius="xl" border="1px solid" borderColor="gray.100">
                    <Box as="table" width="100%" minW="980px" borderCollapse="collapse" style={{ borderSpacing: 0 }}>
                      <Box as="thead">
                        <Box as="tr" bg="gray.50">
                          {["Image","Food","Category","Price","Type","Stock","Discount","Available","Actions"].map((header) => (
                            <Box as="th" key={header} textAlign={header === "Actions" ? "center" : "left"} p={3} borderBottom="2px solid" borderColor="gray.200" fontSize="xs" fontWeight="700" letterSpacing="0.08em" textTransform="uppercase" color="gray.500" whiteSpace="nowrap">
                              {header}
                            </Box>
                          ))}
                        </Box>
                      </Box>
                      <Box as="tbody">
                        {filteredData.map((item, index) => (
                          <MotionDiv key={item.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: Math.min(index * 0.03, 0.3), duration: 0.25 }} style={{ display: "contents" }}>
                            <Box as="tr" _hover={{ bg: "blue.50" }} transition="background 0.15s">
                              <Box as="td" p={3} borderBottom="1px solid" borderColor="gray.100">
                                {item.image ? (
                                  <Box as="img" src={item.image} alt={item.name} style={{ width: "52px", height: "52px", objectFit: "cover", borderRadius: "10px" }} />
                                ) : (
                                  <Box width="52px" height="52px" borderRadius="lg" bg="gray.100" display="flex" alignItems="center" justifyContent="center" color="gray.400" fontSize="xl"><FaBowlFood /></Box>
                                )}
                              </Box>
                              <Box as="td" p={3} borderBottom="1px solid" borderColor="gray.100">
                                <Text fontWeight="700" color="gray.800" fontSize="sm">{item.name}</Text>
                              </Box>
                              <Box as="td" p={3} borderBottom="1px solid" borderColor="gray.100">
                                <Badge colorPalette="blue" borderRadius="full" px={2} py={1} fontSize="xs">{getCategoryEmoji(getCategoryName(item))} {getCategoryName(item)}</Badge>
                              </Box>
                              <Box as="td" p={3} borderBottom="1px solid" borderColor="gray.100">
                                <Text fontWeight="700" color="gray.800" fontSize="sm" whiteSpace="nowrap">{formatPrice(item.price)}</Text>
                              </Box>
                              <Box as="td" p={3} borderBottom="1px solid" borderColor="gray.100">
                                <Badge colorPalette={item.foodType === "VEG" ? "green" : "red"} borderRadius="full" px={2} py={1} fontSize="xs">{item.foodType === "VEG" ? "🟢 VEG" : "🔴 NON-VEG"}</Badge>
                              </Box>
                              <Box as="td" p={3} borderBottom="1px solid" borderColor="gray.100">
                                <Text color="gray.700" fontSize="sm">{item.quantity}</Text>
                              </Box>
                              <Box as="td" p={3} borderBottom="1px solid" borderColor="gray.100">{renderDiscount(item)}</Box>
                              <Box as="td" p={3} borderBottom="1px solid" borderColor="gray.100">
                                <Badge colorPalette={item.available ? "green" : "gray"} borderRadius="full" px={2} py={1} fontSize="xs">{item.available ? "Available" : "Unavailable"}</Badge>
                              </Box>
                              <Box as="td" p={3} borderBottom="1px solid" borderColor="gray.100" textAlign="center">
                                <Flex justify="center" gap={2} wrap="wrap">
                                  <Button size="sm" colorPalette="green" variant="outline" borderRadius="lg" onClick={() => edit(item)}><FaPen />Edit</Button>
                                  <Button size="sm" colorPalette="red" borderRadius="lg" onClick={() => setDeleteTarget(item)}><FaTrashCan />Delete</Button>
                                </Flex>
                              </Box>
                            </Box>
                          </MotionDiv>
                        ))}
                      </Box>
                    </Box>
                  </Box>

                  {/* Mobile cards (base → md) */}
                  <Stack display={{ base: "flex", lg: "none" }} gap={3}>
                    {filteredData.map((item, index) => (
                      <MotionDiv key={item.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(index * 0.04, 0.3), duration: 0.25 }}>
                        <Box border="1px solid" borderColor="gray.200" borderRadius="xl" p={4} bg="white" _hover={{ bg: "blue.50" }} transition="background 0.15s">
                          <Flex gap={3} mb={3} align="flex-start">
                            <Box flexShrink={0}>
                              {item.image ? (
                                <Box as="img" src={item.image} alt={item.name} style={{ width: "56px", height: "56px", objectFit: "cover", borderRadius: "10px" }} />
                              ) : (
                                <Box width="56px" height="56px" borderRadius="lg" bg="gray.100" display="flex" alignItems="center" justifyContent="center" color="gray.400" fontSize="xl"><FaBowlFood /></Box>
                              )}
                            </Box>
                            <Box flex="1" minW={0}>
                              <Text fontWeight="700" color="gray.800" fontSize="sm" isTruncated>{item.name}</Text>
                              <Flex gap={1.5} mt={1} flexWrap="wrap">
                                <Badge colorPalette="blue" borderRadius="full" px={2} py="1px" fontSize="xs">{getCategoryEmoji(getCategoryName(item))} {getCategoryName(item)}</Badge>
                              </Flex>
                              <Text fontWeight="700" color="gray.800" fontSize="sm" mt={1}>{formatPrice(item.price)}</Text>
                            </Box>
                            <Box flexShrink={0} textAlign="right">
                              <Badge colorPalette={item.foodType === "VEG" ? "green" : "red"} borderRadius="full" px={2} py="1px" fontSize="xs" display="block" mb={1}>{item.foodType === "VEG" ? "VEG" : "NON-VEG"}</Badge>
                              <Badge colorPalette={item.available ? "green" : "gray"} borderRadius="full" px={2} py="1px" fontSize="xs" display="block">{item.available ? "Available" : "Unavailable"}</Badge>
                            </Box>
                          </Flex>
                          <Flex justify="space-between" align="center" gap={2}>
                            <Flex align="center" gap={2} flexWrap="wrap">
                              <Text fontSize="xs" color="gray.500">Stock: {item.quantity}</Text>
                              {renderDiscount(item)}
                            </Flex>
                            <Flex gap={2} flexShrink={0}>
                              <Button size="sm" colorPalette="green" variant="outline" borderRadius="lg" onClick={() => edit(item)}><FaPen />Edit</Button>
                              <Button size="sm" colorPalette="red" borderRadius="lg" onClick={() => setDeleteTarget(item)}><FaTrashCan />Delete</Button>
                            </Flex>
                          </Flex>
                        </Box>
                      </MotionDiv>
                    ))}
                  </Stack>
                </>
              )}
            </Box>
          </MotionDiv>

        </MotionDiv>
      </Box>

      {/* Delete confirmation dialog */}
      <Dialog.Root open={Boolean(deleteTarget)} onOpenChange={(details) => { if (!details.open) setDeleteTarget(null); }}>
        <Dialog.Positioner>
          <Dialog.Content maxW={{ base: "calc(100vw - 32px)", md: "md" }} borderRadius="2xl" p={0}>
            <Box p={6}>
              <Flex justify="center" mb={4}>
                <Box bg="red.50" color="red.500" borderRadius="full" p={4} fontSize="2xl"><FaTrashCan /></Box>
              </Flex>
              <Text textAlign="center" fontSize={{ base: "xl", md: "2xl" }} fontWeight="800" color="gray.800">Delete Food Item?</Text>
              <Text textAlign="center" color="gray.600" mt={3} fontSize="sm">
                Are you sure you want to delete <strong>{deleteTarget?.name || "this food item"}</strong>?
              </Text>
              <Text textAlign="center" color="gray.400" mt={2} fontSize="sm">This action cannot be undone.</Text>
            </Box>
            <Dialog.Footer justifyContent="flex-end" gap={3} px={6} pb={6}>
              <Button variant="outline" borderRadius="xl" onClick={() => setDeleteTarget(null)}>Cancel</Button>
              <Button colorPalette="red" borderRadius="xl" onClick={() => del(deleteTarget?.id)}><FaTrashCan />Delete</Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>
    </Box>
  );
};

export default Addfooditem;
