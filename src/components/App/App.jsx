import { useState, useEffect, useRef } from 'react';
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

export const App = () => {
  const [search, setSearch] = useState('');
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [error, setError] = useState(`We didn't find anything`);
  const [isButtonLoad, setIsButtonLoad] = useState(false);
  const [loader, setLoader] = useState(true);
  const [status, setStatus] = useState(Status.IDLE);
  const isFirstRender = useRef(true);

  const handleSearch = searchWord => {
    scroll();
    setImages([]);
    setPage(1);
    setIsButtonLoad(false);
    setError(`We didn't find anything`);
    setStatus(Status.PENDING);
    setSearch(searchWord.trim());
  };

  const onClickLoad = () => {
    setLoader(true);
    setIsButtonLoad(false);
    setPage(prevS => prevS + 1);
  };

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    featchImages(search, page);
  }, [search, page]);

  const featchImages = async (search, page) => {
    try {
      const response = await getImages(search, page);
      const { hits, totalHits } = response;
      if (hits.length === 0) {
        return setStatus(Status.REJECTED);
      }
      const countLoadedPhotos = hits.length + images.length;
      if (countLoadedPhotos < totalHits) {
        setIsButtonLoad(true);
      } else {
        setIsButtonLoad(false);
      }
      setImages(prevS => [...prevS, ...hits]);
      setStatus(Status.RESOLVED);
      setLoader(false);
    } catch (error) {
      setError(error.message);
      setStatus(Status.REJECTED);
    }
  };

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
          <Text>Error: {error}</Text>
        </>
      )}
      {isButtonLoad && <Button onClickLoad={onClickLoad} />}
    </Container>
  );
};
