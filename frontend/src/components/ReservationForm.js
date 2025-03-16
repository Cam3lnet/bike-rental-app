import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const ReservationForm = () => {
  const [bikes, setBikes] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  const [formData, setFormData] = useState({
    bikeId: '',
    customerId: '',
    startDate: new Date(),
    endDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
    totalCost: 0,
    notes: ''
  });

  // Calculate days difference
  const getDays = () => {
    const diffTime = Math.abs(formData.endDate - formData.startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays || 1; // Minimum 1 day
  };

  // Calculate total cost
  const calculateTotalCost = () => {
    if (!formData.bikeId) return 0;
    
    const selectedBike = bikes.find(bike => bike._id === formData.bikeId);
    if (!selectedBike) return 0;
    
    const days = getDays();
    return days * selectedBike.dailyRate;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [bikesRes, customersRes] = await Promise.all([
          axios.get('/api/bikes'),
          axios.get('/api/customers')
        ]);
        
        setBikes(bikesRes.data);
        setCustomers(customersRes.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  useEffect(() => {
    // Update total cost when bike or dates change
    const totalCost = calculateTotalCost();
    setFormData(prev => ({ ...prev, totalCost }));
  }, [formData.bikeId, formData.startDate, formData.endDate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date, field) => {
    setFormData(prev => ({ ...prev, [field]: date }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post('/api/reservations', formData);
      
      setMessage({
        type: 'success',
        text: 'Reservation created successfully!'
      });
      
      // Reset form
      setFormData({
        bikeId: '',
        customerId: '',
        startDate: new Date(),
        endDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
        totalCost: 0,
        notes: ''
      });
      
      // Redirect or update UI as needed
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Error creating reservation'
      });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="reservation-form-container">
      <h2>Create New Reservation</h2>
      
      {message && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Select Bike:</label>
          <select 
            name="bikeId" 
            value={formData.bikeId} 
            onChange={handleInputChange}
            required
          >
            <option value="">-- Select a Bike --</option>
            {bikes
              .filter(bike => bike.status === 'Available')
              .map(bike => (
                <option key={bike._id} value={bike._id}>
                  {bike.model} - {bike.type} (${bike.dailyRate}/day)
                </option>
              ))
            }
          </select>
        </div>
        
        <div className="form-group">
          <label>Select Customer:</label>
          <select 
            name="customerId" 
            value={formData.customerId} 
            onChange={handleInputChange}
            required
          >
            <option value="">-- Select a Customer --</option>
            {customers.map(customer => (
              <option key={customer._id} value={customer._id}>
                {customer.name} ({customer.email})
              </option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label>Start Date:</label>
          <DatePicker
            selected={formData.startDate}
            onChange={date => handleDateChange(date, 'startDate')}
            selectsStart
            startDate={formData.startDate}
            endDate={formData.endDate}
            minDate={new Date()}
            required
          />
        </div>
        
        <div className="form-group">
          <label>End Date:</label>
          <DatePicker
            selected={formData.endDate}
            onChange={date => handleDateChange(date, 'endDate')}
            selectsEnd
            startDate={formData.startDate}
            endDate={formData.endDate}
            minDate={formData.startDate}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Total Cost:</label>
          <input 
            type="number" 
            name="totalCost" 
            value={formData.totalCost} 
            readOnly
          />
        </div>
        
        <div className="form-group">
          <label>Notes:</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            rows="3"
          ></textarea>
        </div>
        
        <button type="submit" className="submit-btn">Create Reservation</button>
      </form>
    </div>
  );
};

export default ReservationForm;
