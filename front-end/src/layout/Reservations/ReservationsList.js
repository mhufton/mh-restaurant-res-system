import React from 'react';
import { Link, useHistory } from "react-router-dom";

import ErrorAlert from '../ErrorAlert';
import Reservation from './Reservation';
import { updateReservation, updateStatus } from '../../utils/api';
import "./ReservationList.css"

export default function ReservationsList({ reservations, setReservation_id }) {
  const [errors, setErrors] = React.useState(null);
  const history = useHistory();

  const filteredReservations = reservations
    .filter((reservation) => reservation.status.toLowerCase() === "booked" 
    || reservation.status.toLowerCase() === "seated"
    );
  
  return filteredReservations.map((reservation, index) => {
    const reservation_id = reservation.reservation_id;

    const handleCancel = (event) => {
      event.preventDefault();
      if (window.confirm("Do you want to cancel this reservation? This cannot be undone.")) {
        const abortController = new AbortController();
        // PUT request
        async function cancel() {
            try {
                await updateStatus(reservation_id, "cancelled", abortController.signal);
                history.go();
            } catch (error) {
                setErrors(error);
            }
        }
        cancel();
      }
    }

    return (
      <div key={reservation.reservation_id} className="res-list-container">
        <div>
          
          {errors ? <ErrorAlert error={errors} /> : null}
        </div>
        <div>
        {!reservations 
          ? <ErrorAlert error={"No reservations for this date"} />
          : <Reservation reservation={reservation} /> }
        </div>
        <div className="res-buttons">
          {reservation.status === "booked"
            ? <a href={`/reservations/${reservation_id}/seat`}>
                <button className="res-button-seat"> 
                  Seat
                </button>
              </a>
            : null
          }
          <a href={`/reservations/${reservation_id}/edit`} >
            <button className="res-button-edit">
                Edit
            </button>
          </a>
          <button 
            data-reservation-id-cancel={reservation.reservation_id}
            onClick={handleCancel}
            className="res-button-cancel"
          >
            Cancel
          </button>
        </div>
        <br />
      </div>
    )
  })
}