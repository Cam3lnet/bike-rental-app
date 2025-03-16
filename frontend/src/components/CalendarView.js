import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const CalendarView = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)); // 2 weeks
  const [calendarData, setCalendarData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCalendarData();
  }, [startDate, endDate]);

  const fetchCalendarData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/reservations/calendar`, {
        params: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString()
        }
      });
      setCalendarData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching calendar data:', error);
      setLoading(false);
    }
  };

  // Generate dates between start and end date
  const getDates = () => {
    const dates = [];
    let currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return dates;
  };

  const dates = getDates();

  // Check if a bike is reserved on a specific date
  const isReserved = (bike, date) => {
    return bike.reservations.some(res => {
      const resStartDate = new Date(res.startDate);
      const resEndDate = new Date(res.endDate);
      return date >= resStartDate && date <= resEndDate;
    });
  };

  // Get reservation details for a specific date
  const getReservationForDate = (bike, date) => {
    return bike.reservations.find(res => {
      const resStartDate = new Date(res.startDate);
      const resEndDate = new Date(res.endDate);
      return date >= resStartDate && date <= resEndDate;
    });
  };

  if (loading) {
    return <div>Loading calendar...</div>;
  }

  return (
    <div className="calendar-container">
      <h2>Bike Availability Calendar</h2>
      
      <div className="date-picker-container">
        <div>
          <label>Start Date:</label>
          <DatePicker
            selected={startDate}
            onChange={date => setStartDate(date)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
          />
        </div>
        <div>
          <label>End Date:</label>
          <DatePicker
            selected={endDate}
            onChange={date => setEndDate(date)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
          />
        </div>
      </div>
      
      <div className="calendar-grid">
        <table>
          <thead>
            <tr>
              <th>Bike</th>
              {dates.map(date => (
                <th key={date.toISOString()}>
                  {date.toLocaleDateString(undefined, { month: 'numeric', day: 'numeric' })}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {calendarData.map(bike => (
              <tr key={bike.bikeId}>
                <td>{bike.bikeDetails.model} ({bike.bikeDetails.bikeId})</td>
                {dates.map(date => {
                  const reserved = isReserved(bike, date);
                  const reservation = reserved ? getReservationForDate(bike, date) : null;
                  
                  return (
                    <td key={date.toISOString()} 
                        className={reserved ? 'reserved' : 'available'}
                        title={reservation ? `Reserved by: ${reservation.customerName}` : 'Available'}>
                      {reserved ? 'R' : 'A'}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CalendarView;
