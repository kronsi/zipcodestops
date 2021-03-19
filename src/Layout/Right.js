
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

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';


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
    listView: {
        width: '100%',
        
        backgroundColor: theme.palette.background.paper,
        position: 'relative',
        overflow: 'auto',
        maxHeight: 200,
    },
    listSection: {
        backgroundColor: 'inherit',
      },
    ul: {
        backgroundColor: 'inherit',
        padding: 0,
    },
});

class Right extends React.Component {
    constructor(props) {
        super(props);
        // make sure the "this" variable keeps its scope
        this.state = {
            lastZipcode: "",
            zipcodeList: []
        };        
    }

    onZipChange = (e) => {
        const {onZipChange} = this.props;
        if( e.target.value && e.target.value.length == 5 ){
            const {zipcodeList} = this.state;
            if( !zipcodeList.includes(e.target.value) ){
                zipcodeList.push(e.target.value);
            }
            this.setState({
                lastZipcode: e.target.value,
                zipcodeList: zipcodeList
            })
            onZipChange(e);
        }
        
    }

    onCopy = (e) => {
        let textToCopy = "Id\tZipCode\tLat\tLng\n";
        const { lastZipcode } = this.state;
        const {showLatLngList} = this.props;
        for(let i = 0; i < showLatLngList.length; i++){
            textToCopy += showLatLngList[i].id + "\t" + lastZipcode + "\t" + showLatLngList[i].item._lngLat.lat + "\t" + showLatLngList[i].item._lngLat.lng + "\n";
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
        this.setState ({
            lastZipcode: "",
            zipcodeList: [],          
        });
        const {onClear} = this.props;
        onClear(e);
    }

    onDeleteLatLngClick = (id) => {        
        const {onDeleteLatLngClick} = this.props;
        //console.log("onDeleteLatLngClick", id);
        onDeleteLatLngClick(id);
    }

    onDeleteZipCodeClick = (zipcode) => {
        const {onDeleteZipCodeClick} = this.props;
        let {zipcodeList} = this.state;
        //console.log("onDeleteZipCodeClick", zipcode);
        let newZipcodeList = [];
        for(let i=0; i < zipcodeList.length; i++){
            if(zipcodeList[i] != zipcode){
                newZipcodeList.push(zipcodeList[i]);
            }
        }
        this.setState({
            zipcodeList: newZipcodeList
        })
        onDeleteZipCodeClick(zipcode);
    }
    

    render() {
        const { classes } = this.props;
        const {showLatLngList} = this.props;
        const { lastZipcode, zipcodeList } = this.state;
        
        let tableListItems = [];        
        for(let i = 0; i < showLatLngList.length; i++){
            tableListItems.push(
                <TableRow key={i}>
                    <TableCell align="left">
                        <Button key={"buttonId" + i} variant="contained" color="secondary" startIcon={<DeleteIcon />} onClick={() => this.onDeleteLatLngClick(showLatLngList[i].id)} >{showLatLngList[i].id}</Button>
                    </TableCell>
                    <TableCell align="left">{lastZipcode}</TableCell>
                    <TableCell align="left">{showLatLngList[i].item._lngLat.lat}</TableCell>
                    <TableCell align="left">{showLatLngList[i].item._lngLat.lng}</TableCell>
                    <TableCell></TableCell>               
                </TableRow>
            );
        }

        let zipItems = [];        
        for(let i = 0; i < zipcodeList.length; i++){
            zipItems.push(
                <ListItem key={i}>
                        <ListItemText>{zipcodeList[i]}</ListItemText>
                        <Button key={"zipbuttonId" + i} variant="contained" color="secondary" onClick={ () => this.onDeleteZipCodeClick(zipcodeList[i])} >
                            <DeleteIcon />
                        </Button>
                </ListItem>
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
                <List className={classes.listView}>                
                    {zipItems}                
                </List>
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
                            {tableListItems}                    
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

