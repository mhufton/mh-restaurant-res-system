import React, { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { 
  createReservation,
  readReservation,
  updateReservation,
} from '../../utils/api';
import { formatAsDate } from '../../utils/date-time';
import ErrorAlert from '../ErrorAlert';

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
  console.log("Reservation_id", reservation_id)
  console.log("date", formData.reservation_date)

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
  
//   const handleChange = ({ target }) => {

//     let name = target.name;
//     let value = target.value;
                    
//     // check that reservation date is not on a Tuesday and / or not in the past
//     if (name === "reservation_date") {
//         const date = new Date(`${value} PDT`);
//         console.log("date", date.geUTCDay)
//         const reservation = date.getTime();
//         console.log("reservation", typeof(reservation))
//         const now = Date.now();
//         console.log("now", typeof(now))

//         if (date.getUTCDay() === 2 && reservation < now) {
//           setErrors([
//                 "The restaurant is closed on Tuesday.", 
//                 "Reservation must be in the future."
//             ]);
//         } else if (date.getUTCDay() === 2) {
//           setErrors(["The restaurant is closed on Tuesday."]);
//         } else if (reservation < now) {
//           setErrors(["Reservation must be in the future."]);
//         } else {
//           setErrors([]);
//         }
//     }

//     // check that reservation time is during open hours
//     if (name === "reservation_time") {
//         const open = 1030;
//         const close = 2130;
//         const reservation = value.substring(0, 2) + value.substring(3);
//         if (reservation > open && reservation < close) {
//           setErrors([]);
//         } else {
//           setErrors(["Reservations are only allowed between 10:30am and 9:30pm."]);
//         }
//     }
//     // set the form state
//     setFormData({
//         ...formData,
//         [target.name]: target.value,
//     });
// }

  const handleChange = ({ target }) => {
    setFormData({
        ...formData,
        [target.name]: target.value,
    });
  }
 
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!reservation_id) {
      console.log("adding a new res")
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
      console.log("params exist - updating existing res")
      const reservation = {
        ...formData,
        people: Number(formData.people),
      };
      updateReservation(reservation)
        .then(() => console.log("edited reservation"))
        .catch((error) => setErrors(error))
        .then(() =>
        history.push(`/dashboard?date=${formData.reservation_date}`)
        );
    } 
    // if (reservation_id) {
    //   console.log("editing an existing res")
    //   async function putReservation() {
    //     try {
    //       setErrors(null);
    //       await updateReservation(formData);
    //       console.log("formData", formData)
    //       history.push(`/dashboard?date=${formData.reservation_date}`)
    //     } catch (error) {
    //       setErrors(error)
    //     }
    //   }
    //   putReservation();
    // }
  };

  return (
    <div>
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
        <button 
          type="submit"
          >Submit</button>
        <button 
          type='cancel' 
          className='cancelButton'
          onClick={() => {
            const confirmBox = window.confirm(
              "If you cancel all information will be lost"
            )
            if (confirmBox === true) {
              console.log("going back a page")
              history.go(-1);
            }
          }}>
            Cancel
          </button>
      </form>
    </div>
  )
}