import express from 'express';

const sharpLogger = (
  req: express.Request,
  res: express.Response,
  next: Function
): void => {
    let url = req.url;
    console.log(`${url} was visited at ${new Date().toUTCString()}`);
    next();
}

export default sharpLogger;
