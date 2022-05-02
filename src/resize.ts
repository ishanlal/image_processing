import sharp from 'sharp';
import path from 'path';

const resize = async (
  inFileName: string,
  outFileName: string,
  reqWidth: number,
  reqHeight: number
): Promise<void> => {
  const cwd = path.join(__dirname);
  const inputPath = path.join(cwd, '../..', 'images', inFileName);
  const outputPath = path.join(cwd, '../..', 'thumbnails', outFileName);
  await sharp(inputPath)
    .resize(reqWidth, reqHeight)
    .toFile(outputPath)
    .catch((err) => {
      console.log(err);
    });
};

export default resize;
