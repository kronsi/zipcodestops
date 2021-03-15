
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
import DeleteIcon from '@material-ui/icons/Delete';


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
        let textToCopy = "Id\tZipCode\tLat\tLng\n";
        const { zipcode } = this.state;
        const {showLatLngList} = this.props;
        for(let i = 0; i < showLatLngList.length; i++){
            textToCopy += showLatLngList[i].id + "\t" + zipcode + "\t" + showLatLngList[i].item._lngLat.lat + "\t" + showLatLngList[i].item._lngLat.lng + "\n";
        }
        //console.log("textToCopy", textToCopy);
        //navigator.clipboard.writeText(textToCopy);
        this.copyToClipboard(textToCopy);
    }

    copyToClipboard(textToCopy) {
        // navigator clipboard api needs a secure context (https)
        if (navigator.clipboard && window.isSecureContext) {
            // navigator clipboard api method'
            return navigator.clipboard.writeText(textToCopy);
        } else {
            // text area method
            let textArea = document.createElement("textarea");
            textArea.value = textToCopy;
            // make the textarea out of viewport
            textArea.style.position = "fixed";
            textArea.style.left = "-999999px";
            textArea.style.top = "-999999px";
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            return new Promise((res, rej) => {
                // here the magic happens
                document.execCommand('copy') ? res() : rej();
                textArea.remove();
            });
        }
    }

    onClear = (e) => {
        this.state = {
            zipcode: "",          
        };
        const {onClear} = this.props;
        onClear(e);
    }

    onDeleteClick = (e) => {        
        const {onMarkerDeleteClicked} = this.props;
        onMarkerDeleteClicked(e.target.innerText);
    }
    

    render() {
        const { classes } = this.props;
        const {showLatLngList} = this.props;
        const { zipcode } = this.state;
        
        let listItems = [];

        
        for(let i = 0; i < showLatLngList.length; i++){
            listItems.push(
                <TableRow key={i}>
                    <TableCell align="left">
                        <Button key={"buttonId" + i} variant="contained" color="secondary" startIcon={<DeleteIcon />} onClick={this.onDeleteClick} >{showLatLngList[i].id}</Button>
                    </TableCell>
                    <TableCell align="left">{zipcode}</TableCell>
                    <TableCell align="left">{showLatLngList[i].item._lngLat.lat}</TableCell>
                    <TableCell align="left">{showLatLngList[i].item._lngLat.lng}</TableCell>
                    <TableCell></TableCell>               
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
                            <TableCell width="15px">Id</TableCell>
                            <TableCell width="15px">Zip</TableCell>
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
                <Grid item xs={12}>
                    <Badge badgeContent={showLatLngList.length} color="primary"></Badge>
                </Grid>                            
            </Grid>  
        );
    }
}

export default withStyles(useStyles)(Right)

