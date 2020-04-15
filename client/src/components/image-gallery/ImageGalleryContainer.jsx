import React, { useState, Fragment } from "react";
import { connect } from "react-redux";
import ImageGallery from "react-image-gallery";
import "./ImageGalleryContainer.css";
import { makeStyles } from "@material-ui/core/styles";

//Material UI
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

import Grid from "@material-ui/core/Grid";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import GridListTileBar from "@material-ui/core/GridListTileBar";
import ListSubheader from "@material-ui/core/ListSubheader";
import IconButton from "@material-ui/core/IconButton";
import InfoIcon from "@material-ui/icons/Info";

const useStyles = makeStyles({
  root: {
    maxWidth: 345
  },
  media: {
    height: 140
  }
});

const ImageGalleryContainer = ({ userImages }) => {
  const classes = useStyles();
  const [mainImage, setMainImage] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedSubImages, setSelectedSubImages] = useState([]);

  const pickAsMainImage = () => {
    setMainImage(userImages[currentImageIndex]);
  };

  const addImageToSubArray = () => {
    const currentSubImages = [...selectedSubImages];
    setSelectedSubImages([...currentSubImages, userImages[currentImageIndex]]);
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
      <ImageGallery
        showFullscreenButton={false}
        thumbnailPosition="top"
        items={newUserImages ? newUserImages : []}
        onThumbnailClick={(e, index) => setCurrentImageIndex(index)}
        onBeforeSlide={(index) => setCurrentImageIndex(index)}
      />
      <Grid
        direction="column"
        container
        spacing={1}
        justify="center"
        alignItems="center"
      >
        <Grid
          style={{ textAlign: "center" }}
          container
          spacing={1}
          justify="center"
          direction="row"
          xs={12}
        >
          <Grid xs={3}>
            <Button onClick={() => pickAsMainImage()}>Pick Main</Button>
          </Grid>
          <Grid xs={3}>
            <Button onClick={() => addImageToSubArray()}>Pick Sub</Button>
          </Grid>
        </Grid>
        <Grid xs={12}>
          <Card className={classes.root}>
            <CardActionArea>
              <CardMedia className={classes.media} image={mainImage} />
              <CardContent>
                <Typography
                  gutterBottom
                  variant="h5"
                  component="h2"
                ></Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  This will be your main image
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
        <Grid xs={12}>
          <GridList cellHeight={180} className={classes.gridList}>
            <GridListTile
              key="Subheader"
              cols={2}
              style={{ height: "auto", textAlign: "center" }}
            >
              <ListSubheader component="div">
                Pictures used for mosaic
              </ListSubheader>
            </GridListTile>
            {selectedSubImages &&
              selectedSubImages.map((tile) => (
                <GridListTile key={tile}>
                  <img src={tile} />
                  <GridListTileBar
                    title={"test title"}
                    actionIcon={
                      <IconButton
                        aria-label={`remove`}
                        className={classes.icon}
                      >
                        <InfoIcon />
                      </IconButton>
                    }
                  />
                </GridListTile>
              ))}
          </GridList>
        </Grid>
      </Grid>
    </Fragment>
  );
};

const mapStateToProps = (state) => {
  return {
    userImages: state.auth.images
  };
};

export default connect(mapStateToProps)(ImageGalleryContainer);
