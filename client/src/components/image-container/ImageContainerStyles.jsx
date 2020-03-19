import { makeStyles } from '@material-ui/core/styles'

export const ImageContainerStyles = makeStyles({
  root: {
    flexGrow: 1
  },
  pictureContainer: {
    marginTop: '1rem'
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
  }
})
