'use strict';

class DataCollection {
  constructor(model) {
    this.model = model;
  }

  get(user, id) {
    if (id) {
      return this.model.findOne({ where: { user, id } });
    } else if (user) {
      return this.model.findAll({ where: { user } });
    } else {
      return this.model.findAll();
    }
  }

  create(record) {
    return this.model.create(record);
  }

  update(id, user, data) {
    return this.model
      .findOne({ where: { id, user } })
      .then(record => record.update(data));
  }

  delete(id, user) {
    return this.model.destroy({ where: { id, user } });
  }
}

module.exports = DataCollection;
