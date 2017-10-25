exports.DATABASE_URL = process.env.DATABASE_URL ||
global.DATABASE_URL ||
'mongodb://dev:dev@ds231205.mlab.com:31205/mongoose-blog-api';
exports.PORT = process.env.PORT || 8080;