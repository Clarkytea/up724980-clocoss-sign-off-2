'use strict';

// The connection to the datastore API through the Google App server.
const datastore = require('@google-cloud/datastore')({ namespace: 'ryan-lc-db' });

// Identify the structure of a Key
function key(id) {
  return datastore.key(['strings', id]);
}

module.exports.list = async () => {
  let [data] = await datastore.createQuery('strings').select('name').order('name').run();
  data = data.map((val) => val.name);
  return data;
};

//returns the value for a provided ID.
module.exports.get = async (id) => {
  const [data] = await datastore.get(key(id));
  if (data && data.val) return `${data.val}`;
  return '0';
};

//Creating a new entry with an assigned ID and Value
module.exports.put = async (id, val) => {
    // Construct and entry object to be inserted into the datastore 
  const entry = {
    key: key(id),
    data: { name: id, val },
  }
  await datastore.save(entry);
  return `${val}`;
};

//Posting an entry that will add a value to the existing value
module.exports.post = async (id, val) => {
  const [data] = await datastore.get(key(id));
  if (data && data.val) {
    try {
      // Add the newly provided int to the existing value for the corresponding ID  
    val = parseInt(val) + parseInt(data.val);
    } catch(e) {
      console.log('ERROR: Int not Parsed');
    }
  }
  // Construct and entry object to be inserted into the datastore 
  const entry = {
        key: key(id),
        data: { name: id, val },
      }
  await datastore.save(entry);
  return `${val}`;
};

//Delete an entry from the database based on the ID
module.exports.delete = async (id) => {
  const [data] = await datastore.delete(key(id));
  //checks to see the entry has been removed. If so, returns the message 'ok'
  if (data.indexUpdates > 0) {
    return 'ok';
  }
  return '0';
};
