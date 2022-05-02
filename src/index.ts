import express from 'express';
import routes from './routes';

const app = express();
const port = 3000;

app.use('/convert', routes);

// start the Express server
app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});

export default app;
