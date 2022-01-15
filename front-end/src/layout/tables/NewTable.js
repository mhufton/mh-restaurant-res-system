import React, { useState } from 'react';
import { useHistory } from 'react-router';

import ErrorAlert from './../ErrorAlert';
import { createTable } from '../../utils/api';
import "./NewTable.css"

export default function NewTable() {
  const history = useHistory();

  const [formData, setFormData] = useState({
    table_name: "",
    capacity: "",
   });
  const [tableErrors, setTableErrors] = useState([])

  const handleChange = ({ target }) => {
    setFormData({
      ...formData,
      [target.name]: target.value,
    })
  }

  const validateTable = () => {
    if (formData.table_name.length < 2) {
      setTableErrors("Table names must be at least 2 characters long.")
    }
    if (formData.capacity < 1) {
      setTableErrors("Table capacity must be at least 1 person.")
    }
  
    if (tableErrors.length > 0) {
      return false
    }
    return true
  }
  
  const submitHandler = (e) => {
    e.preventDefault();
    if (validateTable()) {
      createTable(formData)
        .then(() => history.push(`/dashboard`))
        .catch((error) => setTableErrors(error))
    }
  }

  return (
    <div className="table-container">
      <h1>New Table</h1>
      {tableErrors.length > 0 ? <ErrorAlert errors={tableErrors} /> : null}
      <form name='newTable'
        className="new-table-form"
        onSubmit={submitHandler}
        >
        <label>
          Table Name:
          <input 
            type="text"
            name="table_name"
            id="table_name"
            value={formData.table_name}
            required={true}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          Capacity:
          <input 
            type="number"
            name="capacity"
            id="capacity"
            value={formData.capacity}
            required={true}
            onChange={handleChange}
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
          onClick={() => {
            const confirmBox = window.confirm(
              "If you cancel all information will be lost"
            )
            if (confirmBox === true) {
            }
          }}>
            Cancel
          </button>
      </form>
    </div>
    )
}