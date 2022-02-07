import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router';

import { 
  listTables,
  readReservation,
  seatTable
} from '../../utils/api';
import Reservation from '../Reservations/Reservation';
import ErrorAlert from '../ErrorAlert';
import "./Seat.css"

export default function Seat() {
  const history = useHistory();
  const params = useParams();
  
  const [reservation, setReservation] = useState([]);
  const [tables, setTables] = useState([]);
  const [errors, setErrors] = useState(null);
  const [formData, setFormData] = useState({ table_id: "" });
  console.log('errors', errors)
  
  useEffect(() => {
    const abortController = new AbortController();
    async function loadData() {
       try {
        setErrors(null)
        const reservationFetch = await readReservation(params.reservationId, abortController.signal);
        const tablesFetch = await listTables(abortController.signal);
        const freeTables = tablesFetch.filter(table => {
          return table.status.toLowerCase() === "free";
        });
        setReservation(reservationFetch);
        setTables(freeTables);
      } catch (error) {
        setErrors(error);
      }
    }
    loadData();
    return () => abortController.abort();
  }, [params]) 
  
  const tableMapper = () => {
    return tables.map((table, index) => {
      return (
        <option
          key={table.table_id}
          value={JSON.stringify(table.table_id)}
        >{table.table_name} - {table.capacity}</option>
      )
    })
  }
  
  const handleChange = ({ target }) => {
    const selectedTable = tables.find(table => table.table_id === parseInt(target.value));
    if (selectedTable && selectedTable.capacity < reservation.people) {
      setErrors({ message: "Party size cannot exceed table capacity." });
    } else if (!selectedTable) {
      setErrors({ message: "Please select a table." })
    } else {
      setErrors(null);
    }
    setFormData({
      ...formData,
      table_id: selectedTable.table_id,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors(null);
    async function seatReservation() {
      const abortController = new AbortController();
      try {
        await seatTable(formData, reservation.reservation_id, abortController.signal);
        setErrors(null)
        history.push("/dashboard")
      } catch (error) {
        setErrors(error);
      }
    }
    if (errors === null) {
      seatReservation();
    }
  }

  const handleCancel = () => {
    history.push("/dashboard")
  }

  return (
    <div className="seat-container">
      <ErrorAlert error={errors} />
      <div className="seat-res-container">
        <h4>Reservation for:</h4>
        <Reservation reservation={reservation} />
      </div>
      <br />
      <div>
        <h4>Select a table</h4>
        <form onSubmit={handleSubmit} className="seat-form-container">
          <div>
            <select
              name="table_id"
              onChange={handleChange}
              value={formData.table_id}
              className="seat-select"
            > 
              <option>Choose a Table</option>
              {tableMapper()}
              </select>
              <br />
              <button 
                type="submit" className="seat-submit-button">
                  Submit
                </button>
              <button 
                onClick={handleCancel}
                type="cancel"
                className="seat-cancel-button">
                  Cancel
                </button>
          </div>
        </form>
      </div>
  </div>
  )
}