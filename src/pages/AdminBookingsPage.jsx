import React, { useEffect, useMemo, useState } from 'react';
import {
  Badge,
  Box,
  Button,
  Dialog,
  Flex,
  Heading,
  HStack,
  Input,
  Spinner,
  Stack,
  Text,
  Textarea,
  VStack,
} from '@chakra-ui/react';
import { FiCalendar, FiPhone, FiRefreshCw, FiSearch, FiUsers } from 'react-icons/fi';
import { getBookings, updateBookingStatus } from '../services/bookingService';
import { saveToaster } from '../components/ui/toaster';

const STATUS_FILTERS = ['ALL', 'PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'];

const STATUS_STYLES = {
  PENDING: { bg: 'orange.50', color: 'orange.700', border: 'orange.200' },
  APPROVED: { bg: 'green.50', color: 'green.700', border: 'green.200' },
  REJECTED: { bg: 'red.50', color: 'red.700', border: 'red.200' },
  CANCELLED: { bg: 'gray.100', color: 'gray.700', border: 'gray.300' },
};

const formatDate = (value) => {
  if (!value) return '—';
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const formatTime = (value) => {
  if (!value) return '—';
  const [hours, minutes] = String(value).split(':');
  const date = new Date();
  date.setHours(Number(hours || 0), Number(minutes || 0), 0, 0);
  return date.toLocaleTimeString('en-IN', {
    hour: 'numeric',
    minute: '2-digit',
  });
};

const formatDateTime = (value) => {
  if (!value) return '—';
  return new Date(value).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
  });
};

const AdminBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [approveTarget, setApproveTarget] = useState(null);
  const [rejectTarget, setRejectTarget] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [updating, setUpdating] = useState(false);

  const loadBookings = async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await getBookings();
      setBookings(data || []);
    } catch {
      setError(true);
      saveToaster.create({
        title: 'Unable to load bookings',
        description: 'Please check the backend server and try again.',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const filteredBookings = useMemo(() => {
    const query = search.trim().toLowerCase();
    return bookings.filter((booking) => {
      if (statusFilter !== 'ALL' && booking.status !== statusFilter) {
        return false;
      }
      if (dateFilter && booking.bookingDate !== dateFilter) {
        return false;
      }
      if (!query) {
        return true;
      }
      return (
        String(booking.id).includes(query) ||
        booking.customerName?.toLowerCase().includes(query) ||
        booking.mobile?.includes(query)
      );
    });
  }, [bookings, statusFilter, search, dateFilter]);

  const handleApprove = async () => {
    if (!approveTarget) return;
    setUpdating(true);
    try {
      await updateBookingStatus(approveTarget.id, 'APPROVED', 'Table confirmed');
      saveToaster.create({
        title: 'Booking approved',
        description: `Booking #${approveTarget.id} is now approved.`,
        type: 'success',
      });
      setApproveTarget(null);
      await loadBookings();
    } catch (err) {
      saveToaster.create({
        title: 'Unable to approve booking',
        description: err?.response?.data?.message || 'Please try again.',
        type: 'error',
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleReject = async () => {
    if (!rejectTarget) return;
    setUpdating(true);
    try {
      await updateBookingStatus(rejectTarget.id, 'REJECTED', rejectReason.trim());
      saveToaster.create({
        title: 'Booking rejected',
        description: `Booking #${rejectTarget.id} has been rejected.`,
        type: 'success',
      });
      setRejectTarget(null);
      setRejectReason('');
      await loadBookings();
    } catch (err) {
      saveToaster.create({
        title: 'Unable to reject booking',
        description: err?.response?.data?.message || 'Please try again.',
        type: 'error',
      });
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Box minH="100vh" bg="gray.50" py={{ base: 5, md: 8 }}>
      <Box maxW="1200px" mx="auto" px={{ base: 3, sm: 4, md: 6, lg: 8 }}>
        <Flex
          direction={{ base: 'column', md: 'row' }}
          justify="space-between"
          align={{ base: 'stretch', md: 'center' }}
          gap={4}
          mb={6}
        >
          <Box>
            <Heading fontSize={{ base: 'xl', md: '2xl' }} color="gray.800">
              Table Bookings
            </Heading>
            <Text color="gray.500" fontSize="sm" mt={1}>
              Review customer reservation requests and approve or reject them.
            </Text>
          </Box>
          <Button
            variant="outline"
            borderRadius="xl"
            onClick={loadBookings}
            disabled={loading}
          >
            <FiRefreshCw />
            Refresh
          </Button>
        </Flex>

        <Box
          bg="white"
          border="1px solid"
          borderColor="gray.200"
          borderRadius="2xl"
          p={{ base: 4, md: 5 }}
          mb={5}
        >
          <Flex wrap="wrap" gap={2} mb={4}>
            {STATUS_FILTERS.map((status) => (
              <Button
                key={status}
                size="sm"
                borderRadius="full"
                variant={statusFilter === status ? 'solid' : 'outline'}
                colorPalette={statusFilter === status ? 'blue' : 'gray'}
                onClick={() => setStatusFilter(status)}
              >
                {status === 'ALL' ? 'All' : status.charAt(0) + status.slice(1).toLowerCase()}
              </Button>
            ))}
          </Flex>

          <Stack direction={{ base: 'column', md: 'row' }} gap={3}>
            <Box position="relative" flex="1">
              <Box position="absolute" left="12px" top="50%" transform="translateY(-50%)" color="gray.400">
                <FiSearch />
              </Box>
              <Input
                pl="36px"
                placeholder="Search by name, mobile, or booking ID"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                bg="white"
                borderRadius="xl"
              />
            </Box>
            <Input
              type="date"
              maxW={{ md: '220px' }}
              value={dateFilter}
              onChange={(event) => setDateFilter(event.target.value)}
              borderRadius="xl"
            />
          </Stack>
        </Box>

        {loading ? (
          <Flex minH="240px" align="center" justify="center">
            <VStack gap={3}>
              <Spinner size="lg" color="blue.500" />
              <Text color="gray.500">Loading bookings...</Text>
            </VStack>
          </Flex>
        ) : error ? (
          <Box bg="red.50" border="1px solid" borderColor="red.200" borderRadius="2xl" p={8} textAlign="center">
            <Text color="red.700" fontWeight="700" mb={2}>Could not load bookings</Text>
            <Text color="red.600" fontSize="sm" mb={4}>The backend may be offline.</Text>
            <Button colorPalette="red" variant="outline" onClick={loadBookings}>Try again</Button>
          </Box>
        ) : filteredBookings.length === 0 ? (
          <Box bg="white" border="1px solid" borderColor="gray.200" borderRadius="2xl" p={10} textAlign="center">
            <Text fontWeight="700" color="gray.700">No bookings found</Text>
            <Text color="gray.500" fontSize="sm" mt={2}>
              New customer reservation requests will appear here.
            </Text>
          </Box>
        ) : (
          <>
            <Box
              display={{ base: 'none', lg: 'block' }}
              bg="white"
              border="1px solid"
              borderColor="gray.200"
              borderRadius="2xl"
              overflowX="auto"
            >
              <Box as="table" width="100%" fontSize="sm">
                <Box as="thead" bg="gray.50">
                  <Box as="tr">
                    {['ID', 'Customer', 'Mobile', 'Email', 'Date', 'Time', 'Guests', 'Status', 'Created', 'Actions'].map((header) => (
                      <Box
                        as="th"
                        key={header}
                        textAlign="left"
                        px={4}
                        py={3}
                        color="gray.500"
                        fontWeight="700"
                        whiteSpace="nowrap"
                      >
                        {header}
                      </Box>
                    ))}
                  </Box>
                </Box>
                <Box as="tbody">
                  {filteredBookings.map((booking) => {
                    const style = STATUS_STYLES[booking.status] || STATUS_STYLES.PENDING;
                    return (
                      <Box as="tr" key={booking.id} borderTop="1px solid" borderColor="gray.100">
                        <Box as="td" px={4} py={3} fontWeight="700">#{booking.id}</Box>
                        <Box as="td" px={4} py={3}>{booking.customerName}</Box>
                        <Box as="td" px={4} py={3}>{booking.mobile}</Box>
                        <Box as="td" px={4} py={3} color="gray.500">{booking.email || '—'}</Box>
                        <Box as="td" px={4} py={3}>{formatDate(booking.bookingDate)}</Box>
                        <Box as="td" px={4} py={3}>{formatTime(booking.bookingTime)}</Box>
                        <Box as="td" px={4} py={3}>{booking.guests}</Box>
                        <Box as="td" px={4} py={3}>
                          <Badge bg={style.bg} color={style.color} border="1px solid" borderColor={style.border} px={2} py={1} borderRadius="full">
                            {booking.status}
                          </Badge>
                        </Box>
                        <Box as="td" px={4} py={3} color="gray.500">{formatDateTime(booking.createdAt)}</Box>
                        <Box as="td" px={4} py={3}>
                          {booking.status === 'PENDING' ? (
                            <HStack gap={2}>
                              <Button size="xs" colorPalette="green" onClick={() => setApproveTarget(booking)}>
                                Approve
                              </Button>
                              <Button size="xs" colorPalette="red" variant="outline" onClick={() => { setRejectTarget(booking); setRejectReason(''); }}>
                                Reject
                              </Button>
                            </HStack>
                          ) : (
                            <Text fontSize="xs" color="gray.400">No actions</Text>
                          )}
                        </Box>
                      </Box>
                    );
                  })}
                </Box>
              </Box>
            </Box>

            <VStack display={{ base: 'flex', lg: 'none' }} gap={3} align="stretch">
              {filteredBookings.map((booking) => {
                const style = STATUS_STYLES[booking.status] || STATUS_STYLES.PENDING;
                return (
                  <Box
                    key={booking.id}
                    bg="white"
                    border="1px solid"
                    borderColor="gray.200"
                    borderRadius="2xl"
                    p={4}
                  >
                    <Flex justify="space-between" align="start" gap={3} mb={3}>
                      <Box>
                        <Text fontWeight="800" color="gray.800">#{booking.id} · {booking.customerName}</Text>
                        <Text fontSize="sm" color="gray.500">{booking.mobile}</Text>
                      </Box>
                      <Badge bg={style.bg} color={style.color} border="1px solid" borderColor={style.border} px={2} py={1} borderRadius="full">
                        {booking.status}
                      </Badge>
                    </Flex>
                    <VStack align="stretch" gap={1} fontSize="sm" color="gray.600" mb={4}>
                      <HStack><FiCalendar /><Text>{formatDate(booking.bookingDate)} at {formatTime(booking.bookingTime)}</Text></HStack>
                      <HStack><FiUsers /><Text>{booking.guests} guests</Text></HStack>
                      <HStack><FiPhone /><Text>{booking.email || 'No email provided'}</Text></HStack>
                      {booking.specialRequest && <Text>Request: {booking.specialRequest}</Text>}
                      {booking.adminNote && <Text>Note: {booking.adminNote}</Text>}
                    </VStack>
                    {booking.status === 'PENDING' && (
                      <HStack gap={2}>
                        <Button flex="1" colorPalette="green" onClick={() => setApproveTarget(booking)}>Approve</Button>
                        <Button flex="1" colorPalette="red" variant="outline" onClick={() => { setRejectTarget(booking); setRejectReason(''); }}>Reject</Button>
                      </HStack>
                    )}
                  </Box>
                );
              })}
            </VStack>
          </>
        )}
      </Box>

      <Dialog.Root open={Boolean(approveTarget)} onOpenChange={(details) => { if (!details.open) setApproveTarget(null); }}>
        <Dialog.Positioner>
          <Dialog.Content maxW={{ base: 'calc(100vw - 32px)', md: 'md' }} borderRadius="2xl" p={0}>
            <Box p={6}>
              <Text textAlign="center" fontSize="xl" fontWeight="800" color="gray.800">Approve Booking?</Text>
              <Text textAlign="center" color="gray.600" mt={3} fontSize="sm">
                Customer: {approveTarget?.customerName}
              </Text>
              <Text textAlign="center" color="gray.600" fontSize="sm">
                Date: {formatDate(approveTarget?.bookingDate)} · Time: {formatTime(approveTarget?.bookingTime)}
              </Text>
              <Text textAlign="center" color="gray.600" fontSize="sm">
                Guests: {approveTarget?.guests}
              </Text>
            </Box>
            <Dialog.Footer justifyContent="flex-end" gap={3} px={6} pb={6}>
              <Button variant="outline" borderRadius="xl" onClick={() => setApproveTarget(null)}>Cancel</Button>
              <Button colorPalette="green" borderRadius="xl" loading={updating} onClick={handleApprove}>Approve</Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>

      <Dialog.Root open={Boolean(rejectTarget)} onOpenChange={(details) => { if (!details.open) { setRejectTarget(null); setRejectReason(''); } }}>
        <Dialog.Positioner>
          <Dialog.Content maxW={{ base: 'calc(100vw - 32px)', md: 'md' }} borderRadius="2xl" p={0}>
            <Box p={6}>
              <Text textAlign="center" fontSize="xl" fontWeight="800" color="gray.800">Reject Booking?</Text>
              <Text textAlign="center" color="gray.600" mt={3} fontSize="sm">
                Customer: {rejectTarget?.customerName} · #{rejectTarget?.id}
              </Text>
              <Text fontSize="sm" color="gray.500" mt={4} mb={2}>Reason (optional)</Text>
              <Textarea
                value={rejectReason}
                onChange={(event) => setRejectReason(event.target.value)}
                placeholder="Table unavailable, party too large, etc."
                borderRadius="xl"
              />
            </Box>
            <Dialog.Footer justifyContent="flex-end" gap={3} px={6} pb={6}>
              <Button variant="outline" borderRadius="xl" onClick={() => { setRejectTarget(null); setRejectReason(''); }}>Cancel</Button>
              <Button colorPalette="red" borderRadius="xl" loading={updating} onClick={handleReject}>Reject Booking</Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>
    </Box>
  );
};

export default AdminBookingsPage;
