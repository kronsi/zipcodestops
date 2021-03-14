
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import React from 'react';
import Badge from '@material-ui/core/Badge';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';


const useStyles = theme => ({
    form: {
        '& > *': {
          margin: theme.spacing(1),
          width: '25ch',
          position: "relative",
          top: "10px;"
        },
      },
      container: {
        maxHeight: 600,
      },
});

class Right extends React.Component {
    constructor(props) {
        super(props);
        // make sure the "this" variable keeps its scope
        this.state = {
            zipcode: "",          
        };        
    }

    onZipChange = (e) => {
        const {onZipChange} = this.props;
        if( e.target.value && e.target.value.length == 5 ){
            this.setState({
                zipcode: e.target.value
            })
            onZipChange(e);
        }
        
    }

    onCopy = (e) => {
        let textToCopy = "ZipCode\tLat\tLng\n";
        const { zipcode } = this.state;
        const {showLatLngList} = this.props;
        for(let i = 0; i < showLatLngList.length; i++){
            textToCopy += zipcode + "\t" + showLatLngList[i].lat + "\t" + showLatLngList[i].lng + "\n";
        }
        navigator.clipboard.writeText(textToCopy)
    }

    onClear = (e) => {
        this.state = {
            zipcode: "",          
        };
        const {onClear} = this.props;
        onClear(e);
    }
    

    render() {
        const { classes } = this.props;
        const {showLatLngList} = this.props;
        const { zipcode } = this.state;
        
        let listItems = [];
        for(let i = 0; i < showLatLngList.length; i++){
            listItems.push(
                <TableRow key={i}>                    
                    <TableCell align="left">{zipcode}</TableCell>
                    <TableCell align="left">{showLatLngList[i].lat}</TableCell>
                    <TableCell align="left">{showLatLngList[i].lng}</TableCell>
                    <TableCell align="right"></TableCell>
                </TableRow>
            );
        }
        
        return (    
            <Grid item xs={3}>
                <form className={classes.form} noValidate autoComplete="off">                                                        
                    <Grid container spacing={3}>                        
                        <Grid item xs={4}>
                            <TextField id="standard-basic" label="Standard" onChange={this.onZipChange} />  
                        </Grid>
                        <Grid item xs={4}>
                            <Button variant="contained" onClick={this.onCopy}>
                                Copy                                
                            </Button> 
                        </Grid>          
                        <Grid item xs={4}>
                            <Button variant="contained" onClick={this.onClear}>
                                Clear                                
                            </Button> 
                        </Grid>  
                    </Grid>                      
                </form>
                <TableContainer  className={classes.container} component={Paper}>
                <Table stickyHeader aria-label="simple table">
                    <TableHead>
                    <TableRow>                        
                        <TableCell>
                            ZipCode                            
                        </TableCell>
                        <TableCell align="left">Lat</TableCell>
                        <TableCell align="left">Lng</TableCell>
                        <TableCell>
                            <Badge badgeContent={showLatLngList.length} color="primary"></Badge>
                        </TableCell>                     
                    </TableRow>
                    </TableHead>
                    <TableBody>                    
                        {listItems}                    
                    </TableBody>
                </Table>
                </TableContainer>                            
            </Grid>  
        );
    }
}

export default withStyles(useStyles)(Right)

