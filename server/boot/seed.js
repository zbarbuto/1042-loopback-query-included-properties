var faker = require('faker');
var Promise = require('bluebird');

var NUMBER_OF_STORES = 10;
var CUSTOMERS_PER_STORE = 20;

module.exports = function(app, next) {
  var Store = app.models.store;
  var Customer = app.models.customer;
  var Purchase = app.models.purchase;

  var stores = []
  for(var i = 0; i < NUMBER_OF_STORES; i++) {
    stores.push(Store.create({
      name: faker.address.city()
    }));
  }

  Promise.all(stores)
  .then(function(stores) {
    var customers = [];
    stores.forEach(function(store) {
      for(var i = 0; i < CUSTOMERS_PER_STORE; i++) {
        customers.push(store.customers.create({
          name: faker.name.findName(),
          gender: Math.random() < 0.5 ? 'male' : 'female'
        }));
      }
    });
    return Promise.all(customers);
  })
  .then(function(customers) {
    var purchases = [];
    customers.forEach(function(customer) {
      var roll = Math.random(); 
      while (roll < 0.3) {
        purchases.push(customer.purchases.create({
          purchasePrice: faker.random.number({min: 5, max: 100})
        }));
        roll = Math.random();
      }
    });
    return Promise.all(purchases);
  })
  .then(function() {
    next();
  })
  .catch(next);
}