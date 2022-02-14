import React, { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import ErrorAlert from '../ErrorAlert';
import { readTable, createTable, updateTable, deleteTable } from "../../utils/api";
import './TableForm.css'

export default function TableForm() {
  const history = useHistory();
  const params = useParams();
  const table_id = Number(params.table_id);

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
      const updatedTable = {
        ...formData,
        capacity: Number(formData.capacity)
      }
      updateTable(updatedTable)
        .then(() => history.push(`/dashboard`))
        .catch((error) => setErrors(error))
    }
  }

  const handleDelete = (e) => {
    e.preventDefault();
    if (window.confirm("Do you want to delete this table? This cannot be undone.")) {
      async function destroyTable() {
        try {
          deleteTable(table_id)
            .then(() => history.push(`/dashboard`))
            .catch((err) => setErrors(err))
        } catch (err) {
          setErrors(err);
        }
      }
      destroyTable();
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
        <div className="table-form-btn-container">
          <button 
            type="submit"
            className="submit-button"
            >Submit</button>
          {table_id ?
            <div>
              <button 
                type='delete' 
                className='delete-button'
                onClick={handleDelete}>
                  Delete
              </button>
              <button
                className='table-form-cancel-button'
                >
                Cancel
              </button>
            </div>
            :
            <button
              onClick={() => history.goBack()}
              className='table-form-cancel-button'
            >Cancel</button>
          }
        </div>
      </form>
    </div>
  )
}