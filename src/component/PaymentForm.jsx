import React, { useEffect, useMemo, useState } from "react";
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
  FiCreditCard,
  FiDollarSign,
  FiEdit2,
  FiFileText,
  FiPlus,
  FiTrash2,
} from "react-icons/fi";
import { deleteToaster, saveToaster, updateToaster } from "../components/ui/toaster";

const MotionDiv = motion.div;

const API = axios.create({ baseURL: "http://localhost:8081" });

const emptyForm = {
  paymentMode: "",
  Discount: "",
  CGst: "",
  SGst: "",
  Vat: "",
  Bill: "",
  Totalprice: "",
  finalprice: "",
};

const NativeSelect = ({ value, onChange, name, children, style, ...rest }) => (
  <select name={name} value={value} onChange={onChange}
    style={{ width:"100%", height:"40px", borderRadius:"12px", border:"1px solid #E2E8F0", background:"white", color: value ? "#1A202C" : "#A0AEC0", paddingLeft:"16px", paddingRight:"16px", fontSize:"14px", outline:"none", cursor:"pointer", ...style }}
    {...rest}>{children}</select>
);

const SectionLabel = ({ children }) => (
  <Text fontSize="xs" fontWeight="700" letterSpacing="0.1em" textTransform="uppercase" color="purple.500" mb={3} mt={1}>{children}</Text>
);

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", { style:"currency", currency:"INR", maximumFractionDigits:0 }).format(Number(value) || 0);

const modeColorPalette = { Cash:"green", Card:"blue", UPI:"purple", Online:"orange" };

const PaymentForm = () => {
  const [data, setData] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [id, setId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);

  const getData = async () => {
    try {
      const response = await API.get("/payment/getdata");
      setData(response.data || []);
    } catch (error) {
      saveToaster.create({ title:"Unable to load payments", description:"Please check the backend server.", type:"error" });
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => { getData(); }, []);

  const summaryStats = useMemo(() => {
    const totalRecords = data.length;
    const totalRevenue = data.reduce((sum, item) => sum + (Number(item.finalprice) || 0), 0);
    const totalBill = data.reduce((sum, item) => sum + (Number(item.Totalprice) || 0), 0);
    const avgBill = totalRecords > 0 ? totalBill / totalRecords : 0;
    return { totalRecords, totalRevenue, avgBill };
  }, [data]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => { setForm(emptyForm); setId(null); };

  const onsubmit = async () => {
    if (!form.paymentMode) {
      saveToaster.create({ title:"Missing payment method", description:"Please select a payment method before saving.", type:"error" });
      return;
    }
    setLoading(true);
    const payload = {
      ...form,
      CGst: form.CGst ? Number(form.CGst) : null,
      SGst: form.SGst ? Number(form.SGst) : null,
      Totalprice: form.Totalprice ? Number(form.Totalprice) : null,
      finalprice: form.finalprice ? Number(form.finalprice) : null,
    };
    try {
      if (id === null) {
        await API.post("/payment/create", payload);
        saveToaster.create({ description:"Payment record created successfully", type:"success", duration:1500 });
      } else {
        await API.put(`/payment/update/${id}`, payload);
        updateToaster.create({ description:"Payment record updated successfully", type:"success", duration:1500 });
      }
      resetForm();
      await getData();
    } catch (error) {
      saveToaster.create({ title:"Payment save failed", description: error.response?.data?.message || "Please verify the payment form and try again.", type:"error" });
    } finally {
      setLoading(false);
    }
  };

  const del = async (paymentId) => {
    try {
      await API.delete(`/payment/delete/${paymentId}`);
      await getData();
      deleteToaster.create({ description:"Payment deleted successfully", type:"success", duration:1500 });
    } catch (error) {
      saveToaster.create({ title:"Delete failed", description: error.response?.data?.message || "Unable to delete this payment record.", type:"error" });
    }
  };

  const edit = (item) => {
    setId(item.id);
    setForm({ paymentMode: item.paymentMode||"", Discount: item.Discount||"", CGst: item.CGst??"", SGst: item.SGst??"", Vat: item.Vat||"", Bill: item.Bill||"", Totalprice: item.Totalprice??"", finalprice: item.finalprice??"" });
  };

  const statCards = [
    { label:"Total Records", display: String(summaryStats.totalRecords), icon: FiFileText, bg:"#eff6ff", iconColor:"#2563eb", borderColor:"#bfdbfe" },
    { label:"Total Revenue", display: formatCurrency(summaryStats.totalRevenue), icon: FiDollarSign, bg:"#f0fdf4", iconColor:"#16a34a", borderColor:"#bbf7d0" },
    { label:"Avg Bill", display: formatCurrency(summaryStats.avgBill), icon: FiCreditCard, bg:"#faf5ff", iconColor:"#9333ea", borderColor:"#e9d5ff" },
  ];

  return (
    <Box minH="100vh" bg="gray.50" py={{ base:5, md:8, lg:10 }}>
      <Box w="100%" maxW="1400px" mx="auto" px={{ base:3, sm:4, md:6, lg:8 }}>

        <MotionDiv initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.4 }}>

          {/* Page Header */}
          <Box mb={{ base:6, md:8 }}>
            <Flex align="center" gap={3} mb={2}>
              <Box bg="purple.500" color="white" borderRadius="xl" p={{ base:2, md:3 }} fontSize={{ base:"lg", md:"xl" }} display="flex" alignItems="center" justifyContent="center" flexShrink={0}>
                <FiCreditCard />
              </Box>
              <Box>
                <Text fontSize="xs" fontWeight="700" letterSpacing="0.16em" color="purple.500" textTransform="uppercase" mb={0.5}>Finance management</Text>
                <Text fontSize={{ base:"xl", sm:"2xl", md:"3xl" }} fontWeight="800" color="gray.800" lineHeight="1.2">Payments</Text>
              </Box>
            </Flex>
            <Text fontSize={{ base:"sm", md:"md" }} color="gray.500" pl={{ base:0, sm:"52px" }}>
              Manage restaurant payment records and transactions.
            </Text>
          </Box>

          {/* Summary stats */}
          <Grid templateColumns={{ base:"1fr", sm:"repeat(3, 1fr)" }} gap={{ base:3, md:4 }} mb={{ base:6, md:8 }}>
            {statCards.map((stat, index) => {
              const StatIcon = stat.icon;
              return (
                <MotionDiv key={stat.label} initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay: index*0.1, duration:0.35 }}>
                  <Box bg="white" borderRadius="2xl" border="1px solid" borderColor="gray.200" borderLeft="4px solid" borderLeftColor={stat.borderColor} boxShadow="sm" p={{ base:4, md:5 }} transition="all 0.2s" _hover={{ boxShadow:"md", transform:"translateY(-1px)" }}>
                    <Flex justify="space-between" align="flex-start" mb={3}>
                      <Text fontSize="sm" color="gray.500" fontWeight="600">{stat.label}</Text>
                      <Box bg={stat.bg} color={stat.iconColor} borderRadius="lg" p={2} fontSize="18px" display="flex" alignItems="center" justifyContent="center" flexShrink={0}><StatIcon /></Box>
                    </Flex>
                    <Text fontSize={{ base:"xl", md:"2xl" }} fontWeight="800" color="gray.800">{stat.display}</Text>
                  </Box>
                </MotionDiv>
              );
            })}
          </Grid>

          {/* Form card */}
          <MotionDiv initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.1, duration:0.4 }}>
            <Box w="100%" maxW="900px" mx="auto" bg="white" borderRadius="2xl" boxShadow="sm" border="1px solid" borderColor="gray.200" p={{ base:4, sm:5, md:7 }} mb={{ base:6, md:8 }}>

              <Flex align="center" gap={3} mb={2}>
                <Box bg="purple.50" color="purple.500" borderRadius="xl" p={2.5} fontSize="xl" display="flex" alignItems="center" justifyContent="center" flexShrink={0}><FiCreditCard /></Box>
                <Box>
                  <Text fontSize={{ base:"md", md:"lg" }} fontWeight="700" color="gray.800">{id === null ? "Add Payment Record" : "Update Payment Record"}</Text>
                  <Text fontSize="sm" color="gray.500">{id === null ? "Enter the payment details below." : "Edit the record and save changes."}</Text>
                </Box>
              </Flex>
              <Box h="2px" bg="purple.100" borderRadius="full" mb={6} mt={3} />

              <Stack gap={6}>
                {/* Payment Details */}
                <Box>
                  <SectionLabel>Payment Details</SectionLabel>
                  <Box h="1px" bg="gray.100" mb={4} />
                  <Grid templateColumns={{ base:"1fr", sm:"1fr 1fr" }} gap={4}>
                    <Box>
                      <Text fontSize="sm" fontWeight="600" color="gray.700" mb={2}>Payment Mode</Text>
                      <NativeSelect name="paymentMode" value={form.paymentMode} onChange={handleChange} style={{ width:"100%" }}>
                        <option value="">Select payment mode</option>
                        <option value="Cash">💵 Cash</option>
                        <option value="Card">💳 Card</option>
                        <option value="UPI">📱 UPI</option>
                        <option value="Online">🌐 Online</option>
                      </NativeSelect>
                    </Box>
                    <Box>
                      <Text fontSize="sm" fontWeight="600" color="gray.700" mb={2}>Discount</Text>
                      <Input name="Discount" value={form.Discount} onChange={handleChange} placeholder="e.g. 10%" borderRadius="xl" borderColor="gray.200" />
                    </Box>
                  </Grid>
                </Box>

                {/* Tax Information */}
                <Box>
                  <SectionLabel>Tax Information</SectionLabel>
                  <Box h="1px" bg="gray.100" mb={4} />
                  <Grid templateColumns={{ base:"1fr", sm:"1fr 1fr 1fr" }} gap={3}>
                    <Box>
                      <Text fontSize="sm" fontWeight="600" color="gray.700" mb={2}>CGST (%)</Text>
                      <Input name="CGst" value={form.CGst} onChange={handleChange} type="number" placeholder="9" borderRadius="xl" borderColor="gray.200" />
                    </Box>
                    <Box>
                      <Text fontSize="sm" fontWeight="600" color="gray.700" mb={2}>SGST (%)</Text>
                      <Input name="SGst" value={form.SGst} onChange={handleChange} type="number" placeholder="9" borderRadius="xl" borderColor="gray.200" />
                    </Box>
                    <Box>
                      <Text fontSize="sm" fontWeight="600" color="gray.700" mb={2}>VAT</Text>
                      <Input name="Vat" value={form.Vat} onChange={handleChange} placeholder="0" borderRadius="xl" borderColor="gray.200" />
                    </Box>
                  </Grid>
                </Box>

                {/* Billing */}
                <Box>
                  <SectionLabel>Billing</SectionLabel>
                  <Box h="1px" bg="gray.100" mb={4} />
                  <Stack gap={4}>
                    <Box>
                      <Text fontSize="sm" fontWeight="600" color="gray.700" mb={2}>Bill Number</Text>
                      <Input name="Bill" value={form.Bill} onChange={handleChange} placeholder="e.g. INV-001" borderRadius="xl" borderColor="gray.200" />
                    </Box>
                    <Grid templateColumns={{ base:"1fr", sm:"1fr 1fr" }} gap={4}>
                      <Box>
                        <Text fontSize="sm" fontWeight="600" color="gray.700" mb={2}>Total Price (₹)</Text>
                        <Input name="Totalprice" value={form.Totalprice} onChange={handleChange} type="number" placeholder="1000" borderRadius="xl" borderColor="gray.200" />
                      </Box>
                      <Box>
                        <Text fontSize="sm" fontWeight="600" color="gray.700" mb={2}>Final Price (₹)</Text>
                        <Input name="finalprice" value={form.finalprice} onChange={handleChange} type="number" placeholder="950" borderRadius="xl" borderColor="gray.200" />
                      </Box>
                    </Grid>
                  </Stack>
                </Box>
              </Stack>

              <Box h="1px" bg="gray.100" mt={6} mb={5} />
              <Flex justify={{ base:"stretch", sm:"flex-end" }} gap={3} direction={{ base:"column", sm:"row" }}>
                <Button variant="outline" borderRadius="xl" onClick={resetForm} w={{ base:"100%", sm:"auto" }}>Reset</Button>
                <Button colorPalette="purple" borderRadius="xl" onClick={onsubmit} loading={loading} w={{ base:"100%", sm:"auto" }}>
                  {id === null ? "Save Payment" : "Update Payment"}
                </Button>
              </Flex>
            </Box>
          </MotionDiv>

          {/* Records panel */}
          <MotionDiv initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2, duration:0.4 }}>
            <Box w="100%" bg="white" borderRadius="2xl" boxShadow="sm" border="1px solid" borderColor="gray.200" p={{ base:4, md:6 }}>

              <Flex align="center" gap={3} mb={2}>
                <Box bg="purple.50" color="purple.500" borderRadius="xl" p={2.5} fontSize="xl" display="flex" alignItems="center" justifyContent="center" flexShrink={0}><FiFileText /></Box>
                <Box>
                  <Text fontSize={{ base:"md", md:"lg" }} fontWeight="700" color="gray.800">Payment History</Text>
                  <Text fontSize="sm" color="gray.500">{data.length} record{data.length === 1 ? "" : "s"} total</Text>
                </Box>
              </Flex>
              <Box h="2px" bg="gray.100" borderRadius="full" mb={5} mt={3} />

              {dataLoading ? (
                <Flex justify="center" align="center" py={16}>
                  <Stack align="center" gap={3}>
                    <Box width="40px" height="40px" border="3px solid" borderColor="gray.200" borderTopColor="purple.500" borderRadius="full" style={{ animation:"spin 0.8s linear infinite" }} />
                    <Text color="gray.500" fontSize="sm">Loading payments...</Text>
                  </Stack>
                </Flex>
              ) : data.length === 0 ? (
                <Box border="1px dashed" borderColor="gray.200" borderRadius="xl" p={{ base:8, md:12 }} textAlign="center" bg="gray.50">
                  <Box display="inline-flex" bg="purple.50" borderRadius="full" p={4} mb={3} fontSize="2xl" color="purple.300"><FiCreditCard /></Box>
                  <Text fontWeight="700" color="gray.700" fontSize="lg">No payment records</Text>
                  <Text fontSize="sm" color="gray.500" mt={1} mb={5}>Add your first payment record to get started.</Text>
                  <Button colorPalette="purple" borderRadius="xl" size="sm" onClick={resetForm}><FiPlus />Add Payment</Button>
                </Box>
              ) : (
                <>
                  {/* Desktop table */}
                  <Box display={{ base:"none", lg:"block" }} overflowX="auto" borderRadius="xl" border="1px solid" borderColor="gray.100">
                    <Box as="table" width="100%" borderCollapse="collapse" style={{ borderSpacing:0 }} minW="720px">
                      <Box as="thead">
                        <Box as="tr" bg="gray.50">
                          {["Mode","Discount","CGST","SGST","VAT","Bill","Total","Final","Actions"].map((h) => (
                            <Box as="th" key={h} textAlign={h==="Actions"?"center":"left"} p={3} borderBottom="2px solid" borderColor="gray.200" fontSize="xs" fontWeight="700" letterSpacing="0.08em" textTransform="uppercase" color="gray.500" whiteSpace="nowrap">{h}</Box>
                          ))}
                        </Box>
                      </Box>
                      <Box as="tbody">
                        {data.map((item, index) => {
                          const modeColor = modeColorPalette[item.paymentMode] || "gray";
                          return (
                            <MotionDiv key={item.id} initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay: index*0.04, duration:0.25 }} style={{ display:"contents" }}>
                              <Box as="tr" _hover={{ bg:"purple.50" }} transition="background 0.15s">
                                <Box as="td" p={3} borderBottom="1px solid" borderColor="gray.100"><Badge colorPalette={modeColor} borderRadius="full" px={2} py={1} fontSize="xs">{item.paymentMode||"—"}</Badge></Box>
                                <Box as="td" p={3} borderBottom="1px solid" borderColor="gray.100"><Text fontSize="sm" color="gray.700">{item.Discount||"—"}</Text></Box>
                                <Box as="td" p={3} borderBottom="1px solid" borderColor="gray.100"><Text fontSize="sm" color="gray.700">{item.CGst!=null?`${item.CGst}%`:"—"}</Text></Box>
                                <Box as="td" p={3} borderBottom="1px solid" borderColor="gray.100"><Text fontSize="sm" color="gray.700">{item.SGst!=null?`${item.SGst}%`:"—"}</Text></Box>
                                <Box as="td" p={3} borderBottom="1px solid" borderColor="gray.100"><Text fontSize="sm" color="gray.700">{item.Vat||"—"}</Text></Box>
                                <Box as="td" p={3} borderBottom="1px solid" borderColor="gray.100"><Text fontSize="sm" color="gray.700">{item.Bill||"—"}</Text></Box>
                                <Box as="td" p={3} borderBottom="1px solid" borderColor="gray.100"><Text fontSize="sm" fontWeight="600" color="gray.800">{item.Totalprice!=null?formatCurrency(item.Totalprice):"—"}</Text></Box>
                                <Box as="td" p={3} borderBottom="1px solid" borderColor="gray.100"><Text fontSize="sm" fontWeight="700" color="purple.700">{item.finalprice!=null?formatCurrency(item.finalprice):"—"}</Text></Box>
                                <Box as="td" p={3} borderBottom="1px solid" borderColor="gray.100" textAlign="center">
                                  <Flex justify="center" gap={2}>
                                    <Button size="sm" colorPalette="purple" variant="outline" borderRadius="lg" onClick={() => edit(item)}><FiEdit2 />Edit</Button>
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
                  <Stack display={{ base:"flex", lg:"none" }} gap={3}>
                    {data.map((item, index) => {
                      const modeColor = modeColorPalette[item.paymentMode] || "gray";
                      return (
                        <MotionDiv key={item.id} initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay: index*0.04, duration:0.25 }}>
                          <Box border="1px solid" borderColor="gray.200" borderRadius="xl" p={4} _hover={{ bg:"purple.50" }} transition="background 0.15s">
                            <Flex justify="space-between" align="flex-start" mb={3}>
                              <Box>
                                <Badge colorPalette={modeColor} borderRadius="full" px={2} py={1} fontSize="xs">{item.paymentMode||"—"}</Badge>
                                <Text fontSize="xs" color="gray.500" mt={1}>Bill: {item.Bill||"—"}</Text>
                              </Box>
                              <Box textAlign="right">
                                <Text fontWeight="700" color="purple.700" fontSize="sm">{item.finalprice!=null?formatCurrency(item.finalprice):"—"}</Text>
                                <Text fontSize="xs" color="gray.500">Total: {item.Totalprice!=null?formatCurrency(item.Totalprice):"—"}</Text>
                              </Box>
                            </Flex>
                            <Flex gap={3} fontSize="xs" color="gray.600" mb={3} flexWrap="wrap">
                              {item.CGst!=null&&<Text>CGST: {item.CGst}%</Text>}
                              {item.SGst!=null&&<Text>SGST: {item.SGst}%</Text>}
                              {item.Discount&&<Text>Disc: {item.Discount}</Text>}
                              {item.Vat&&<Text>VAT: {item.Vat}</Text>}
                            </Flex>
                            <Flex gap={2}>
                              <Button size="sm" colorPalette="purple" variant="outline" borderRadius="lg" flex="1" minW={0} onClick={() => edit(item)}><FiEdit2 />Edit</Button>
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

export default PaymentForm;
