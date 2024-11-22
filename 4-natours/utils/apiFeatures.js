class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObject = { ...this.queryString }; // Creating a hard copy of the query object (Using destructuring and creating new object)

    const excludeFields = ['page', 'sort', 'limit', 'fields'];
    // COMMENT: Removing the fields from the query object
    excludeFields.forEach((el) => delete queryObject[el]);

    // 2B) Advanced Filtering
    let queryString = JSON.stringify(queryObject);
    queryString = queryString.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`,
    );

    // REFERENCE TO HOW TO ADD THE MONGOOSE OPERATOR :::: So Replace gte,gt,lte,lt with $gte,$gt,$lte,$lt using regular expression
    //MONGOOSE OPERATOR:    { difficulty: 'easy', duration: {$gte: 5}}
    //LOGGING OF req.query: { difficulty: 'easy', duration: { gte: '5' } }

    this.query = this.query.find(JSON.parse(queryString));
    // let query = Tour.find(JSON.parse(queryString)); // We do not directly await this. If we do so, we can't use the properties of excludeFields later on

    return this;
  }

  sort() {
    // 2) Sorting
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
      // sort('price ratingsAverage)
    } else {
      this.query = this.query.sort('-createdAt');
    }

    return this;
  }

  limit() {
    // 3) Field Limiting
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }

    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    // Requesting the page with no data is not error so we don't need this code right now
    // if (this.queryString.page) {
    //   const numberOfTours = this.query.countDocuments();
    //   if (skip >= numberOfTours) throw new Error('This page does not exist!');
    // }

    return this;
  }
}

module.exports = APIFeatures;
