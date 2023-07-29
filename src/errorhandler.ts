export const ErrorHandler = (err, req, res) => {
  console.log('some error occurred', err);
  return res.status(500).json({
    message: 'some error occurred'
  });
};
