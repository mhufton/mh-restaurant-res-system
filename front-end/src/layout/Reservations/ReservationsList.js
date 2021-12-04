import React from 'react';
import { Link, useHistory } from "react-router-dom";

import ErrorAlert from '../ErrorAlert';
import Reservation from './Reservation';
import { updateReservation, updateStatus } from '../../utils/api';

export default function ReservationsList({ reservations, setReservation_id }) {
  const [errors, setErrors] = React.useState(null);
  const history = useHistory();
  console.log('ReservationList', reservations)

  const filteredReservations = reservations
    .filter((reservation) => reservation.status.toLowerCase() === "booked" 
    || reservation.status.toLowerCase() === "seated"
    );
  
  return filteredReservations.map((reservation, index) => {
    const reservation_id = reservation.reservation_id;

    const handleCancel = () => {
      const abortController = new AbortController();
      const confirmWindow = window.confirm(
        "Do you want to cancel this reservation? This cannot be undone."
      );
      if (confirmWindow) {
        async function updatingReservation() {
          try {
            await updateReservation(reservation.reservation_id, "cancelled", abortController.signal) 
            history.go();
          } catch (error) {
            setErrors(error)
          }
        }
        updatingReservation();
        return () => abortController.abort();
      } 
    }

    return (
      <div key={reservation.reservation_id}>
        <div>
          
          {errors ? <ErrorAlert error={errors} /> : null}
        </div>
        <div>
        {!reservations 
          ? <ErrorAlert error={"No reservations for this date"} />
          : <Reservation reservation={reservation} /> }
        </div>
        <div>
          {reservation.status === "booked"
            ? <a href={`/reservations/${reservation_id}/seat`}>
                <button>
                  Seat
                </button>
              </a>
            : null
          }
          <a href={`/reservations/${reservation_id}/edit`}>
            <button>
                Edit
            </button>
          </a>
          <button 
            data-reservation-id-cancel={reservation.reservation_id}
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
        <br />
      </div>
    )
  })
}