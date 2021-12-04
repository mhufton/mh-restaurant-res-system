import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router';

import { 
  listTables,
  readReservation,
  seatTable,
  updateStatus,
} from '../../utils/api';
import Reservation from '../Reservations/Reservation';
import ErrorAlert from '../ErrorAlert';

export default function Seat() {
  const history = useHistory();
  const params = useParams();
  const newParams = Object.values(params)
  const abortController = new AbortController();
  
  const [reservation, setReservation] = useState([]);
  const [tables, setTables] = useState([]);
  const [errors, setErrors] = useState(null);
  const [formData, setFormData] = useState({ table_id: "" });
  
  useEffect(() => {
    async function loadData() {
       try {
         setErrors(null)
        const reservationFetch = await readReservation(newParams, abortController.signal);
        const tablesFetch = await listTables(abortController.signal);
        const freeTables = tablesFetch.filter(table => {
          return table.status === "Free";
        });
        setReservation(reservationFetch);
        setTables(freeTables);
      } catch (error) {
        setErrors(error);
      }
    }
    loadData();
    return () => abortController.abort();
  }, [])

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
      setErrors("Party size cannot exceed table capacity.");
    } else if (!selectedTable) {
      setErrors("Please select a table.")
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
      try {
        console.log("seat.js handling submit", formData, " & ", reservation.reservation_id)
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
    <div>
      <ErrorAlert error={errors} />
      <div>
        <h4>Reservation for:</h4>
        <Reservation reservation={reservation} />
      </div>
      <br />
      <div>
        <h4>Select a table</h4>
        <form onSubmit={handleSubmit}>
          <div>
            <select
              name="table_id"
              onChange={handleChange}
              value={formData.table_id}
            > 
              <option>Choose a Table</option>
              {tableMapper()}
              </select>
              <br />
              <button>Submit</button>
              <button onClick={handleCancel}>Cancel</button>
          </div>
        </form>
      </div>
  </div>
  )
}