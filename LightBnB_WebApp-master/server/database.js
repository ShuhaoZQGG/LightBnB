const properties = require('./json/properties.json');
const users = require('./json/users.json');
const { Pool } = require('pg');

const pool = new Pool({
  user: 'labber',
  password: 'labber',
  host: 'localhost',
  database: 'lightbnb'
});
/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function(email) {
  const queryString = `
    SELECT * 
    FROM users
    WHERE email = $1
  `;
  
  const values = [email];

  return pool.query(queryString,values)
             .then((result) => {
               return result.rows[0]
              })
             .catch((err) => null);
             
}
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  //return Promise.resolve(users[id]);
  const queryString = `
    SELECT * 
    FROM users
    WHERE id = $1
  `;
  
  const values = [id];

  return pool.query(queryString,values)
             .then((result) => {
                return result.rows[0];
              })
             .catch((err) => null);
}
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser =  function(user) {
  const queryString = `
    INSERT INTO users (name, email, password)
    VALUES ($1, $2, $3)
    RETURNING *
  `;

  const values = [user.name, user.email, user.password];

  return pool.query(queryString, values) 
             .then((result) => result.rows)
             .catch((err) => null);
  
}
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  //return getAllProperties(null, 2);
  const queryString = `
  SELECT *
  FROM reservations
  JOIN properties ON properties.id = property_id
  WHERE guest_id = $1
  ORDER BY start_date DESC
  LIMIT $2
  `
  
  const values = [guest_id, limit];

  return pool.query(queryString, values)
             .then((result) => result.rows)
             .catch((err) => console.log(err))
}
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */

 const getAllProperties = function (options, limit = 10) {
  // 1
  const queryParams = [];
  // 2
  let queryString = `
  SELECT properties.*, avg(property_reviews.rating) as average_rating
  FROM properties
  JOIN property_reviews ON properties.id = property_id
  `;

  // 3
  if (options.owner_id) {
    queryParams.push(options.owner_id);
    queryString += `WHERE owner_id = $${queryParams.length} `;
  }

  if (options.city && options.minimum_price_per_night && options.maximum_price_per_night 
    ) {
      queryParams.push(`%${options.city}%`, options.minimum_price_per_night, options.maximum_price_per_night);
      queryString += `WHERE city LIKE $${queryParams.length- 2} AND 
      cost_per_night >= $${queryParams.length-1} AND cost_per_night <=  $${queryParams.length}`;
  } else if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryString += `WHERE city LIKE $${queryParams.length} `;
  } else if (options.minimum_price_per_night && options.maximum_price_per_night) {
    queryParams.push(options.minimum_price_per_night, options.maximum_price_per_night);
    queryString += `WHERE cost_per_night >= $${queryParams.length-1} AND cost_per_night <=  $${queryParams.length}`
  } else if (options.minimum_price_per_night) {
    queryParams.push(options.minimum_price_per_night);
    queryString += `WHERE cost_per_night >= $${queryParams.length}`;
  } else if (options.minimum_price_per_night) {
    queryParams.push(options.maximum_price_per_night);
    queryString += `WHERE cost_per_night <= $${queryParams.length}`;
  }

  if (options.minimum_rating) {
    queryParams.push(options.minimum_rating);
    queryString += `
    GROUP BY properties.id
    HAVING avg(property_reviews.rating) >= $${queryParams.length}
    `
    queryParams.push(limit);
    queryString += `
    ORDER BY cost_per_night
    LIMIT $${queryParams.length};
    `;
  } else {
  // 4
  queryParams.push(limit);
  queryString += `
  GROUP BY properties.id
  ORDER BY cost_per_night
  LIMIT $${queryParams.length};
  `;
  }

  // 5
  // Uncomment for debug purpose
  // console.log(queryString, queryParams); 

  // 6
  return pool.query(queryString, queryParams).then((res) => res.rows);
};
exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  /*
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
  */
  const queryString = `
  INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, 
                          cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms,
                          country, street, city, province, post_code)
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
  RETURNING *;
  `;

  const queryParams = [
    property.owner_id,
    property.title,
    property.description,
    property.thumbnail_photo_url,
    property.cover_photo_url,
    property.cost_per_night,
    property.parking_spaces,
    property.number_of_bathrooms,
    property.number_of_bedrooms,
    property.country,
    property.street,
    property.city,
    property.province,
    property.post_code
                 ]

  return pool.query(queryString, queryParams)
             .then ((result) => {
                console.log(result.rows);
                return result.rows;
              })
              .catch((err) => {
                console.log(err)
              });
}
exports.addProperty = addProperty;
