import React, { useState, Fragment } from "react";
import { connect, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import ImageGallery from "react-image-gallery";
import "./ImageGalleryContainer.css";
import { makeStyles } from "@material-ui/core/styles";
import { buildMosaic } from "../../store/actions/imgAction";

//Material UI
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Fab from "@material-ui/core/Fab";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import GridListTileBar from "@material-ui/core/GridListTileBar";
import ListSubheader from "@material-ui/core/ListSubheader";
import IconButton from "@material-ui/core/IconButton";
import InfoIcon from "@material-ui/icons/Info";

const useStyles = makeStyles((theme) => ({
  root: {},
  media: {
    height: 140
  },
  selectButton: {
    backgroundColor: "#641eed",
    color: "#fff",
    "&:hover": {
      backgroundColor: "#fff",
      color: "#641eed"
    }
  },
  mosaicBar: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    overflow: "hidden",
    backgroundColor: theme.palette.background.paper,
    margin: "5rem 10rem"
  },
  gridList: {
    flexWrap: "nowrap",
    // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
    transform: "translateZ(0)"
  },
  title: {
    color: theme.palette.primary.light
  },
  titleBar: {
    background:
      "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)"
  },
  backButton: {
    backgroundColor: "#641eed",
    color: "white",
    "&:hover": {
      backgroundColor: "#fff",
      color: "#641eed"
    }
  },
  mosaicTile: {
    "&:hover": {
      cursor: "pointer",
      opacity: ".7"
    }
  }
}));

const ImageGalleryContainer = ({ userImages, mosaicImages }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [mainImage, setMainImage] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const buildMosaicImage = () => {
    setMainImage(userImages[currentImageIndex]);
    dispatch(buildMosaic(mainImage));
  };

  const newUserImages =
    userImages &&
    userImages.map((i) => {
      return {
        original: i,
        thumbnail: i
      };
    });
  return (
    <Fragment>
      <Link to="/">
        <Fab className={classes.backButton} aria-label="add">
          <ArrowBackIcon fontSize={"medium"} />
        </Fab>
      </Link>
      <Grid
        container
        direction="column"
        container
        spacing={1}
        justify="space-between"
        alignItems="center"
        xs={12}
      >
        <Grid
          style={{ textAlign: "center", margin: 10 }}
          container
          spacing={1}
          justify="center"
          direction="row"
          xs={12}
        >
          <Grid xs={3}>
            <Button
              className={classes.selectButton}
              variant="contained"
              onClick={() => buildMosaicImage()}
            >
              Make Mosaic
            </Button>
          </Grid>
        </Grid>
        <ImageGallery
          showFullscreenButton={false}
          items={newUserImages ? newUserImages : []}
          onThumbnailClick={(e, index) => setCurrentImageIndex(index)}
          onBeforeSlide={(index) => setCurrentImageIndex(index)}
          showPlayButton={false}
        />

        <Grid xs={12} container directjustify="center">
          <div className={classes.mosaicBar}>
            <GridList cellHeight={350} className={classes.gridList} cols={2.5}>
              {mosaicImages &&
                mosaicImages.map((tile, i) => (
                  <GridListTile
                    className={classes.mosaicTile}
                    onClick={() => window.open(tile, "_blank")}
                    key={i}
                  >
                    <img src={tile} className={classes.mosaicTile} />} />
                  </GridListTile>
                ))}
            </GridList>
          </div>
        </Grid>
      </Grid>
    </Fragment>
  );
};

const mapStateToProps = (state) => {
  console.log(state.auth);
  return {
    userImages: state.auth.images,
    mosaicImages: state.auth.mosaicImages
  };
};

export default connect(mapStateToProps)(ImageGalleryContainer);
