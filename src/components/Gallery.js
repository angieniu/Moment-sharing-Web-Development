import React, {Component} from 'react';
import PropTypes from 'prop-types';
import GridGallery from 'react-grid-gallery';

//PropTypes类型校验
class Gallery extends Component {
    static propTypes = {
        images: PropTypes.arrayOf(
            PropTypes.shape({
                user: PropTypes.string.isRequired,
                src: PropTypes.string.isRequired,
                thumbnail: PropTypes.string.isRequired,
                caption: PropTypes.string,
                thumbnailWidth: PropTypes.number.isRequired,
                thumbnailHeight: PropTypes.number.isRequired
            })
        ).isRequired
    }

    //string template `${image.user}`
    render() {
        const images = this.props.images.map((image) => {
            return {
                ...image,
                customOverlay: (
                    <div className="gallery-thumbnail">
                        <div>{`${image.user}: ${image.caption}`}</div>
                    </div>
                ),
            };
        });

        return (
            <div className="gallery">
                <GridGallery
                    backdropClosesModal
                    images={images}
                    enableImageSelection={false}/>
            </div>

        );
    }
}
export default Gallery;
