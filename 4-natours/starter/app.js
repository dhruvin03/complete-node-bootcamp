const fs = require('fs');
const express = require('express');

const app = express();
app.use(express.json());
const port = 3000;

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`),
);

app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    result: tours.length,
    data: {
      tours,
    },
  });
});

app.post('/api/v1/tours', (req, res) => {
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
          tour: newTour
        },
      });
    },
  );
});

app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
