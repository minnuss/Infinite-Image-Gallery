import React, { useEffect, useState } from 'react';
// https://www.npmjs.com/package/react-infinite-scroll-component
import InfiniteScroll from 'react-infinite-scroll-component'
// https://www.npmjs.com/package/react-responsive-masonry
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"
import './App.css';

// ACCESS KEY FROM .env
const accessKey = process.env.REACT_APP_UNSPLASH_ACCESS_KEY

// REACT MASONRY COLUMN BREAKPOINTS
const columnsCountBreakPoints = { 320: 1, 370: 2, 900: 3, 1200: 4, 1500: 5, 1700: 6, 2000: 7, 2400: 8 };


export default function App() {

  const [images, setImages] = useState([])
  const [page, setPage] = useState(1)
  const [inputValue, setInputValue] = useState('')
  const [arrowTop, setArrowTop] = useState(false)

  useEffect(() => {
    getPhotos()
    //  eslint-disable-next-line
  }, [])

  async function getPhotos() {
    let apiUrl = `https://api.unsplash.com/photos/?`

    if (inputValue) apiUrl = `https://api.unsplash.com/search/photos/?query=${inputValue}`

    apiUrl += `&page=${page}`
    apiUrl += `&client_id=${accessKey}`

    const res = await fetch(apiUrl)
    const data = await res.json()

    // console.log(data)
    const imagesFromApi = data.results ?? data

    if (page === 1) setImages(imagesFromApi)

    setImages((images) => [...images, ...imagesFromApi])
  }

  async function searchPhotos(e) {
    e.preventDefault()

    setPage(1)
    getPhotos()
  }

  // console.log(images)

  function handleRenderArrowTop() {
    // console.log(window.scrollY)
    if (window.scrollY > 700) {
      setArrowTop(true)
    } else {
      setArrowTop(false)
    }
  }

  if (!accessKey) {
    return (
      <>
        <h1>Access key error, API key not found.</h1>
        <a href="https://unsplash.com/documentation" className="error">Sign in for your API access key</a>
      </>
    )
  }

  return (
    <div className="app">
      <h1>Unsplash Infinite Image Gallery!</h1>

      <form onSubmit={searchPhotos}>
        <input
          type="text"
          placeholder="Search Unsplash..."
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
        />
        <button>Search</button>
      </form>
      {/* eslint-disable-next-line */}
      {arrowTop && <a href="#" className="arrow-top"><i class="fas fa-angle-up"></i></a>}

      <InfiniteScroll
        onScroll={handleRenderArrowTop}
        dataLength={images.length} //This is important field to render the next data
        next={() => {
          setPage(prevPage => prevPage + 1)
          getPhotos()
        }}
        hasMore={true}
        loader={<h4>Loading...</h4>}>

        <ResponsiveMasonry
          columnsCountBreakPoints={columnsCountBreakPoints}
        >
          <Masonry gutter={4}>

            {images.map((image, index) => (
              <div
                className="item"
                key={index}>
                <a
                  href={image.urls.regular}
                  target="_blank"
                  rel="noopener noreferrer">
                  <img
                    src={image.urls.small}
                    alt={image.alt_description}
                    className='masonry-content' />
                </a>
              </div>
            ))}

          </Masonry>
        </ResponsiveMasonry >
      </InfiniteScroll >
    </div >
  );
}
