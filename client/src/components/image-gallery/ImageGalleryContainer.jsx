import React from 'react'
import { connect } from 'react-redux'
import ImageGallery from 'react-image-gallery';
import './ImageGalleryContainer.css'


const ImageGalleryContainer = ({ userImages }) => {
    const newUserImages = userImages && userImages.map(i => {
        return {
            original: i,
            thumbnail: i
        }
    })
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
