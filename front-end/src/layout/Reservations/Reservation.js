import React from 'react';
import './Reservation.css'

export default function Reservation({ reservation }) {
  if (reservation) {
    return (
      <div key={reservation.reservation_id} className="reservation-container">
        <p className="res-name">{reservation.first_name} {reservation.last_name}</p>
        <p className="res-date">{reservation.reservation_date} at {reservation.reservation_time}</p>
        <p className="res-people">People in party: {reservation.people}</p>
        <p
          data-reservation-id-status={reservation.reservation_id}
          className="res-status"
        >
          {reservation.status ? reservation.status : "booked"}
        </p>
      </div>
    )
  }
}