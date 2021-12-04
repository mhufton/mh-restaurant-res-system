exports.up = function (knex) {
  return knex.schema.createTable("tables", (table) => {
      table.increments("table_id").primary();
      table.integer("reservation_id").unsigned();
      table
        .foreign("reservation_id")
        .references("reservation_id")
        .inTable("reservations")
        .onDelete("CASCADE");
      table.string("table_name").notNullable();
      table.integer("capacity").notNullable();
      table.timestamps(true, true);
      table.string("status").defaultTo("free")
  });
};

  exports.down = function (knex) {
    return knex.schema.dropTable("tables");
  };