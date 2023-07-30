export const ErrorHandler = (err, req, res, next) => {
  console.log('some error occurred', err);
  return res.status(500).send({
    message: 'some error occurred'
  });
};
