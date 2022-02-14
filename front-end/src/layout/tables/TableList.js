import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import ErrorAlert from '../ErrorAlert';
import { finishTable } from '../../utils/api';
import "./TableList.css"

export default function TableList({ tables }) {
  const history = useHistory();

  const [errors, setErrors] = useState(null);

  return tables.map((table, index) => {
    const abortController = new AbortController();
    const finishHandler = (e) => {
      e.preventDefault();
      const confirmBox = window.confirm(
        "Is this table ready to seat new guests? This cannot be undone."
      );
      if (confirmBox === true) {
        async function finishTableAndUpdateRes() {
          try {
            await finishTable(table.table_id)
            setErrors(null)
            history.go(0)
          } catch (errors) {
            setErrors(errors)
          }
        }
        finishTableAndUpdateRes();
        return () => abortController.abort();
      }
    }

    return (
      <div key={table.table_id} className="table-list-container">
        <div>
          {errors ? <ErrorAlert error={errors} /> : null}
        </div>
        <div className="table-card">
          <div className="table-card-info">
            <p>Table: {table.table_name} -  {table.capacity}</p>
            <p data-table-id-status={table.table_id}>
            Status: {table.reservation_id ? "Occupied" : "Free"} 
            </p>
            
          </div>
          <div className="table-buttons">
            {table.reservation_id
              ? <button 
                onClick={finishHandler}
                data-table-id-finish={table.table_id}
                className="finish-table-button"
                type="submit"
                >
                  Finish
                </button> 
              : <a href={`/tables/${table.table_id}/edit`}>
                  <button className="edit-table-button">Edit</button>
                </a>}
          </div>
        </div>
      </div>
    )
  })
}