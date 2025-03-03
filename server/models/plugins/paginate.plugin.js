const paginate = (schema) => {
    schema.statics.paginate = async function (filter, options) {
      let sort = '';
      if (options.sortBy) {
        const sortingCriteria = [];
        options.sortBy.split(',').forEach((sortOption) => {
          const [key, order] = sortOption.split(':');
          sortingCriteria.push((order === 'desc' ? '-' : '') + key.toLowerCase()); // Apply toLowerCase()
        });
        sort = sortingCriteria.join(' ');
      } else {
        sort = 'createdAt';
      }
  
      const limit = options.limit && parseInt(options.limit, 10) > 0 ? parseInt(options.limit, 10) : 10;
      const page = options.page && parseInt(options.page, 10) > 0 ? parseInt(options.page, 10) : 1;
      const skip = (page - 1) * limit;
  
      // Convert string filters to case-insensitive and diacritic-insensitive search
      Object.keys(filter).forEach((key) => {
        if (typeof filter[key] === 'string') {
          filter[key] = filter[key].toLowerCase(); // Convert to lowercase before query
        }
      });
  
      const countPromise = this.countDocuments(filter).exec();
      let docsPromise = this.find(filter)
        .collation({ locale: 'en', strength: 1 }) // Case-insensitive + diacritic-insensitive
        .sort(sort)
        .skip(skip)
        .limit(limit);
  
      if (options.populate) {
        options.populate.split(',').forEach((populateOption) => {
          docsPromise = docsPromise.populate(
            populateOption
              .split('.')
              .map((p) => p.toLowerCase()) // Apply toLowerCase() to each populate field
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
  