import React from 'react';

export default function Reservation({ reservation }) {
  return (
    <div key={reservation.reservation_id}>
      <p>{reservation.first_name} {reservation.last_name}</p>
      <p>{reservation.reservation_date} at {reservation.reservation_time}</p>
      <p>People in party: {reservation.people}</p>
      <p
        className="text-center boldtext"
        data-reservation-id-status={reservation.reservation_id}
      >
        {reservation.status ? reservation.status : "booked"}
      </p>
    </div>
  )
}