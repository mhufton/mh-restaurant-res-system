import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import ErrorAlert from '../ErrorAlert';
import { finishTable, updateStatus } from '../../utils/api';

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
            await updateStatus({
              status: "finished",
              reservation_id: table.reservation_id
            })
            setErrors(null)
            history.go()
          } catch (errors) {
            setErrors(errors)
          }
        }
        finishTableAndUpdateRes();
        return () => abortController.abort();
      }
    }

    return (
      <div>
        <div>
          {errors ? <ErrorAlert error={errors} /> : null}
        </div>
        <div key={index} >
          <p>Table: {table.table_name} -  {table.capacity}</p>
          <p data-table-id-status={`${table.table_id}`}>
          Status: {table.status} 
          </p>
          {table.status.toLowerCase() === "occupied" 
            ? <button 
              onClick={finishHandler}
              data-table-id-finish={table.table_id}
              >
                Finish
              </button> 
            : null}
        </div>
      </div>
    )
  })
}