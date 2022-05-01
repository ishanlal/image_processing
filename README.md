# image_processing

## Functionality

* Accessing the provided URL with image information should successfully resize an image and save it to disk on first access, then pull from disk on subsequent access attempts.
* An error message should be provided to the user when an image has failed to process or does not exist.

## Installation

* Clone `image_processing` repo from GitHub.
* Run `npm install` in package.json folder to install all dependencies and config scripts.

## Run scripts sequence

* > npm run prettier
* > npm run lint
* > npm run test (this command runs both npm run build and npm run jasmine, one after another)
* > npm run start
* > Open a web browser and type URL (sample): `localhost:3000/convert/?filename=fjord&width=200&height=200`
* > Choose resized image height and width to your preferences and insert in above URL.
* > Choose filename for above URL from list of image files available under the images folder.
* > Logger will print the input URL and access date/time info in console window.
