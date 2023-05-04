import { Component } from 'react';
import { getImages } from 'services/api';
import { Searchbar } from 'components/Searchbar';
import { ImageGallery } from 'components/ImageGallery';
import { Button } from 'components/Button';
import { Container, Text } from './App.styled';
import { scroll } from 'utils/scroll';
import { MagnifyingGlass, ThreeDots } from 'react-loader-spinner';

const Status = {
  IDLE: 'idle',
  PENDING: 'pending',
  RESOLVED: 'resolved',
  REJECTED: 'rejected',
};

export class App extends Component {
  state = {
    search: '',
    images: [],
    totalHits: 0,
    page: 1,
    error: `We didn't find anything`,
    isButtonLoad: false,
    loader: false,
    status: Status.IDLE,
  };

  async componentDidUpdate(prevProp, prevState) {
    const { search, page } = this.state;
    if (prevState.search !== search || prevState.page !== page) {
      this.featchImages(search, page);
    }
  }

  featchImages = async (search, page) => {
    try {
      const response = await getImages(search, page);
      const { hits, totalHits } = response;
      if (hits.length === 0) {
        return this.setState({ status: Status.REJECTED });
      }
      const countLoadedPhotos = hits.length + this.state.images.length;
      if (countLoadedPhotos < totalHits) {
        this.setState({ isButtonLoad: true });
      } else {
        this.setState({ isButtonLoad: false });
      }
      this.setState(prevS => ({
        images: [...prevS.images, ...hits],
        totalHits: totalHits,
        status: Status.RESOLVED,
      }));
    } catch (error) {
      this.setState({ error: error.message, status: Status.REJECTED });
    }
  };

  handleSearch = searchWord => {
    scroll();
    this.setState({
      images: [],
      search: searchWord.trim(),
      page: 1,
      status: Status.PENDING,
      isButtonLoad: false,
      error: `We didn't find anything`,
    });
  };

  onClickLoad = async () => {
    this.setState(prevS => ({ page: prevS.page + 1 }));
  };

  render() {
    const { status, images, isButtonLoad, loader } = this.state;
    const { handleSearch, onClickLoad } = this;
    return (
      <Container>
        <Searchbar onSubmit={handleSearch} />
        {status === 'idle' && <Text>Enter a keyword and click search</Text>}
        {status === 'resolved' && (
          <>
            <ImageGallery images={images} />
            {loader && (
              <ThreeDots
                height="80"
                width="80"
                radius="9"
                color="#9fa9b5"
                ariaLabel="three-dots-loading"
                wrapperStyle={{ marginLeft: 'auto', marginRight: 'auto' }}
                wrapperClassName=""
                visible={true}
              />
            )}
          </>
        )}
        {status === 'pending' && (
          <MagnifyingGlass
            visible={true}
            height="200"
            width="200"
            ariaLabel="MagnifyingGlass-loading"
            wrapperStyle={{ marginLeft: 'auto', marginRight: 'auto' }}
            wrapperClass="MagnifyingGlass-wrapper"
            glassColor="#fff"
            color="#9fa9b5"
          />
        )}
        {status === 'rejected' && (
          <>
            <Text>Sorry something went wrong!</Text>
            <Text>Error: {this.state.error}</Text>
          </>
        )}
        {isButtonLoad && <Button onClickLoad={onClickLoad} />}
      </Container>
    );
  }
}
