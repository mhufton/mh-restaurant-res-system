import React, { useState } from 'react';
import { useHistory } from 'react-router';

import ErrorAlert from './../ErrorAlert';
import { createTable } from '../../utils/api';

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
  console.log("formData.table_name.length", formData.table_name.length)

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
      console.log("NewTable - creating new table")
      createTable(formData)
        .then(() => console.log("data!"))
        .then(() => history.push(`/dashboard`))
        .catch((error) => setTableErrors(error))
    }
  }

  return (
    <div>
      <h1>New Reservations</h1>
      {tableErrors.length > 0 ? <ErrorAlert errors={tableErrors} /> : null}
      <form name='newTable' onSubmit={submitHandler}>
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
            }
          }}>
            Cancel
          </button>
      </form>
    </div>
    )
}