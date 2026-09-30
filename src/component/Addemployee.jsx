import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  Badge,
  Box,
  Button,
  Flex,
  Grid,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";
import {
  FiBriefcase,
  FiDollarSign,
  FiEdit2,
  FiPlus,
  FiTrash2,
  FiUser,
  FiUsers,
} from "react-icons/fi";
import { deleteToaster, saveToaster, updateToaster } from "../components/ui/toaster";

const MotionDiv = motion.div;

const API = axios.create({ baseURL: "http://localhost:8081" });

const emptyForm = { name: "", designation: "", salary: "" };

const getInitials = (name = "") =>
  name.trim().split(" ").filter(Boolean).slice(0,2).map((w) => w[0].toUpperCase()).join("");

const avatarColors = [
  { bg:"#dbeafe", color:"#1d4ed8" },
  { bg:"#dcfce7", color:"#15803d" },
  { bg:"#fae8ff", color:"#a21caf" },
  { bg:"#ffedd5", color:"#c2410c" },
  { bg:"#fef9c3", color:"#854d0e" },
  { bg:"#e0f2fe", color:"#0369a1" },
];

const getAvatarColor = (name = "") => {
  const sum = name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return avatarColors[sum % avatarColors.length];
};

const formatSalary = (value) =>
  new Intl.NumberFormat("en-IN", { style:"currency", currency:"INR", maximumFractionDigits:0 }).format(Number(value) || 0);

const Addemployee = () => {
  const [data, setData] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [id, setId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const nameInputRef = useRef(null);

  const getData = async () => {
    try {
      const response = await API.get("/employeestaff/getdata");
      setData(response.data || []);
    } catch (error) {
      saveToaster.create({ title:"Unable to load employees", description:"Please check the backend server and try again.", type:"error" });
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => { getData(); }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => { setForm(emptyForm); setId(null); };

  const scrollToForm = () => {
    nameInputRef.current?.scrollIntoView({ behavior:"smooth", block:"center" });
    nameInputRef.current?.focus();
  };

  const onsubmit = async () => {
    if (!form.name || !form.designation || !form.salary) {
      saveToaster.create({ title:"Missing employee details", description:"Please fill in all fields before saving.", type:"error" });
      return;
    }
    setLoading(true);
    const payload = { ...form, salary: String(form.salary) };
    try {
      if (id === null) {
        await API.post("/employeestaff/create", payload);
        saveToaster.create({ description:"Employee saved successfully", type:"success", duration:1500 });
      } else {
        await API.put(`/employeestaff/update/${id}`, payload);
        updateToaster.create({ description:"Employee updated successfully", type:"success", duration:1500 });
      }
      resetForm();
      await getData();
    } catch (error) {
      saveToaster.create({ title:"Employee save failed", description: error.response?.data?.message || "Please verify the employee details and try again.", type:"error" });
    } finally {
      setLoading(false);
    }
  };

  const del = async (employeeId) => {
    try {
      await API.delete(`/employeestaff/delete/${employeeId}`);
      await getData();
      deleteToaster.create({ description:"Employee deleted successfully", type:"success", duration:1500 });
    } catch (error) {
      saveToaster.create({ title:"Delete failed", description: error.response?.data?.message || "Unable to delete this employee.", type:"error" });
    }
  };

  const edit = (item) => {
    setId(item.id);
    setForm({ name: item.name||"", designation: item.designation||"", salary: item.salary||"" });
    scrollToForm();
  };

  return (
    <Box minH="100vh" bg="gray.50" py={{ base:5, md:8, lg:10 }}>
      <Box w="100%" maxW="1400px" mx="auto" px={{ base:3, sm:4, md:6, lg:8 }}>

        <MotionDiv initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.4 }}>

          {/* Page Header */}
          <Box mb={{ base:6, md:8 }}>
            <Flex align="center" gap={3} mb={2}>
              <Box bg="green.500" color="white" borderRadius="xl" p={{ base:2, md:3 }} fontSize={{ base:"lg", md:"xl" }} display="flex" alignItems="center" justifyContent="center" flexShrink={0}>
                <FiUsers />
              </Box>
              <Box flex="1" minW={0}>
                <Text fontSize="xs" fontWeight="700" letterSpacing="0.16em" color="green.500" textTransform="uppercase" mb={0.5}>Staff management</Text>
                <Text fontSize={{ base:"xl", sm:"2xl", md:"3xl" }} fontWeight="800" color="gray.800" lineHeight="1.2">Employees</Text>
              </Box>
              <Box display={{ base:"none", sm:"flex" }} bg="white" border="1px solid" borderColor="gray.200" borderRadius="xl" px={4} py={2} alignItems="center" flexShrink={0}>
                <Flex align="center" gap={2}>
                  <Box color="green.500" fontSize="16px"><FiUsers /></Box>
                  <Text fontWeight="700" color="gray.800">{data.length}</Text>
                  <Text fontSize="sm" color="gray.500">staff</Text>
                </Flex>
              </Box>
              <Button colorPalette="green" borderRadius="xl" px={5} onClick={() => { resetForm(); scrollToForm(); }} display={{ base:"none", sm:"flex" }} flexShrink={0}>
                <FiPlus />Add Employee
              </Button>
            </Flex>
            <Flex align="center" gap={3} mt={1} pl={{ base:0, sm:"52px" }}>
              <Text fontSize={{ base:"sm", md:"md" }} color="gray.500">Add and manage restaurant staff members.</Text>
            </Flex>
            <Button colorPalette="green" borderRadius="xl" mt={3} w="100%" display={{ base:"flex", sm:"none" }} onClick={() => { resetForm(); scrollToForm(); }}>
              <FiPlus />Add Employee
            </Button>
          </Box>

          {/* Form card */}
          <MotionDiv initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.1, duration:0.4 }}>
            <Box w="100%" maxW="700px" mx="auto" bg="white" borderRadius="2xl" boxShadow="sm" border="1px solid" borderColor="gray.200" p={{ base:4, sm:5, md:7 }} mb={{ base:6, md:8 }}>

              <Flex align="center" gap={3} mb={2}>
                <Box bg="green.50" color="green.500" borderRadius="xl" p={2.5} fontSize="xl" display="flex" alignItems="center" justifyContent="center" flexShrink={0}><FiUsers /></Box>
                <Box>
                  <Text fontSize={{ base:"md", md:"lg" }} fontWeight="700" color="gray.800">{id === null ? "Add New Employee" : "Update Employee"}</Text>
                  <Text fontSize="sm" color="gray.500">{id === null ? "Fill in the details to add a new staff member." : "Edit the details and save changes."}</Text>
                </Box>
              </Flex>
              <Box h="2px" bg="green.100" borderRadius="full" mb={6} mt={3} />

              <Text fontSize="xs" fontWeight="700" letterSpacing="0.1em" textTransform="uppercase" color="green.500" mb={4}>Employee Information</Text>
              <Box h="1px" bg="gray.100" mb={5} />

              <Grid templateColumns={{ base:"1fr", sm:"1fr 1fr" }} gap={4} mb={4}>
                {/* Employee Name */}
                <Box>
                  <Text fontSize="sm" fontWeight="600" color="gray.700" mb={2}>Employee Name</Text>
                  <Box position="relative" width="100%">
                    <Box position="absolute" left={3} top="50%" transform="translateY(-50%)" color="gray.400" fontSize="16px" display="flex" alignItems="center" zIndex={1}><FiUser /></Box>
                    <Input ref={nameInputRef} name="name" value={form.name} onChange={handleChange} placeholder="e.g. Rajesh Kumar" borderRadius="xl" borderColor="gray.200" pl={10} width="100%" />
                  </Box>
                </Box>

                {/* Designation */}
                <Box>
                  <Text fontSize="sm" fontWeight="600" color="gray.700" mb={2}>Designation</Text>
                  <Box position="relative" width="100%">
                    <Box position="absolute" left={3} top="50%" transform="translateY(-50%)" color="gray.400" fontSize="16px" display="flex" alignItems="center" zIndex={1}><FiBriefcase /></Box>
                    <Input name="designation" value={form.designation} onChange={handleChange} placeholder="e.g. Head Chef" borderRadius="xl" borderColor="gray.200" pl={10} width="100%" />
                  </Box>
                </Box>
              </Grid>

              {/* Salary — full width */}
              <Box mb={4}>
                <Text fontSize="sm" fontWeight="600" color="gray.700" mb={2}>Salary (₹)</Text>
                <Box position="relative" width="100%">
                  <Box position="absolute" left={3} top="50%" transform="translateY(-50%)" color="gray.400" fontSize="16px" display="flex" alignItems="center" zIndex={1}><FiDollarSign /></Box>
                  <Input name="salary" value={form.salary} onChange={handleChange} placeholder="e.g. 25000" borderRadius="xl" borderColor="gray.200" pl={10} width="100%" />
                </Box>
              </Box>

              <Box h="1px" bg="gray.100" mt={6} mb={5} />
              <Flex justify={{ base:"stretch", sm:"flex-end" }} gap={3} direction={{ base:"column", sm:"row" }}>
                <Button variant="outline" borderRadius="xl" onClick={resetForm} w={{ base:"100%", sm:"auto" }}>Reset</Button>
                <Button colorPalette="green" borderRadius="xl" onClick={onsubmit} loading={loading} w={{ base:"100%", sm:"auto" }}>
                  {id === null ? "Save Employee" : "Update Employee"}
                </Button>
              </Flex>
            </Box>
          </MotionDiv>

          {/* Records panel */}
          <MotionDiv initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2, duration:0.4 }}>
            <Box w="100%" bg="white" borderRadius="2xl" boxShadow="sm" border="1px solid" borderColor="gray.200" p={{ base:4, md:6 }}>

              <Flex align="center" gap={3} mb={2}>
                <Box bg="green.50" color="green.500" borderRadius="xl" p={2.5} fontSize="xl" display="flex" alignItems="center" justifyContent="center" flexShrink={0}><FiUsers /></Box>
                <Box>
                  <Text fontSize={{ base:"md", md:"lg" }} fontWeight="700" color="gray.800">Employee Records</Text>
                  <Text fontSize="sm" color="gray.500">{data.length} staff member{data.length === 1 ? "" : "s"}</Text>
                </Box>
              </Flex>
              <Box h="2px" bg="gray.100" borderRadius="full" mb={5} mt={3} />

              {dataLoading ? (
                <Flex justify="center" align="center" py={16}>
                  <Stack align="center" gap={3}>
                    <Box width="40px" height="40px" border="3px solid" borderColor="gray.200" borderTopColor="green.500" borderRadius="full" style={{ animation:"spin 0.8s linear infinite" }} />
                    <Text color="gray.500" fontSize="sm">Loading employees...</Text>
                  </Stack>
                </Flex>
              ) : data.length === 0 ? (
                <Box border="1px dashed" borderColor="gray.200" borderRadius="xl" p={{ base:8, md:12 }} textAlign="center" bg="gray.50">
                  <Box display="inline-flex" bg="green.50" borderRadius="full" p={4} mb={3} fontSize="2xl" color="green.300"><FiUsers /></Box>
                  <Text fontWeight="700" color="gray.700" fontSize="lg">No employees found</Text>
                  <Text fontSize="sm" color="gray.500" mt={1} mb={5}>Add your first employee to get started.</Text>
                  <Button colorPalette="green" borderRadius="xl" size="sm" onClick={() => { resetForm(); scrollToForm(); }}><FiPlus />Add Employee</Button>
                </Box>
              ) : (
                <>
                  {/* Desktop table */}
                  <Box display={{ base:"none", md:"block" }} overflowX="auto" borderRadius="xl" border="1px solid" borderColor="gray.100">
                    <Box as="table" width="100%" borderCollapse="collapse" style={{ borderSpacing:0 }}>
                      <Box as="thead">
                        <Box as="tr" bg="gray.50">
                          {["Employee","Designation","Salary","Actions"].map((h) => (
                            <Box as="th" key={h} textAlign={h==="Actions"?"center":"left"} p={3} borderBottom="2px solid" borderColor="gray.200" fontSize="xs" fontWeight="700" letterSpacing="0.08em" textTransform="uppercase" color="gray.500">{h}</Box>
                          ))}
                        </Box>
                      </Box>
                      <Box as="tbody">
                        {data.map((item, index) => {
                          const initials = getInitials(item.name);
                          const avatarColor = getAvatarColor(item.name);
                          return (
                            <MotionDiv key={item.id} initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay: index*0.05, duration:0.25 }} style={{ display:"contents" }}>
                              <Box as="tr" _hover={{ bg:"green.50" }} transition="background 0.15s">
                                <Box as="td" p={3} borderBottom="1px solid" borderColor="gray.100">
                                  <Flex align="center" gap={3}>
                                    <Box width="38px" height="38px" borderRadius="full" bg={avatarColor.bg} color={avatarColor.color} display="flex" alignItems="center" justifyContent="center" fontSize="13px" fontWeight="700" flexShrink={0}>
                                      {initials || <FiUser />}
                                    </Box>
                                    <Text fontWeight="700" color="gray.800" fontSize="sm">{item.name}</Text>
                                  </Flex>
                                </Box>
                                <Box as="td" p={3} borderBottom="1px solid" borderColor="gray.100">
                                  <Badge colorPalette="blue" borderRadius="full" px={2} py={1} fontSize="xs">{item.designation}</Badge>
                                </Box>
                                <Box as="td" p={3} borderBottom="1px solid" borderColor="gray.100">
                                  <Text fontWeight="700" color="gray.800" fontSize="sm">{formatSalary(item.salary)}</Text>
                                </Box>
                                <Box as="td" p={3} borderBottom="1px solid" borderColor="gray.100" textAlign="center">
                                  <Flex justify="center" gap={2}>
                                    <Button size="sm" colorPalette="green" variant="outline" borderRadius="lg" onClick={() => edit(item)}><FiEdit2 />Edit</Button>
                                    <Button size="sm" colorPalette="red" borderRadius="lg" onClick={() => del(item.id)}><FiTrash2 />Delete</Button>
                                  </Flex>
                                </Box>
                              </Box>
                            </MotionDiv>
                          );
                        })}
                      </Box>
                    </Box>
                  </Box>

                  {/* Mobile cards */}
                  <Stack display={{ base:"flex", md:"none" }} gap={3} width="100%">
                    {data.map((item, index) => {
                      const initials = getInitials(item.name);
                      const avatarColor = getAvatarColor(item.name);
                      return (
                        <MotionDiv key={item.id} initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay: index*0.05, duration:0.25 }}>
                          <Box border="1px solid" borderColor="gray.200" borderRadius="xl" p={4} bg="gray.50" width="100%" _hover={{ bg:"green.50" }} transition="background 0.15s">
                            <Flex align="center" gap={3} mb={3}>
                              <Box width="44px" height="44px" borderRadius="full" bg={avatarColor.bg} color={avatarColor.color} display="flex" alignItems="center" justifyContent="center" fontSize="14px" fontWeight="700" flexShrink={0}>
                                {initials || <FiUser />}
                              </Box>
                              <Box flex="1" minW={0}>
                                <Text fontWeight="700" color="gray.800" isTruncated>{item.name}</Text>
                                <Badge colorPalette="blue" borderRadius="full" px={2} py="1px" fontSize="xs">{item.designation}</Badge>
                              </Box>
                              <Text fontWeight="700" color="gray.800" fontSize="sm" flexShrink={0}>{formatSalary(item.salary)}</Text>
                            </Flex>
                            <Flex gap={2} width="100%">
                              <Button size="sm" colorPalette="green" variant="outline" borderRadius="lg" flex="1" minW={0} onClick={() => edit(item)}><FiEdit2 />Edit</Button>
                              <Button size="sm" colorPalette="red" borderRadius="lg" flex="1" minW={0} onClick={() => del(item.id)}><FiTrash2 />Delete</Button>
                            </Flex>
                          </Box>
                        </MotionDiv>
                      );
                    })}
                  </Stack>
                </>
              )}
            </Box>
          </MotionDiv>

        </MotionDiv>
      </Box>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </Box>
  );
};

export default Addemployee;
