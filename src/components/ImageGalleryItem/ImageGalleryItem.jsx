import PropTypes from 'prop-types';
import { useState } from 'react';
import { Modal } from 'components/Modal';
import {
  GalleryItem,
  GalleryItemImage,
  GalleryItemButton,
} from './ImageGalleryItem.styled';
import { Img } from 'components/Modal/Modal.styled';
import { ThreeDots } from 'react-loader-spinner';

export const ImageGalleryItem = ({ image }) => {
  const [showModal, setShowModal] = useState(false);
  const [loader, setLoader] = useState(true);

  const toggleModal = () => {
    setShowModal(prevS => !prevS);
  };

  const { webformatURL, tags, largeImageURL } = image;

  return (
    <GalleryItem>
      <GalleryItemButton type="button" onClick={toggleModal}>
        <GalleryItemImage className="img" src={webformatURL} alt={tags} />
      </GalleryItemButton>
      {showModal && (
        <Modal onClose={toggleModal}>
          <Img onLoad={() => setLoader(false)} src={largeImageURL} alt={tags} />
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
        </Modal>
      )}
    </GalleryItem>
  );
};

ImageGalleryItem.propTypes = {
  image: PropTypes.shape({
    id: PropTypes.number.isRequired,
    webformatURL: PropTypes.string.isRequired,
    tags: PropTypes.string.isRequired,
    largeImageURL: PropTypes.string.isRequired,
  }).isRequired,
};
