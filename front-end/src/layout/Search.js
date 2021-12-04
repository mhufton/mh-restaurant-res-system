import React, { useState } from 'react';

import { listReservations } from '../utils/api'; 
import Reservation from './Reservations/Reservation';
import ErrorAlert from './ErrorAlert';

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

  console.log("reservation in Search", reservation)
  return (
    <div>
       <div>
      <ErrorAlert error={errors} />
      </div>
      <div>
        <form onSubmit={findHandler} >
          <input
            name="mobile_number"
            type="text"
            placeholder="Enter a customer's phone number."
            required
            onChange={(e) => setMobile_number(e.target.value)}
            value={mobile_number}
          />
          <br />
          <button type="submit">FIND</button>
        </form>
        <div>
          {reservation && reservation.length > 0 ? 
            reservation.map((reservation, index) => {
              return <Reservation reservation={reservation} key={index} />
            }) 
            : <p>No Reservation Found</p>}
        </div>
      </div>
    </div>
  ) 
}