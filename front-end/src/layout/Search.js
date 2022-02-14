import React, { useState } from 'react';

import { listReservations } from '../utils/api'; 
import Reservation from './Reservations/Reservation';
import ErrorAlert from './ErrorAlert';
import "./Search.css"

export default function Search() {
  const [mobile_number, setMobile_number] = useState("");
  const [reservation, setReservation] = useState(null);
  const [errors, setErrors] = useState(null);

  const findHandler = (e) => {
    e.preventDefault();
    listReservations({ mobile_number })
      .then((response) => setReservation(response))
      .catch((error) => setErrors(error))
  }

  return (
    <div className="search-container">
      <div className="search-header-container">
        <h1>Search</h1>
        <div className="search-container">
          <form onSubmit={findHandler} className="form-container">
            <input
              name="mobile_number"
              type="text"
              placeholder="Enter a customer's phone number."
              required
              onChange={(e) => setMobile_number(e.target.value)}
              value={mobile_number}
              className="form-input"
            />
            <br />
            <button type="submit" className="search-button">Search</button>
          </form>
        </div>
      </div>
      <div className="search-info">
        {reservation && reservation.length > 0 ? 
          reservation.map((reservation, index) => {
            return <Reservation reservation={reservation} key={index} />
          }) 
          : <ErrorAlert errors={errors} />}
      </div>
    </div>
  ) 
}