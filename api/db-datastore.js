'use strict';

// todo: the namespace should be in a config file
const datastore = require('@google-cloud/datastore')({ namespace: 'ryan-lc-db' });

function key(id) {
  return datastore.key(['strings', id]);
}

module.exports.list = async () => {
  let [data] = await datastore.createQuery('strings').select('name').order('name').run();
  data = data.map((val) => val.name);
  return data;
};

module.exports.get = async (id) => {
  const [data] = await datastore.get(key(id));
  if (data && data.val) return data.val;
  return '0';
};

//Creating a new entry with an assigned ID and Value
module.exports.put = async (id, val) => {
  return datastore.save({ key: key(id), data: { name: id, val } });
};

//Posting an entry that will add a value to the existing value
module.exports.post = async (id, val) => {
  const [data] = await datastore.get(key(id));
  if (data && data.val) {
    try {
    val = parseInt(val) + parseInt(data.val);
    } catch(e) {
      console.log('ERROR: Int not Parsed');
    }
  }
  //const [savedData] = datastore.save({ key: key(id), data: { name: id, val } });
  //console.log(savedData);
  const entity = {
        key: key(id),
        data: { name: id, val },
      }
  await datastore.save(entity);
  return val;
};

//Delete an entry from the database based on the ID
module.exports.delete = async (id) => {
  const [data] = await datastore.delete(key(id));
  if (data.indexUpdates > 0) {
    return 'ok';
  }
  return '0';
};
