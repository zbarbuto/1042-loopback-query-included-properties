Sandbox for loopback-datasource-jugger [issue #1042](https://github.com/strongloop/loopback-datasource-juggler/issues/1042)

There is no easy way to query on included properties.

Example queries:

1. Find stores with male customers who have made purchases over $50
2. Find customers from store 10 who have not made any purchases.

Ideally, this should be doable both in code and through rest endpoints easily.

The suggested way of doing it is adding a `required` property to includes that would require the relation to exist for the root model to be found

e.g: Case 1:

```javascript
Store.find({
  include: {
    relation: 'customer',
    required: true,
    scope: { 
      where {
        gender: 'male'
      },
      include: {
        relation: 'order',
        required: true
        scope: {
          where: {
            price {
              gt: 50
            }
          }
        }
      }
    }
  },
});
```

However, this doesn't address case 2.

An alternative solution would be to allow aliasing includes and querying them using the dot syntax similar to SQL:

e.g. Case 1

```javascript
Store.find({
  include: {
    relation: 'customer',
    as: 'c'
    scope: { 
      include: {
        relation: 'order',
        as: 'o'
      }
    }
  },
  where: {
    'c.gender': 'male',
    'c.o.price': {
      gt: 50
    }
  }
});
```