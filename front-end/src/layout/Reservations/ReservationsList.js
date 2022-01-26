import React from 'react';
import { useHistory, Link } from "react-router-dom";

import ErrorAlert from '../ErrorAlert';
import Reservation from './Reservation';
import { updateStatus } from '../../utils/api';
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
    console.log(`reservation ${reservation.reservation_id}`, reservation)

    return (
      <div key={reservation.reservation_id} className="res-list-container">
        <div>
          
          {errors ? <ErrorAlert error={errors} /> : null}
        </div>
        <div>
        {!reservations 
          ? <ErrorAlert error={"No reservations for this date"} />
          : <Reservation reservation={reservation} handleCancel={handleCancel} /> }
        </div>
        <div className="res-buttons">
          {reservation.status === "booked" ? (
            <>
              <a href={`/reservations/${reservation.reservation_id}/seat`} >
                <button className="res-button-seat" type="submit">
                  Seat
                </button>
              </a>

              <a href={`/reservations/${reservation.reservation_id}/edit`} >
                <button className="res-button-edit" >
                  Edit
                </button>
              </a>
            </>
          ) : null}
          <button 
            type="cancel"
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