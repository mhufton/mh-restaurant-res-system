const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const hasProperties = require("../errors/hasProperties");
const onlyValidProperties = require("../errors/onlyValidProperties");

const REQUIRED_PROPERTIES = [
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people",
]

const VALID_PROPERTIES = [
  ...REQUIRED_PROPERTIES,
  "status",
  "reservation_id", 
  "created_at", 
  "updated_at",
]

let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];


// validation middleware: checks that reservation_date has a valid date value
function dateIsValid(req, res, next) {
  const { reservation_date } = req.body.data;
  const date = Date.parse(reservation_date);
  if (date && date > 0) {
    return next();
  } else {
    return next({
      status: 400,
      message: `reservation_date field formatted incorrectly: ${reservation_date}.`,
    });
  }
}

// validation middleware: checks that reservation_time has a valid date value
function timeIsValid(req, res, next) {
  const { reservation_time } = req.body.data;
  const regex = new RegExp("([01]?[0-9]|2[0-3]):[0-5][0-9]");
  if (regex.test(reservation_time)) {
    return next();
  } else {
    return next({
      status: 400, 
      message: `reservation_time field formatted incorrectly: ${reservation_time}`,
    });
  }
}

// validation middleware: checks that the value of people is a number
function hasValidPeople(req, res, next) {
  const people = req.body.data.people;
  const valid = Number.isInteger(people);
  if (valid && people > 0) {
    return next();
  }
  next({
    status: 400,
    message: `people must be a number larger than 1`,
  });
}

function notInPast(req, res, next) {
  const { reservation_date, reservation_time } = req.body.data;
  const presentDate = Date.now();
  const newReservationDate = new Date(
    `${reservation_date} ${reservation_time}`
  ).valueOf();
  if (newReservationDate > presentDate) {
    return next();
  }
  next({
    status: 400,
    message: `New reservations must be in the future.`,
  });
}

// validation middleware: checks that the reservation_time is during operating hours
function duringOperatingHours(req, res, next) {
  const reservation_time = req.body.data.reservation_time;
  const hours = Number(reservation_time.slice(0, 2));
  const minutes = Number(reservation_time.slice(3, 5));
  const clockTime = hours * 100 + minutes;
  if (clockTime < 1030 || clockTime > 2130) {
    next({
      status: 400,
      message: `Reservation time '${reservation_time}' must be between 10:30 AM and 9:30 PM`,
    });
  } else {
    next();
  }
}

function validDayAndDate(req, res, next) {
  const data = req.body.data;
  const reservationDate = new Date(
    `${data.reservation_date} ${data.reservation_time}`
  );
  let dayofWeek = days[reservationDate.getDay()];
  let timeOfDay = data.reservation_time;

  if (reservationDate < new Date() && dayofWeek === "Tuesday") {
    return next({
      status: 400,
      message:
        "Reservations can only be created for a future date and may not be on Tuesdays",
    });
  }
  if (reservationDate < new Date()) {
    return next({
      status: 400,
      message: "Reservations can only be created for a future date",
    });
  }
  if (dayofWeek === "Tuesday") {
    return next({ status: 400, message: "Restaurant is closed on Tuesdays" });
  }
  if (timeOfDay >= "21:30" || timeOfDay <= "10:30") {
    return next({
      status: 400,
      message: "Reservations must be between 10:30am and 9:30pm ",
    });
  }

  next();
}

// validation middleware: checks that the reservation_date is not a Tuesday
function notTuesday(req, res, next) {
  const { reservation_date } = req.body.data;
  const date = new Date(reservation_date);
  const day = date.getUTCDay();
  if (day === 2) {
    return next({
      status: 400,
      message: "The restaurant is closed on Tuesday.",
    });
  } else {
    return next();
  }
}

// validation middleware: if a status is included when posting a new reservation, the only status allowed is "booked"
function statusBooked(req, res, next) {
  const { status } = req.body.data;
  if (status) {
    if (status === "booked") {
      return next();
    } else {
      return next({
        status: 400, 
        message: `status cannot be set to ${status} when creating a new reservation.`,
      });
    }
  } else {
    return next();
  }
}

// validation middleware: checks if a reservation_id exists
async function reservationExists(req, res, next) {
  const { reservationId } = req.params;
  const data = await service.read(reservationId);
  if (data) {
    res.locals.reservation = data;
    return next();
  } else {
    return next({
      status: 404,
      message: `reservation_id: ${reservationId} does not exist.`
    });
  }
}

// validation middleware: checks that status type is valid
function statusIsValid(req, res, next) {
  const { status } = req.body.data;
  const validValues = ["booked", "seated", "finished", "cancelled"];
  if (validValues.includes(status)) {
    res.locals.status = status;
    return next();
  } else {
    return next({
      status: 400, 
      message: `invalid status: ${status}. Status must be one of these options: ${validValues.join(", ")}`,
    });
  }
}

// validation middleware: checks that status is not currently finished
function statusIsNotFinished(req, res, next) {
  const { reservation } = res.locals;
  if (reservation.status === "finished") {
    return next({
      status: 400, 
      message: "A finished reservation cannot be updated.", 
    });
  } else {
    return next();
  }
}

async function list(req, res) {
  const { date, viewDate, mobile_number } = req.query;
  
  if (date) {
    const data = await service.listByDate(date);
    res.json({ data });
  } else if (viewDate) {
    const data = await service.listByDate(viewDate);
    res.json({ data });
  } else if (mobile_number) {
    const data = await service.listByPhone(mobile_number);
    res.json({ data });
  } else {
    const data = await service.list();
    res.json({ data });
  }
}

// creates a reservation
async function create(req, res) {
  const reservation = await service.create(req.body.data);
  res.status(201).json({ data: reservation });
}

// reads a reservation by reservation_id
function read(req, res) {
  const { reservation } = res.locals;
  res.json({ data: reservation });
}

// updates a reservation status
async function updateStatus(req, res) {
  const { reservation, status } = res.locals;
  const updatedReservationData = {
    ...reservation,
    status: status,
  }
  const updatedReservation = await service.update(updatedReservationData);
  res.json({ data: updatedReservation });
}

async function updateReservation(req, res) {
  const { reservation } = res.locals;
  const { data } = req.body;
  const updatedReservationData = {
    ...reservation,
    ...data,
  }
  const updatedReservation = await service.update(updatedReservationData);
  res.json({ data: updatedReservation });
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  create: [
    hasProperties(...REQUIRED_PROPERTIES), 
    onlyValidProperties(...VALID_PROPERTIES), 
    dateIsValid,
    timeIsValid,
    hasValidPeople,
    // notTuesday,
    // notInPast,
    validDayAndDate,
    duringOperatingHours,
    statusBooked,
    asyncErrorBoundary(create),
  ],
  read: [
    asyncErrorBoundary(reservationExists), 
    read,
  ],
  updateStatus: [
    hasProperties("status"), 
    onlyValidProperties("status"), 
    asyncErrorBoundary(reservationExists), 
    statusIsValid,
    statusIsNotFinished,
    asyncErrorBoundary(updateStatus),
  ],
  updateReservation: [
    hasProperties(...REQUIRED_PROPERTIES), 
    onlyValidProperties(...VALID_PROPERTIES), 
    asyncErrorBoundary(reservationExists), 
    dateIsValid,
    timeIsValid,
    validDayAndDate,
    hasValidPeople,
    duringOperatingHours,
    asyncErrorBoundary(updateReservation),
  ]
};