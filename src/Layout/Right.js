
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Badge from '@material-ui/core/Badge';


const useStyles = theme => ({
    form: {
        '& > *': {
          margin: theme.spacing(1),
          width: '25ch',
          position: "relative",
          top: "10px;"
        },
      }
});

class Right extends React.Component {
    constructor(props) {
        super(props);
        // make sure the "this" variable keeps its scope
        
    }

    

    render() {
        const { classes } = this.props;
        const {onZipChange, showLatLngList} = this.props;
        
        let listItems = [];
        for(let i = 0; i < showLatLngList.length; i++){
            listItems.push(
                <ListItem 
                    key={i}>  
                    {`${showLatLngList[i].lat}, ${showLatLngList[i].lng};`}
                </ListItem>
            );
        }
        
        return (    
            <Grid item xs={3}>
                <form className={classes.form} noValidate autoComplete="off">
                <Badge badgeContent={showLatLngList.length} color="primary">
                    <TextField id="standard-basic" label="Standard" onChange={onZipChange} />
                </Badge>
                    
                </form>
                <List component="nav" aria-label="main mailbox folders">
                    {listItems}
                </List>
               
            </Grid>  
        );
    }
}

export default withStyles(useStyles)(Right)

