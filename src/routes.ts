import express from 'express';
import sharpLogger from '../utilities/sharpLogger';
import { promises, accessSync, access, constants } from 'fs';
import path from 'path';
import resize from './resize';

const routes = express.Router();

routes.get(
  '/',
  sharpLogger,
  async (
    req: express.Request,
    res: express.Response,
    next: any
  ): Promise<void> => {
    const fileName = req.query.filename;
    const width = Number(req.query.width);
    const height = Number(req.query.height);
    if (isNaN(width) || isNaN(height) || height < 0 || width < 0) {
      res
        .status(404)
        .send(
          'Bad Request: Please provide positive numbers greater than 0 for width & height and try again...'
        );
    } else {
      const inputFile = fileName + '.jpg';
      const outputFile = `${fileName}_${width}_${height}.jpg`;
      const cwd = path.join(__dirname);
      const makeDir = async () => {
        await promises.mkdir(path.join(cwd, '../../', 'thumbnails'), {
          recursive: true
        });
      };
      // Check if directory exists in the parent directory.
      access(
        path.join(cwd, '../..', 'thumbnails'),
        constants.F_OK,
        (err) => {
          console.log(
            `${path.join(cwd, '../..', 'thumbnails')} directory ${
              err ? 'does not exist' : 'exists'
            }`
          );
          if (err) {
            makeDir();
          }
        }
      );
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
  }
);

export default routes;
