const apiKey = 'abc'; // Replace with your NASA API key

 // Replace with your NASA API key

    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    const currentImageContainer = document.getElementById('current-image-container');
    const currentImage = document.getElementById('current-image');
    const currentImageExplanation = document.getElementById('current-image-explanation');
    const searchHistory = document.getElementById('search-history');

    function getCurrentImageOfTheDay() {
      const currentDate = new Date().toISOString().split('T')[0];
      fetch(`https://api.nasa.gov/planetary/apod?api_key=${apiKey}&date=${currentDate}`)
        .then(response => response.json())
        .then(data => {
          if (data.media_type === 'image') {
            currentImage.src = data.url;
          } else {
            currentImage.src = '';
          }
          currentImageExplanation.textContent = data.explanation;
        })
        .catch(error => {
          console.error('Error fetching current image:', error);
          currentImage.src = '';
          currentImageExplanation.textContent = 'Error fetching image.';
        });
    }

    // function getImageOfTheDay(date) {
    //   fetch(`https://api.nasa.gov/planetary/apod?api_key=${apiKey}&date=${date}`)
    //     .then(response => response.json())
    //     .then(data => {
    //       if (data.media_type === 'image') {
    //         currentImage.src = data.url;
    //       } else {
    //         currentImage.src = '';
    //       }
    //       currentImageExplanation.textContent = data.explanation;
    //       saveSearch(date);
    //       addSearchToHistory();
    //     })
    //     .catch(error => {
    //       console.error('Error fetching image for date:', date, error);
    //       currentImage.src = '';
    //       currentImageExplanation.textContent = 'Error fetching image.';
    //     });
    // }

    function getImageOfTheDay(date) {
        const cachedImage = localStorage.getItem(`nasa-image-${date}`);
      
        if (cachedImage) {
          const imageData = JSON.parse(cachedImage);
          console.log(`Loaded image from cache for ${date}`);
          currentImage.src = imageData.url;
          currentImageExplanation.textContent = imageData.explanation;
        } else {
          fetch(`https://api.nasa.gov/planetary/apod?api_key=${apiKey}&date=${date}`)
            .then(response => response.json())
            .then(data => {
              if (data.media_type === 'image') {
                currentImage.src = data.url;
              } else {
                currentImage.src = '';
              }
              currentImageExplanation.textContent = data.explanation;
              localStorage.setItem(`nasa-image-${date}`, JSON.stringify(data));
              console.log(`Fetched image from API for ${date}`);
            })
            .catch(error => {
              console.error('Error fetching image for date:', date, error);
              currentImage.src = '';
              currentImageExplanation.textContent = 'Error fetching image.';
            });
        }
      }
      
      

    function saveSearch(date) {
      let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
      searchHistory.push(date);
      localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    }

    function addSearchToHistory() {
      const searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
      
      if (searchHistory.length === 0) {
        searchHistory.textContent = 'No search history yet.';
      } else {
        searchHistory.forEach(date => {
          const listItem = document.createElement('li');
          listItem.textContent = date;
          listItem.addEventListener('click', () => getImageOfTheDay(date));
          searchHistory.appendChild(listItem);
        });
      }
      searchHistory.textContent = ''; // Clear any previous history
    }

    searchForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const date = searchInput.value;
      if (date) {
        getImageOfTheDay(date);
      }
    });

    // Call functions on page load
    getCurrentImageOfTheDay();
    addSearchToHistory(); // This ensures s