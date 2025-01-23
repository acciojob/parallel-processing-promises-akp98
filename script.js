//your JS code here. If required.
// const output = document.getElementById("output");
// const btn = document.getElementById("download-images-button");

// const images = [
//   { url: "https://picsum.photos/id/237/200/300" },
//   { url: "https://picsum.photos/id/238/200/300" },
//   { url: "https://picsum.photos/id/239/200/300" },
// ];
// Step 1: Create a function to download images using Promise.all
// HTML Elements
const output = document.getElementById("output");
const loadingDiv = document.getElementById("loading");
const errorDiv = document.getElementById("error");

// Image URLs
const images = [
  { url: "https://picsum.photos/id/237/200/300" },
  { url: "https://picsum.photos/id/238/200/300" },
  { url: "https://picsum.photos/id/239/200/300" },
];

// Step 1: Function to download all images
function downloadImages(imageArray) {
  // Show the loading spinner
  loadingDiv.style.display = 'block';
  output.innerHTML = ''; // Clear the output div
  errorDiv.innerHTML = ''; // Clear previous errors
  
  // Step 2: Create promises for each image download
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
        imgElement.src = URL.createObjectURL(blob); // Create an image URL from the blob
        return imgElement;
      })
      .catch(error => {
        // In case of an error, reject with a detailed message
        throw new Error(`Failed to load image's URL: ${image.url}`);
      });
  });

  // Step 3: Use Promise.all to handle multiple promises
  Promise.all(imagePromises)
    .then(images => {
      loadingDiv.style.display = 'none'; // Hide the loading spinner
      images.forEach(imgElement => {
        output.appendChild(imgElement); // Append the images to the output div
      });
    })
    .catch(error => {
      loadingDiv.style.display = 'none'; // Hide the loading spinner if error occurs
      errorDiv.innerHTML = `<p>Error: ${error.message}</p>`; // Show error message
    });
}

// Step 4: Attach event listener to the download button
const downloadButton = document.getElementById("download-images-button");
downloadButton.addEventListener("click", function () {
  downloadImages(images); // Call the function to start downloading images
});
