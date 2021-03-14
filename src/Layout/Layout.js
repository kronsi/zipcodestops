import { withStyles } from '@material-ui/core/styles';
import React from 'react';
import Grid from '@material-ui/core/Grid';
import Left from './Left';
import Right from './Right';

const useStyles = theme => ({
  root: {
    flexGrow: 1,
    height: "100%",
  },
  containerWrapper: {
      height: "100%",
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
});

class Layout extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            zipcode: "",
            latLngList: [],           
        };
        
    }

    onZipChange = (e) => {
        if( e.target.value && e.target.value.length == 5 ){
            this.setState({
                zipcode: e.target.value
            })
        }
    }

    addToLatLngList = (e) => {
        if( e.lngLat ){
            let {latLngList} = this.state;
            console.log("e.lngLat", e.lngLat)
            latLngList.push(e.lngLat);
            
            this.setState({
                latLngList: latLngList
            })
        }
    }

    onClear = (e) => {
        this.setState({
            zipcode: "",
            latLngList: [],
        })
    }

    render(){
        const { classes } = this.props;
        const { zipcode, latLngList } = this.state;
        console.log(classes);
        return (
            <div className={classes.root}>
                <Grid className={classes.containerWrapper} container spacing={1}>        
                    <Left showZipcode={zipcode} addToLatLngList={this.addToLatLngList} onClear={this.onClear} />
                    <Right onZipChange={this.onZipChange} showLatLngList={latLngList} onClear={this.onClear} />
                </Grid>    
            </div>
        );
    }
}

export default withStyles(useStyles)(Layout)

