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

// Strategy Pattern - Base Class for Image Downloading
class ImageDownloadStrategy {
  download(image) {
    throw "Method 'download()' must be implemented";
  }
}

// Concrete Strategy for fetching images via fetch API
class FetchImageDownloadStrategy extends ImageDownloadStrategy {
  download(image) {
    return fetch(image.url)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to load image's URL: ${image.url}`);
        }
        return response.blob();
      })
      .then(blob => {
        const imgElement = document.createElement('img');
        imgElement.src = URL.createObjectURL(blob);
        return imgElement;
      })
      .catch(error => {
        throw new Error(`Failed to load image: ${image.url}`);
      });
  }
}

// Concrete Strategy for downloading images with XMLHttpRequest (as a backup or alternative strategy)
class XHRImageDownloadStrategy extends ImageDownloadStrategy {
  download(image) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', image.url, true);
      xhr.responseType = 'blob';
      xhr.onload = () => {
        if (xhr.status === 200) {
          const imgElement = document.createElement('img');
          imgElement.src = URL.createObjectURL(xhr.response);
          resolve(imgElement);
        } else {
          reject(`Failed to load image: ${image.url}`);
        }
      };
      xhr.onerror = () => reject(`Failed to load image: ${image.url}`);
      xhr.send();
    });
  }
}

// Context class to execute the image downloading strategy
class ImageDownloader {
  constructor(strategy) {
    this.strategy = strategy;
  }

  setStrategy(strategy) {
    this.strategy = strategy;
  }

  downloadImages(imageArray) {
    const imagePromises = imageArray.map(image => this.strategy.download(image));
    return Promise.all(imagePromises);
  }
}

// Step 1: Function to download all images using selected strategy
function downloadImages(imageArray) {
  const fetchStrategy = new FetchImageDownloadStrategy();
  const downloader = new ImageDownloader(fetchStrategy);

  // Show the loading spinner
  loadingDiv.style.display = 'block';
  output.innerHTML = ''; // Clear the output div
  errorDiv.innerHTML = ''; // Clear previous errors
  
  downloader.downloadImages(imageArray)
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

// Step 2: Attach event listener to the download button
const downloadButton = document.getElementById("download-images-button");
downloadButton.addEventListener("click", function () {
  downloadImages(images); // Call the function to start downloading images
});
