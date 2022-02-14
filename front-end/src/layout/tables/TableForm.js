import React, { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import ErrorAlert from '../ErrorAlert';
import { readTable, createTable, updateTable } from "../../utils/api";

export default function TableForm() {
  const history = useHistory();
  const params = useParams();
  const table_id = Number(params.table_id);
  console.log("table_id", table_id)

  const [formData, setFormData] = useState({
    table_name: "",
    capacity: "",
   });
  const [errors, setErrors] = useState(null);

  React.useEffect(() => {
    const abortController = new AbortController();
    if (table_id) {
      async function loadTable() {
        try {
          console.log("trying to load table")
          const loadedTable = await readTable(table_id, abortController.signal);
          setFormData(loadedTable);
        } catch (error) {
          setErrors(error)
        }
      }
      loadTable();
    }
    return () => abortController.abort();
  }, [])
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!table_id) {
      createTable(formData)
        .then(() => history.push(`/dashboard`))
        .catch((error) => setErrors(error))
    }
    if (table_id) {
      updateTable(formData)
        .then(() => history.push(`/dashboard`))
        .catch((error) => setErrors(error))
    }
  }

  const handleChange = ({ target }) => {
    setFormData({
      ...formData,
      [target.name]: target.value,
    })
  }

  return (
    <div className="table-container">
      {table_id ? <h1>Edit Table</h1> : <h1>New Table</h1>}
      <ErrorAlert error={errors} />
      <form onSubmit={handleSubmit} className="new-table-form">
        <label>
          Table Name:
          <input 
            type="text"
            name="table_name"
            id="table_name"
            onChange={handleChange}
            value={formData.table_name}
            required={true}
          />
        </label>
        <br />
        <label>
          Capacity:
          <input 
            type="number"
            name="capacity"
            id="capacity"
            onChange={handleChange}
            value={formData.capacity}
            required={true}
          />
        </label>
        <br />
        <button 
          type="submit"
          className="submit-button"
          >Submit</button>
        <button 
          type='cancel' 
          className='cancel-button'
          onClick={() => history.go(-1)}>
            Delete
          </button>
      </form>
    </div>
  )
}