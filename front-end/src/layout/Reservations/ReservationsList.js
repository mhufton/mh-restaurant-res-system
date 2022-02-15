import React from 'react';
import { useHistory, useParams } from "react-router-dom";

import ErrorAlert from '../ErrorAlert';
import Reservation from './Reservation';
import { updateStatus } from '../../utils/api';
import { today } from '../../utils/date-time';
import { asDateString } from '../../utils/date-time';
import "./ReservationList.css"

export default function ReservationsList({ reservations, date }) {
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
    const currentDateLong = new Date();
    const currentDate = asDateString(currentDateLong)
    const matchedDates = currentDate === date;

    const time = reservation.reservation_time
    console.log("time", time.slice(0, 5))
    const hours = time.slice(0, 2)
   
    const mins = time.slice(3, 5)
    console.log("mins", mins)
    const testH = 15;
    const newh = testH % 14
    console.log('modulo', hours, "new", newh)
    let finalTime;
    const converter = (testH) => {
      if (testH > 12) {
        finalTime = `${time - 12} PM`;
        console.log("finalTime if after 12noon", finalTime)
      }
    }
    console.log("finalTime", finalTime)

    return (
      <div key={reservation.reservation_id} className="res-list-container">
        <div>
          {errors ? <ErrorAlert error={errors} /> : null}
        </div>
        <div>
        {!reservations 
          ? <ErrorAlert error={"No reservations for this date"} />
          : <Reservation reservation={reservation} handleCancel={handleCancel} matchedDates={matchedDates} /> }
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
              <button 
                type="cancel"
                data-reservation-id-cancel={reservation.reservation_id}
                onClick={handleCancel}
                className="res-button-cancel"
              >
                Cancel
              </button>
            </>
          ) : null}
          
        </div>
      </div>
    )
  })
}