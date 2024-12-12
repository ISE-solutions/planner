import * as React from 'react';
import { IconButton, TextField, Grow, withStyles } from '@material-ui/core';
import { Clear } from '@material-ui/icons';

const defaultSearchStyles = (theme) => ({
  main: {
    display: 'flex',
    flex: '1 0 auto',
  },
  searchText: {
    flex: '0.8 0',
  },
  clearIcon: {
    '&:hover': {
      color: theme.palette.error.main,
    },
  },
});

class CustomSearchRender extends React.Component<any> {
  private rootRef = null;
  private searchField = null;

  public handleTextChange = (event) => {
    this.props.onSearch(event.target.value);
  };

  public componentDidMount() {
    document.addEventListener('keydown', this.onKeyDown, false);
  }

  public componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeyDown, false);
  }

  public onKeyDown = (event) => {
    if (event.keyCode === 27) {
      this.props.onHide();
    }
  };

  public render() {
    const { classes, options, onHide, searchText } = this.props;

    return (
      <Grow appear in={true} timeout={300}>
        <div className={classes.main} ref={(el) => (this.rootRef = el)}>
          <TextField
            className={classes.searchText}
            InputProps={{
              'aria-label': options.textLabels.toolbar.search,
            }}
            value={searchText || ''}
            onChange={this.handleTextChange}
            fullWidth={true}
            inputRef={(el) => (this.searchField = el)}
          />
          <IconButton className={classes.clearIcon} onClick={onHide}>
            <Clear />
          </IconButton>
        </div>
      </Grow>
    );
  }
}

export default withStyles(defaultSearchStyles)(CustomSearchRender);
