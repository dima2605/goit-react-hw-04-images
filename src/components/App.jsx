import React from 'react';
import Button from './Button/Button';
import ImageGallery from './ImageGallery/ImageGallery';

import SearchBar from './Searchbar/Searchbar';
import fetchImages from 'services/api';
import Loader from './Loader/Loader';
import Modal from './Modal/Modal';
import { useState, useEffect } from 'react';

export default function App() {
  const [inputValue, setInputValue] = useState('');
  const [page, setPage] = useState(1);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPreview, setCurrentPreview] = useState('');
  const [totalHits, setTotalHits] = useState(0);

  const handleFormSubmit = inputValue => setInputValue(inputValue);

  const getInputValue = value => {
    setInputValue(inputValue);
    setImages([]);
    setPage(1);
    setTotalHits(0);
  };

  useEffect(() => {
    if (inputValue) {
      setLoading(true);
      fetchImages(inputValue, page)
        .then(({ data: { hits, totalHits } }) => {
          if (totalHits === 0) {
            alert(`We dont find ${inputValue}`);
          }
          setTotalHits(totalHits);
          setImages(prevImages => {
            return [...prevImages, ...hits];
          });
        })
        .catch(error => console.log(error))
        .finally(() => {
          setLoading(false);
        });
    }
  }, [page, inputValue]);

  const loadMore = () => {
    setPage(page + 1);
  };

  const openModal = url => {
    setCurrentPreview(url);
  };

  const closeModal = () => {
    setCurrentPreview('');
  };

  return (
    <div>
      <SearchBar onSubmit={handleFormSubmit} resetValue={getInputValue} />

      {loading && <Loader />}

      <ImageGallery images={images} openModal={openModal} />
      {images.length < totalHits && <Button onClick={loadMore} />}

      {currentPreview && (
        <Modal closeModal={closeModal} showModal={currentPreview} />
      )}
    </div>
  );
}
