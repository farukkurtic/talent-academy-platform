const objectId = (value, helpers) => {
  if (!value.match(/^[0-9a-fA-F]{24}$/)) {
    return helpers.message('"{{#label}}" must be a valid mongo id');
  }
  return value;
};

const password = (value, helpers) => {
  if (value.length === 0) {
    return helpers.message("password can't be zero");
  }
  return value;
};

module.exports = {
  objectId,
  password,
};
