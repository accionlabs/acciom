import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import { lighten } from '@material-ui/core/styles/colorManipulator';
import { TextField } from '@material-ui/core';
import Clear from '@material-ui/icons/Clear';
import Search from '@material-ui/icons/Search';

const styles = makeStyles(theme => ({
    root: {
      paddingRight: theme.spacing.unit,
    },
    spacer: {
      flex: '1 1 100%',
    },
    title: {
      flex: '0 0 auto',
    },
    textField: {
      marginLeft: '0px',
      marginRight: '10px',
      
      width: 200,
      height:'auto !important'
    },
    startIcon:{
     paddingBottom:'10px'
    },
  }));
  


  function TableToolbar(props){
    const classes = styles();
    const { handleSearch, handleClear, search } = props;
    return (
      <Toolbar className={classes.root}>
        <div className={classes.title}>
        <TextField
          id="search"
          placeholder="Search"
          type="search"
          className={classes.textField}
          margin="normal"
          onChange ={handleSearch}
          value ={search}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start"
               className={classes.startIcon}>
                <Search />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                {search? 
                <IconButton
                  edge="end"
                  onClick={handleClear}
                >
                <Clear />
                </IconButton>:null}
               
              </InputAdornment>
            ),
          }}
        />
        </div>
        <div className={classes.spacer} />
      </Toolbar>
    );
  };
  
  
  export default TableToolbar;