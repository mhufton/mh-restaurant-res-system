import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { listReservations, listTables } from "../utils/api";
import { today, previous, next } from "../utils/date-time"
import useQuery from "../utils/useQuery"
import ErrorAlert from "../layout/ErrorAlert";
import ReservationsList from "../layout/Reservations/ReservationsList";
import TableList from "../layout/tables/TableList";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ setReservation_id, date }) {
  // if there's a date query in the URL, use that instead of the default of "today"
  const dateQuery = useQuery().get("date");
  if (dateQuery) {
    date = dateQuery;
  }

  const [reservations, setReservations] = useState([]);
  const [tables, setTables] = useState([]);
  const [dashboardError, setDashboardError] = useState([]);
  

  // formats the date variable to be human readable
  const dateObj = new Date(`${date} PDT`);
  const dateString = dateObj.toDateString();

  // load the reservations by date
  useEffect(() => {
    const abortController = new AbortController();

    async function loadDashboard() {
      try {
        setDashboardError([]);
        const reservationDate = await listReservations({ date }, abortController.signal);
        setReservations(reservationDate);
      } catch (error) {
        setReservations([]);
        setDashboardError([error.message]);
      }
    }
    loadDashboard();
    return () => abortController.abort();
  }, [date]);
  useEffect(() => {
    const abortController = new AbortController();
    async function loadTables() {
      try { 
        setDashboardError(null);
        const tableList = await listTables(abortController.signal);
        setTables(tableList);
      } catch (error) {
        setTables([]);
        setDashboardError(error);
      }
    }
    loadTables();
    return () => abortController.abort();
  }, [])
 
  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Date: {date}</h4>
      </div>
      {/* <div>
        <button onClick={handlePrevious}>Previous</button>
        <button onClick={handleToday}>Today</button>
        <button onClick={handleNext}>Next</button>
      </div> */}
      <div>
        <Link to={`dashboard?date=${previous(date)}`}>
          <button>Previous</button>
        </Link>
        <Link to={`dashboard?date=${today()}`}>
          <button>Today</button>
        </Link>
        <Link to={`dashboard?date=${next(date)}`}>
          <button>Next</button>
        </Link>
      </div>
      <div>
        <div>
          <ErrorAlert error={dashboardError} />
        </div>
        <div>
          <h4>Reservations</h4>
          {reservations.length > 0 || reservations === null
            ? <ReservationsList reservations={reservations} setReservation_id={setReservation_id} />
            : null
          }
        </div>
        <div>
          <h4>Tables:</h4>
          <TableList tables={tables} />
        </div>
      </div>
    </main>
  );
}

export default Dashboard;
