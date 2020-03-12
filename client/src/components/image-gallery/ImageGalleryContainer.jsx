import React from 'react'
import { connect } from 'react-redux'
import ImageGallery from 'react-image-gallery';
import './ImageGalleryContainer.css'

const images = [
    {
        original: 'https://picsum.photos/id/1018/1000/600/',
        thumbnail: 'https://picsum.photos/id/1018/250/150/',
    },
    {
        original: 'https://picsum.photos/id/1015/1000/600/',
        thumbnail: 'https://picsum.photos/id/1015/250/150/',
    },
    {
        original: 'https://picsum.photos/id/1019/1000/600/',
        thumbnail: 'https://picsum.photos/id/1019/250/150/',
    },
];

const ImageGalleryContainer = ({ userImages }) => {
    const newUserImages = userImages && userImages.map(i => {
        return {
            original: i,
            thumbnail: i
        }
    })

    console.log(newUserImages)
    return (
        <ImageGallery showFullscreenButton={false} thumbnailPosition='top' items={newUserImages ? newUserImages : []} />
    )
}

const mapStateToProps = state => {
    return {
        userImages: state.auth.images
    }
}

export default connect(mapStateToProps)(ImageGalleryContainer)
