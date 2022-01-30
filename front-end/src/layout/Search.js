import React, { useState } from 'react';
import { useHistory } from 'react-router';

import { listReservations, updateStatus } from '../utils/api'; 
import Reservation from './Reservations/Reservation';
import "./Search.css"

export default function Search() {
  const [mobile_number, setMobile_number] = useState("");
  const [reservation, setReservation] = useState(null);
  const [searchError, setSearchError] = useState(null)

  const history = useHistory();

  const findHandler = (e) => {
    e.preventDefault();
    listReservations({ mobile_number })
      .then((response) => setReservation(response))
      .catch((error) => setSearchError(["No reservation found"]))
  }
  console.log("res", reservation)
  console.log("mobile", mobile_number.length)
  console.log('err', searchError)

  const handleCancel = (event) => {
    event.preventDefault();
    if (window.confirm("Do you want to cancel this reservation? This cannot be undone.")) {
      const abortController = new AbortController();
      // PUT request
      async function cancel() {
        try {
          await updateStatus(reservation.reservation_id, "cancelled", abortController.signal);
          history.go();
        } catch (error) {
          setSearchError(error);
        }
      }
      cancel();
      return () => abortController.abort();
    }
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
        {reservation && reservation.length > 0 && mobile_number.length ? 
          reservation.map((reservation, index) => {
            return (
              <div>
                <Reservation reservation={reservation} key={index} />
                <a href={`/reservations/${reservation.reservation_id}/edit`} >
                  <button className="res-button-edit" >
                    Edit
                  </button>
                </a>
                <button 
                  type="cancel"
                  data-reservation-id-cancel={reservation.reservation_id}
                  onClick={handleCancel}
                  className="res-button-cancel"
                >
                  Cancel
                </button>
              </div> 
              
          )}) : null}
      </div>
    </div>
  ) 
}