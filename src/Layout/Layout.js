import { withStyles } from '@material-ui/core/styles';
import React from 'react';
import Grid from '@material-ui/core/Grid';
import Left from './Left';
import Right from './Right';
import { containsNumber } from '@turf/turf';

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
            markerList: [],           
        };
        
    }

    onZipChange = (e) => {
        if( e.target.value && e.target.value.length == 5 ){
            this.setState({
                zipcode: e.target.value
            })
        }
    }

    addToLatLngList = (markerList) => {
        //console.log("markerList", markerList);
        
        if( markerList.length ){            
            this.setState({
                markerList: markerList
            })
        }
        
    }

    onClear = (e) => {
        this.setState({
            zipcode: "",
            markerList: [],
        })
    }

    onMarkerDeleteClicked = (id) => {
        const {markerList} = this.state;
        let newMarkerList = [];
        
        for(let i=0; i < markerList.length; i++){            
            if( markerList[i].id != id ){
                newMarkerList.push(markerList[i]);
            }
        }
        
        
        this.setState({
            markerList: newMarkerList
        })
    }

    render(){
        const { classes } = this.props;
        const { zipcode, markerList } = this.state;
        
        return (
            <div className={classes.root}>
                <Grid className={classes.containerWrapper} container spacing={1}>        
                    <Left showZipcode={zipcode} addToLatLngList={this.addToLatLngList} onClear={this.onClear} markerList={markerList} />
                    <Right onZipChange={this.onZipChange} showLatLngList={markerList} onClear={this.onClear} onMarkerDeleteClicked={this.onMarkerDeleteClicked} />
                </Grid>    
            </div>
        );
    }
}

export default withStyles(useStyles)(Layout)

