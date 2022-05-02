import express from 'express';
import sharpLogger from '../utilities/sharpLogger';
import { promises, accessSync, access, constants } from 'fs';
import path from 'path';
import resize from './resize';

const app = express();
const port = 3000;

app.get(
  '/convert',
  sharpLogger,
  async (
    req: express.Request,
    res: express.Response,
    next: any
  ): Promise<void> => {
    const cwd = path.join(__dirname);
    const makeDir = async () => {
      await promises.mkdir(path.join(cwd, '../../', 'thumbnails'), {
        recursive: true
      });
    };
    // Check if directory exists in the parent directory.
    access(path.join(cwd, '../..', 'thumbnails'), constants.F_OK, (err) => {
      console.log(
        `${path.join(cwd, '../..', 'thumbnails')} directory ${
          err ? 'does not exist' : 'exists'
        }`
      );
      if (err) {
        makeDir();
      }
    });
    const fileName = req.query.filename;
    const width = Number(req.query.width);
    const height = Number(req.query.height);
    const inputFile = fileName + '.jpg';
    const outputFile = `${fileName}_${width}_${height}.jpg`;

    // Check if the requested file and dimensions exist.
    try {
      accessSync(
        path.join(cwd, '../..', 'thumbnails', outputFile),
        constants.R_OK
      );
      console.log('requested file and dimensions exist');
      res
        .status(200)
        .sendFile(
          path.join(cwd, '../..', 'thumbnails', outputFile),
          function (err) {
            if (err) {
              res
                .status(404)
                .send(
                  'Bad Request: Please check the URL/filename and try again...'
                );
              next(err);
            } else {
              console.log(
                'Sent:',
                path.join(cwd, '../..', 'thumbnails', outputFile)
              );
            }
          }
        );
    } catch (err) {
      console.error('requested file and dimensions processing...');
      await resize(inputFile, outputFile, width, height);
      res
        .status(200)
        .sendFile(
          path.join(cwd, '../..', 'thumbnails', outputFile),
          function (err) {
            if (err) {
              res
                .status(404)
                .send(
                  'Bad Request: Please check the URL/filename and try again...'
                );
              next(err);
            } else {
              console.log(
                'Sent:',
                path.join(cwd, '../..', 'thumbnails', outputFile)
              );
            }
          }
        );
    }
  }
);
// start the Express server
app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});

export default app;
