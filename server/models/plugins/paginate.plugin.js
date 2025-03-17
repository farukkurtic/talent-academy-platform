const paginate = (schema) => {
  schema.statics.paginate = async function (filter, options) {
    let sort = "";
    if (options.sortBy) {
      const sortingCriteria = [];
      options.sortBy.split(",").forEach((sortOption) => {
        const [key, order] = sortOption.split(":");
        sortingCriteria.push((order === "desc" ? "-" : "") + key.toLowerCase());
      });
      sort = sortingCriteria.join(" ");
    } else {
      sort = "createdAt";
    }

    const limit =
      options.limit && parseInt(options.limit, 10) > 0
        ? parseInt(options.limit, 10)
        : 10;
    const page =
      options.page && parseInt(options.page, 10) > 0
        ? parseInt(options.page, 10)
        : 1;
    const skip = (page - 1) * limit;

    Object.keys(filter).forEach((key) => {
      if (typeof filter[key] === "string") {
        filter[key] = filter[key].toLowerCase();
      }
    });

    const countPromise = this.countDocuments(filter).exec();
    let docsPromise = this.find(filter)
      .collation({ locale: "en", strength: 1 })
      .sort(sort)
      .skip(skip)
      .limit(limit);

    if (options.populate) {
      options.populate.split(",").forEach((populateOption) => {
        docsPromise = docsPromise.populate(
          populateOption
            .split(".")
            .map((p) => p.toLowerCase())
            .reverse()
            .reduce((a, b) => ({ path: b, populate: a }))
        );
      });
    }

    docsPromise = docsPromise.exec();

    return Promise.all([countPromise, docsPromise]).then((values) => {
      const [totalResults, results] = values;
      const totalPages = Math.ceil(totalResults / limit);
      const result = {
        results,
        page,
        limit,
        totalPages,
        totalResults,
      };
      return Promise.resolve(result);
    });
  };
};

module.exports = paginate;
