import { makeStyles } from '@material-ui/core/styles'

export const ImageContainerStyles = makeStyles({
  root: {
    flexGrow: 1
  },
  pictureContainer: {
    marginTop: '5rem'
  },
  histogram: {
    margin: '2rem'
  },
  sidebar: {
    display: 'flex',
    flexGrow: 1,
    flexDirection: 'column',
    height: '100%'
  },
  drawer: {
    width: 150,
    flexGrow: 1
    // flexShrink: 0
  },
  drawerPaper: {
    width: 150
  },
  arrowIcon: {
    margin: 20
  },
  undoIcon: {
    color: 'red',
    margin: 20
  },
  imageUploader: {
    position: 'absolute',
    top: '30%',
    bottom: '50%'
  },
  firstTitle: {
    fontSize: '30px'
  },
  secondTitle: {
    fontSize: '50px',
    fontWeight: '800',
    color: '#641eed'
  },
  firstTitle2: {
    fontSize: '20px',
    fontWeight: '500',
    marginBottom: '2rem'
  },
  secondTitle2: {
    fontSize: '30px',
    fontWeight: '800',
    color: '#641eed',
    marginBottom: '2rem'
  },
  typingText: {
    fontSize: '25px',
    color: '#505050'
  },
  logo: {
    display: 'flex',
    width: '50px'
  }
})
