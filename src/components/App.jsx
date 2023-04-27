import React from 'react';
import Button from './Button/Button';
import ImageGallery from './ImageGallery/ImageGallery';

import { SearchBar } from './Searchbar/Searchbar';
import fetchImages from 'services/api';
import Loader from './Loader/Loader';
import Modal from './Modal/Modal';

export class App extends React.Component {
  state = {
    inputValue: '',
    page: 1,
    images: [],
    loading: false,
    currentPreview: '',
    totalHits: 0,
  };

  quantityImg = 0;

  handleFormSubmit = inputValue => {
    this.setState({ inputValue });
  };

  getInputValue = value => {
    this.setState({ inputValue: value, images: [], page: 1, totalHits: 0 });
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevState.inputValue !== this.state.inputValue) {
      this.setState({ page: 1, images: [], loading: false });
      this.getImages(this.state.inputValue);
    }

    if (
      prevState.page !== this.state.page &&
      prevState.inputValue === this.state.inputValue
    ) {
      this.getImages(this.state.inputValue);
    }
  }

  getImages = key => {
    this.setState({ loading: 'true' });
    fetchImages(key, this.state.page)
      .then(({ data: { hits, totalHits } }) => {
        if (totalHits === 0) {
          alert(`We dont find ${this.state.inputValue}`);
        }
        this.setState(prevState => {
          return {
            totalHits,
            images: [...prevState.images, ...hits],
          };
        });
      })
      .catch(error => console.log(error))
      .finally(() => {
        return this.setState({ loading: false });
      });
  };

  loadMore = () => {
    this.setState(prevState => {
      return {
        page: prevState.page + 1,
      };
    });
  };

  openModal = url => {
    this.setState({ currentPreview: url });
  };

  closeModal = () => {
    this.setState({ currentPreview: '' });
  };

  render() {
    const { loading, images, currentPreview, totalHits } = this.state;
    return (
      <div>
        <SearchBar
          onSubmit={this.handleFormSubmit}
          resetValue={this.getInputValue}
        />

        {loading && <Loader />}

        <ImageGallery images={images} openModal={this.openModal} />
        {images.length < totalHits && <Button onClick={this.loadMore} />}

        {currentPreview && (
          <Modal closeModal={this.closeModal} showModal={currentPreview} />
        )}
      </div>
    );
  }
}
