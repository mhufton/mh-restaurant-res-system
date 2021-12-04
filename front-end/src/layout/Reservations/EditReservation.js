import React from 'react';

import ReservationForm from './ReservationForm';

export default function EditReservation({ reservation_id }) {
  return (
    <div>
      <ReservationForm reservation_id={reservation_id} />
    </div>
  )
}