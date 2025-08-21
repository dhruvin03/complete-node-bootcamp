const fs = require('fs');
const express = require('express');

const app = express();
const port = 3000;

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`),
);

app.use(express.json());
app.use((req, res, next) => {
  const start = Date.now();
  const requestTime = new Date().toISOString();

  res.on('finish', () => {
    const end = Date.now();
    const duration = end - start;
    console.log(
      `[INFO] ${requestTime} | ${req.method} ${req.originalUrl} | Status: ${res.statusCode} | ${duration}ms`,
    );
  });

  // When an error happens
  res.on('error', (err) => {
    console.error(
      `[ERROR] ${new Date().toISOString()} | ${req.method} ${req.url} | Error: ${err.message}`,
    );
  });

  next();
});

const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    result: tours.length,
    data: {
      tours,
    },
  });
};

const getTour = (req, res) => {
  const id = parseInt(req.params.id);
  const tour = tours.find((el) => el.id === id);

  if (!tour) {
    return res.status(404).json({
      status: 'failed',
      message: 'Could not find the tour',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

const createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = { id: newId, ...req.body };

  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
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

const updateTour = (req, res) => {
  const id = parseInt(req.params.id);
  const tour = tours.find((el) => el.id === id);

  if (!tour) {
    return res.status(404).json({
      status: 'failed',
      message: 'Could not find the tour to update',
    });
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour: `Tour named ${tour.name} is updated`,
    },
  });
};

const deleteTour = (req, res) => {
  const id = parseInt(req.params.id);
  const tour = tours.find((el) => el.id === id);

  if (!tour) {
    return res.status(404).json({
      status: 'failed',
      message: 'Could not find the tour to delete',
    });
  }
  res.status(204).json({
    status: 'success',
    data: {
      tour: `Tour named ${tour.name} is deleted`,
    },
  });
};

//app.get('/api/v1/tours', getAllTours);
//app.get('/api/v1/tours/:id', getTour);
//app.post('/api/v1/tours', createTour);
//app.patch('/api/v1/tours/:id', updateTour);
//app.delete('/api/v1/tours/:id', deleteTour);

app.route('/api/v1/tours').get(getAllTours).post(createTour);
app
  .route('/api/v1/tours/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
