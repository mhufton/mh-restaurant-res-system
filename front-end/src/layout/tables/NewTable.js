import React, { useState } from 'react';
import { useHistory } from 'react-router';

import ErrorAlert from './../ErrorAlert';
import { createTable } from '../../utils/api';
import "./NewTable.css"

export default function NewTable() {
  const history = useHistory();

  const [formData, setFormData] = useState({
    table_name: "",
    capacity: "0",
   });
  const [tableErrors, setTableErrors] = useState([])
  const handleChange = ({ target }) => {
    setFormData({
      ...formData,
      [target.name]: target.value,
    })
  }
  
  const submitHandler = (e) => {
    e.preventDefault();
    console.log("formData", formData)
    // const newTable = {
    //   ...formData,
    //   capacity: Number(formData.capacity)
    // }
    // console.log("capacity type:", typeof(Number(newTable.capacity)))
    createTable(formData)
      .then(() => history.push(`/dashboard`))
      .catch((error) => setTableErrors(error))
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
          onClick={() => history.go(-1)}>
            Cancel
          </button>
      </form>
    </div>
    )
}