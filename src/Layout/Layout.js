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
            lastZipcode: "",
            zipcodeList: [],
            markerList: [], 
            randomMarker: 0,
        };
        
    }

    onZipChange = (e) => {
        if( e.target.value && e.target.value.length == 5 ){
            const {zipcodeList} = this.state;
            if( !zipcodeList.includes(e.target.value) ){
                zipcodeList.push(e.target.value);
            }
            this.setState({
                lastZipcode: e.target.value,
                zipcodeList: zipcodeList
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
            lastZipcode: "",
            zipcodeList: [],
            markerList: [],
        })
    }

    onRandom = (counter) => {
        this.setState({
            randomMarker:counter
        })
    }

    onDeleteLatLngClick = (id) => {
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

    onDeleteZipCodeClick = (zipcode) => {
        let {zipcodeList} = this.state;
        
        let newZipcodeList = [];
        for(let i=0; i < zipcodeList.length; i++){
            if(zipcodeList[i] != zipcode){
                newZipcodeList.push(zipcodeList[i]);
            }
        }
        this.setState({
            zipcodeList: newZipcodeList
        })
    }

    render(){
        const { classes } = this.props;
        const { lastZipcode, markerList, zipcodeList, randomMarker } = this.state;
        
        return (
            <div className={classes.root}>
                <Grid className={classes.containerWrapper} container spacing={1}>        
                    <Left 
                        showZipcode={lastZipcode} 
                        zipcodeList={zipcodeList} 
                        addToLatLngList={this.addToLatLngList} 
                        onClear={this.onClear} 
                        markerList={markerList}
                        randomMarker={randomMarker}
                         />
                    <Right 
                        onZipChange={this.onZipChange} 
                        showLatLngList={markerList} 
                        onClear={this.onClear} 
                        onDeleteLatLngClick={this.onDeleteLatLngClick}  
                        onDeleteZipCodeClick={this.onDeleteZipCodeClick}
                        onRandom={this.onRandom}
                        />
                </Grid>    
            </div>
        );
    }
}

export default withStyles(useStyles)(Layout)

