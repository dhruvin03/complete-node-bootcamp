const fs = require('fs');

/***** Reading tours file *****/
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`),
);

exports.checkID = (req, res, next, val) => {
  const tour = tours.find((el) => el.id === parseInt(val));

  if (!tour) {
    return res.status(404).json({
      status: 'failed',
      message: 'Could not find the tour',
    });
  }
  next();
};

exports.checkReqBody = (req, res, next) => {
  const { name, price } = req.body;

  if (!name || !price) {
    return res.status(400).json({
      status: 'failed',
      message: 'Could not find the name and price of the tour',
    });
  }
  next()
};

/***** Route Handlers *****/
exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    result: tours.length,
    data: {
      tours,
    },
  });
};

exports.getTour = (req, res) => {
  const id = parseInt(req.params.id);
  const tour = tours.find((el) => el.id === parseInt(id));

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

exports.createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = { id: newId, ...req.body };

  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/../dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      if (err) {
        res.status(500).json({
          status: 'failed',
          data: {
            message: 'Failed to create a new tour',
          },
        });
      }
      res.status(200).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    },
  );
};

exports.updateTour = (req, res) => {
  const id = parseInt(req.params.id);
  const tour = tours.find((el) => el.id === id);
  
  res.status(200).json({
    status: 'success',
    data: {
      tour: `Tour named ${tour.name} is updated`,
    },
  });
};

exports.deleteTour = (req, res) => {
  const id = parseInt(req.params.id);
  const tour = tours.find((el) => el.id === id);

  res.status(204).json({
    status: 'success',
    data: {
      tour: `Tour named ${tour.name} is deleted`,
    },
  });
};
