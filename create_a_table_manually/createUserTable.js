const { db } = require('../services/workingDB');

(async function () {

  try {

    await db.schema.createTable('users', function (table) {
      table.increments('id');
      table.string('name').notNullable();
      table.string('email').notNullable().unique();
      table.string('password').notNullable().defaultTo('password');
      // table.timestamp('created_at').notNullable().defaultTo(db.fn.now());
      table.timestamps(true, true);
    });

    await db.destroy();

    console.log("users jadval yaratildi!");


  } catch (err) {
    console.log('users jadvalni yaratishda xatolik: ', err);
  }

})();