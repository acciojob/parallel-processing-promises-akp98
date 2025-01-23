//your JS code here. If required.
// const output = document.getElementById("output");
// const btn = document.getElementById("download-images-button");

// const images = [
//   { url: "https://picsum.photos/id/237/200/300" },
//   { url: "https://picsum.photos/id/238/200/300" },
//   { url: "https://picsum.photos/id/239/200/300" },
// ];
// Step 1: Create a function to download images using Promise.all
function downloadImages(imageArray) {
  const loadingDiv = document.getElementById('loading');
  const outputDiv = document.getElementById('output');
  const errorDiv = document.getElementById('error');

  // Show loading spinner while images are being downloaded
  loadingDiv.style.display = 'block';
  outputDiv.innerHTML = ''; // Clear previous output
  errorDiv.innerHTML = '';  // Clear previous error message

  // Step 2: Create an array of promises for each image
  const imagePromises = imageArray.map(image => {
    return fetch(image.url)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to load image's URL: ${image.url}`);
        }
        return response.blob();
      })
      .then(blob => {
        const imgElement = document.createElement('img');
        imgElement.src = URL.createObjectURL(blob); // Create an object URL from the blob
        return imgElement;
      })
      .catch(error => {
        // If an error occurs, reject the promise
        throw new Error(`Failed to load image's URL: ${image.url}`);
      });
  });

  // Step 3: Use Promise.all to handle all the image download promises
  Promise.all(imagePromises)
    .then(images => {
      // Step 4: Hide loading spinner and show downloaded images
      loadingDiv.style.display = 'none';
      images.forEach(imgElement => {
        outputDiv.appendChild(imgElement); // Append each image to the output div
      });
    })
    .catch(error => {
      // If any image fails to download, show an error message
      loadingDiv.style.display = 'none';
      errorDiv.innerHTML = `<p>Error: ${error.message}</p>`;
    });
}

// Step 5: Test the function with an array of image URLs
const images = [
  { url: 'https://via.placeholder.com/150' },
  { url: 'https://via.placeholder.com/200' },
  { url: 'https://via.placeholder.com/250' },
  { url: 'https://invalid-url.com/image.jpg' }, // An invalid URL to test error handling
];

// Call the function to download images
downloadImages(images);

