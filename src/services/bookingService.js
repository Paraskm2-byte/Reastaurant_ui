import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8081',
});

export const createBooking = async (payload) => {
  const response = await API.post('/bookings/create', payload);
  return response.data;
};

export const getBookings = async (status) => {
  const response = await API.get('/bookings', {
    params: status && status !== 'ALL' ? { status } : undefined,
  });
  return response.data;
};

export const getBookingById = async (id) => {
  const response = await API.get(`/bookings/${id}`);
  return response.data;
};

export const lookupBookingsByMobile = async (mobile) => {
  const response = await API.get('/bookings/lookup', {
    params: { mobile },
  });
  return response.data;
};

export const getPendingBookingCount = async () => {
  const response = await API.get('/bookings/pending-count');
  return response.data?.pending || 0;
};

export const updateBookingStatus = async (id, status, adminNote) => {
  const response = await API.put(`/bookings/${id}/status`, {
    status,
    adminNote: adminNote || null,
  });
  return response.data;
};

export const mapBookingValidationErrors = (error) => {
  const fieldErrors = error?.response?.data?.errors || {};
  const mapped = {};

  if (fieldErrors.customerName) mapped.name = fieldErrors.customerName;
  if (fieldErrors.mobile) mapped.phone = fieldErrors.mobile;
  if (fieldErrors.email) mapped.email = fieldErrors.email;
  if (fieldErrors.bookingDate) mapped.date = fieldErrors.bookingDate;
  if (fieldErrors.bookingTime) mapped.time = fieldErrors.bookingTime;
  if (fieldErrors.guests) mapped.guests = fieldErrors.guests;

  return mapped;
};
