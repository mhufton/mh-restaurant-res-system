import React, { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { 
  createReservation,
  readReservation,
  updateReservation,
} from '../../utils/api';
import { formatAsDate } from '../../utils/date-time';
import ErrorAlert from '../ErrorAlert';
import "./ReservationForm.css"

export default function ReservationForm() {
  const history = useHistory();
  const params = useParams();
  const reservation_id = Number(params.reservation_id);
  const newRes = Object.keys(params).length;

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: "",
  });
  const [errors, setErrors] = useState(null);

  React.useEffect(() => {
    const abortController = new AbortController();
    if (reservation_id) {
      async function loadReservationToEdit() {
        try {
          const loadedRes = await readReservation(reservation_id, abortController.status);
          setFormData(loadedRes);
        } catch (error) {
          setErrors(error)
        }
      }
      loadReservationToEdit()
    }
    return () => abortController.abort();
  }, [reservation_id])

  const handleChange = ({ target }) => {
    setFormData({
        ...formData,
        [target.name]: target.value,
    });
  }
 
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!reservation_id) {
      const reservation = {
        ...formData,
        people: Number(formData.people),
        status: "booked",
      };
      createReservation(reservation)
        .then((output) =>
          history.push(`/dashboard?date=${formData.reservation_date}`))
        .catch((error) => setErrors(error))
    }

    if (reservation_id) {
      const reservation = {
        ...formData,
        people: Number(formData.people),
      };
      updateReservation(reservation)
        .catch((error) => setErrors(error))
        .then(() =>
        history.push(`/dashboard?date=${formData.reservation_date}`)
        );
    } 
  };

  return (
    <div className="form-container">
      <ErrorAlert error={errors} />
      {reservation_id ? <h1>Edit Reseravation</h1> : <h1>New Reservation</h1>}
      <form onSubmit={handleSubmit}>
        <label>
          First Name:
          <input 
            type="text"
            id='first_name'
            name="first_name"
            required={true}
            placeholder='enter first name'
            onChange={handleChange}
            value={formData.first_name}
            />
        </label>
        <br />
        <label>
          Last Name:
          <input 
            type='text'
            id="last_name"
            name="last_name"
            required={true}
            placeholder='enter last name'
            onChange={handleChange}
            value={formData.last_name}
            />
        </label>
        <br />
        <label>
          Phone Number:
          <input
            type="text"
            id='mobile_number'
            name='mobile_number'
            required={true}
            placeholder='enter phone number'
            onChange={handleChange}
            value={formData.mobile_number}
          />
        </label>
        <br />
        <label>Reservation Date:</label>
          <input 
            type="date"
            id="date"
            name="reservation_date"
            required={true}
            onChange={handleChange}
            value={formData.reservation_date}
            />
        <br />
        <label>
          Reservation Time:
          <input 
            type="time"
            id="time"
            name="reservation_time"
            required={true}
            onChange={handleChange}
            value={formData.reservation_time}
            />
        </label>
        <br />
        <label>
          People in party:
          <input 
            type='number' 
            id="people"
            name='people'
            required={true}
            placeholder='enter number'
            onChange={handleChange}
            value={formData.people}
            />
        </label>
        <br />
        <div className="buttons-container">
          <button 
            type="submit"
            className="submit-button"
            >Submit</button>
          <button 
            type='cancel' 
            className='cancel-button'
            onClick={() => {
              const confirmBox = window.confirm(
                "If you cancel all information will be lost"
              )
              if (confirmBox === true) {
                history.go(-1);
              }
            }}>
              Cancel
            </button>
        </div>
      </form>
    </div>
  )
}