import React, { useState } from 'react';
import { useHistory } from 'react-router';

import { updateStatus, searchByPhone } from '../utils/api'; 
import Reservation from './Reservations/Reservation';
import ErrorAlert from "./ErrorAlert"
import "./Search.css"

export default function Search() {
  // const [currentNumber, setCurrentNumber] = useState({ mobile_number: "" });
  const [mobile_number, setMobile_number] = useState("");
  const [reservation, setReservation] = useState(null);
  const [searchError, setSearchError] = useState(null)

  const history = useHistory();

  const findHandler = async (event) => {
    event.preventDefault();
    console.log("find button clicked")
    const abortController = new AbortController();
    try {
      const response = await searchByPhone({ mobile_number })
      if (response.length) {
        setReservation(response);
        setSearchError(null)
      } else {
        setSearchError({ message: "No reservations found" })
        setReservation(null)
      }
    } catch (err) {
      if (err.name !== "AbortError") {
        setSearchError(err);
      }
      console.log("Aborted");
    }
    return () => abortController.abort();
  };

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
            <button type="submit" className="search-button">Find</button>
          </form>
        </div>
        
      </div>
      <ErrorAlert error={searchError} />
      <div className="search-info">
        {reservation && reservation.length > 0 ? 
          reservation.map((reservation, index) => {
            return (
              <div>
                <Reservation reservation={reservation} key={reservation.resrevation_id} />
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