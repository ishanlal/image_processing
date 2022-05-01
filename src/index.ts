import express from 'express';
import sharpLogger from '../utilities/sharpLogger';
import { promises, accessSync, access, constants } from 'fs';
import sharp from 'sharp';
import path from 'path';

const app = express();
const port = 3000;

const resize = async (
  inFileName: string,
  outFileName: string,
  reqWidth: number,
  reqHeight: number
) => {
  const cwd = path.join(__dirname);
  const inputPath = path.join(cwd, '..', 'images', inFileName);
  const outputPath = path.join(cwd, '..', 'thumbnails', outFileName);
  await sharp(inputPath)
    .resize(reqWidth, reqHeight)
    .toFile(outputPath)
    .catch((err) => {
      console.log(err);
    });
};
app.get('/convert', sharpLogger, async (req, res, next) => {
  const cwd = path.join(__dirname);
  const makeDir = async () => {
    await promises.mkdir(`thumbnails`, { recursive: true });
  };
  // Check if directory exists in the parent directory.
  access(path.join(cwd, '..', 'thumbnails'), constants.F_OK, (err) => {
    console.log(
      `${path.join(cwd, '..', 'thumbnails')} directory ${
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
    accessSync(path.join(cwd, '..', 'thumbnails', outputFile), constants.R_OK);
    console.log('requested file and dimensions exist');
    res
      .status(200)
      .sendFile(path.join(cwd, '..', 'thumbnails', outputFile), function (err) {
        if (err) {
          res
            .status(404)
            .send(
              'Bad Request: Please check the URL/filename and try again...'
            );
          next(err);
        } else {
          console.log('Sent:', path.join(cwd, '..', 'thumbnails', outputFile));
        }
      });
  } catch (err) {
    console.error('requested file and dimensions processing...');
    await resize(inputFile, outputFile, width, height);
    res
      .status(200)
      .sendFile(path.join(cwd, '..', 'thumbnails', outputFile), function (err) {
        if (err) {
          res
            .status(404)
            .send(
              'Bad Request: Please check the URL/filename and try again...'
            );
          next(err);
        } else {
          console.log('Sent:', path.join(cwd, '..', 'thumbnails', outputFile));
        }
      });
  }
});
// start the Express server
app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});

export default app;
