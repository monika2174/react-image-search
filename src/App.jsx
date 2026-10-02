import { useState } from "react";
import "./App.css";

function App() {
  const [searchText, setSearchText] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const searchImages = async (pageNumber = 1) => {
    if (!searchText.trim()) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const accessKey = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;
      

      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
          searchText
        )}&page=${pageNumber}&per_page=12`,
        {
          headers: {
            Authorization: `Client-ID ${accessKey}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();

      setImages(data.results);
      setPage(pageNumber);
      setTotalPages(data.total_pages);
    } catch (err) {
      console.error(err);
      setError("Unable to fetch images. Please try again.");
      setImages([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPage(1);
    searchImages(1);
  };

  const handlePrevious = () => {
    if (page > 1) {
      searchImages(page - 1);
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  const handleNext = () => {
    if (page < totalPages) {
      searchImages(page + 1);
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="app">
      <header className="header">
        <h1>Image Search</h1>

        <p>
          Discover beautiful images from around the world
        </p>
      </header>

      <main className="main-content">
        {/* Search Section */}
        <div className="search-container">
          <input
            type="text"
            placeholder="Search for images..."
            className="search-input"
            value={searchText}
            onChange={(event) =>
              setSearchText(event.target.value)
            }
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                handleSearch();
              }
            }}
          />

          <button
            className="search-button"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="loading">
            <div className="spinner"></div>

            <p>Loading images...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="error-message">
            <p>{error}</p>
          </div>
        )}

        {/* Image Grid */}
        {!loading &&
          !error &&
          images.length > 0 && (
            <>
              <div className="image-grid">
                {images.map((image) => (
                  <div
                    className="image-card"
                    key={image.id}
                  >
                    <img
                      src={image.urls.small}
                      alt={
                        image.alt_description ||
                        "Unsplash image"
                      }
                    />

                    <div className="image-overlay">
                      <div className="image-details">
                        <h3>
                          {image.user.name}
                        </h3>

                        <p>
                          {image.alt_description ||
                            "Beautiful photo"}
                        </p>

                        <a
                          href={image.user.links.html}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View Photographer
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="pagination">
                <button
                  className="pagination-button"
                  onClick={handlePrevious}
                  disabled={page === 1 || loading}
                >
                  ← Previous
                </button>

                <span className="page-number">
                  Page {page} of {totalPages}
                </span>

                <button
                  className="pagination-button"
                  onClick={handleNext}
                  disabled={
                    page === totalPages || loading
                  }
                >
                  Next →
                </button>
              </div>
            </>
          )}

        {/* Welcome Message */}
        {!loading &&
          !error &&
          images.length === 0 && (
            <div className="welcome-message">
              <h2>
                Explore the world through images
              </h2>

              <p>
                Search for nature, cities, animals,
                and more.
              </p>
            </div>
          )}
      </main>
    </div>
  );
}

export default App;