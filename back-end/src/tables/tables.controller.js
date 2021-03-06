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
async function tableCapacity(req, res, next) {
  const { reservation, table } = res.locals;
  if (table.capacity >= reservation.people) {
    return next();
  }
  next({
    status: 400,
    message: `table capacity '${table.capacity}' is smaller than group size '${reservation.people}'.`,
  });
}

function tableIsFree(req, res, next) {
  const table = res.locals.table;
  if (!table.reservation_id) {
    return next();
  }
  next({
    status: 400,
    message: `table_id '${table.table_id}' is occupied by reservation_id '${table.reservation_id}'.`,
  });
}

function tableIsOccupied(req, res, next) {
  const table = res.locals.table;
  if (table.reservation_id) {
    return next();
  }
  next({
    status: 400,
    message: `table_id '${table.table_id}' is not occupied.`,
  });
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
  const { reservation_id } = req.body.data;
  const table_id = req.params.table_id;
  const data = await service.seat(reservation_id, table_id);
  res.json({ data });
}

async function finish(req, res) {
  const { table_id, reservation_id } = res.locals.table;
  const data = await service.finish(table_id, reservation_id);
  res.status(200).json({ data });
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