if(process.env.NODE_ENV === 'production'){
  module.exports = {mongoURI: 'mongodb://romaine:Vertis123456@ds235378.mlab.com:35378/vertistimesheet-prod'}
} else {
  module.exports = {mongoURI: 'mongodb://localhost/timesheet-dev'}
}