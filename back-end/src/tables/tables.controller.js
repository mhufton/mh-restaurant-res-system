const service = require("./tables.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const hasProperties = require("../errors/hasProperties");
const onlyValidProperties = require("../errors/onlyValidProperties");
const reservationService = require("../reservations/reservations.service");


const VALID_PROPERTIES_POST = [
  "table_name",
  "capacity",
]

const VALID_PROPERTIES_PUT = [
  "reservation_id"
]

function tableNameLength(req, res, next) {
  const { table_name } = req.body.data;
  if (table_name.length > 1) {
    return next();
  } else {
    return next({
      status: 400,
      message: "table_name must be at least 2 characters in length."
    });
  }
}

function hasValidCapacity(req, res, next) {
const capacity = req.body.data.capacity;
if (capacity > 0 && Number.isInteger(capacity)) {
  return next();
}
next({
  status: 400,
  message: `capacity '${capacity}' must be a whole number greater than 0.`,
});
}
  

async function tableExists(req, res, next) {
  const { table_id } = req.params;
  const data = await service.read(table_id);
  if (data) {
    res.locals.table = data;
    return next();
  } else {
    return next({
      status: 404,
      message: `table_id: ${table_id} does not exist.`
    });
  }
}

async function reservationExists(req, res, next) {
  const { reservation_id } = req.body.data;
  const data = await reservationService.read(reservation_id);
  if (data && data.status !== "seated") {
    res.locals.reservation = data;
    return next();
  } else if (data && data.status === "seated") {
    return next({
        status: 400,
        message: `reservation_id: ${reservation_id} is already seated.`,
    });
} else {
    return next({
        status: 404,
        message: `reservation_id: ${reservation_id} does not exist.`,
    });
}
}

// validation middleware: checks that table had sufficient capacity
function tableCapacity(req, res, next) { 
    const { capacity } = res.locals.table;
    const { people } = res.locals.reservation;
    if (capacity >= people) {
        return next();
    } else {
        return next({
            status: 400, 
            message: "Table does not have sufficient capacity."
        });
    }
}

function tableIsFree(req, res, next) {
    const { status } = res.locals.table;
    console.log("TABLE_IS_FREE res.locals.table", res.locals.table)
    console.log("TABLE_IS_FREE status", status)
    if (status.toLowerCase() === "free" || status === false) {
        return next();
    } else {
        return next({
            status: 400, 
            message: "Table is currently occupied."
        });
    }
}

function tableIsOccupied(req, res, next) {
    const { status } = res.locals.table;
    if (status.toLowerCase() === "occupied") {
        return next();
    } else {
        return next({
            status: 400, 
            message: "Table is not occupied."
        });
    }
}

// CRUDL

async function list(req, res) {
  res.json({ data: await service.list() });
}

async function create(req, res) {
    const table = await service.create(req.body.data);
    res.status(201).json({ data: table });
}

async function seat(req, res) {
    const { table } = res.locals;
    const { reservation_id } = res.locals.reservation;
    const { table_id } = req.params;
    const updatedTableData = {
        ...table,
        table_id: table_id,
        reservation_id: reservation_id,
        status: "occupied",
    }
    const updatedTable = await service.seat(updatedTableData);
    // set reservation status to "seated" using reservation id
    const updatedReservation = {
        status: "seated", 
        reservation_id: reservation_id,
    }
    await reservationService.update(updatedReservation);
    res.json({ data: updatedTable });
}

// finish an occupied table
async function finish(req, res) {
    const { table_id } = req.params;
    const { table } = res.locals;
    const updatedTableData = {
        ...table,
        status: "free"
    }
    const updatedTable = await service.finish(updatedTableData);
    // set reservation status to "finished" using reservation id
    const updatedReservation = {
        status: "finished", 
        reservation_id: table.reservation_id,
    }
    await reservationService.update(updatedReservation); 
    res.status(200).json({ data: updatedTable });
}

module.exports = {
    list: asyncErrorBoundary(list),
    create: [
        hasProperties(...VALID_PROPERTIES_POST), 
        onlyValidProperties(...VALID_PROPERTIES_POST, "reservation_id"), 
        tableNameLength,
        hasValidCapacity,
        asyncErrorBoundary(create)],
    seat: [
        hasProperties(...VALID_PROPERTIES_PUT), 
        onlyValidProperties(...VALID_PROPERTIES_PUT), 
        asyncErrorBoundary(tableExists),
        asyncErrorBoundary(reservationExists),
        tableCapacity,
        tableIsFree,
        asyncErrorBoundary(seat),
    ],
    finish: [
        asyncErrorBoundary(tableExists),
        tableIsOccupied,
        asyncErrorBoundary(finish),
    ]
  };