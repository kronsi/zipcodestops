import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import mapboxgl from 'mapbox-gl/dist/mapbox-gl-csp';
// eslint-disable-next-line import/no-webpack-loader-syntax
import MapboxWorker from 'worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker';
import * as turf from '@turf/turf'
import React from 'react';
import axios from "axios";
import {config} from "../config";
mapboxgl.workerClass = MapboxWorker;
mapboxgl.accessToken = config.mapboxApiKey;

console.log("config", config);

const useStyles = theme => ({
    wrapper: {
        height: "100%",        
    },
    mapContainer: {
        height: "100%",
        paddingTop: 5,
        backgroundColor: "#fff"
    },
})

class Left extends React.Component {
    constructor(props) {
        super(props);
        this.marker = [];
        this.state = {
            lng: 13.401797,
            lat: 52.518898,
            zoom: 11,
            mapload: false,
            zipcode: "",
            zipcodeList: [],
            polygon: [],
            coordinates: {},
            distance: 0.0,
        };
        this.mapContainer = React.createRef();
        this.map = null;
    }

    

    componentDidMount() {
        const { lng, lat, zoom } = this.state;
        this.map = new mapboxgl.Map({
            container: this.mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [lng, lat],
            zoom: zoom
        });

        this.map.on('load',  ()  =>{
            this.setState({
                mapload: true
            })            
        });
         
        this.map.on('move', () => {
            this.setState({
                lng: this.map.getCenter().lng.toFixed(4),
                lat: this.map.getCenter().lat.toFixed(4),
                zoom: this.map.getZoom().toFixed(2)
            });
        });

        this.map.on('click', (e) => {
            const {coordinates} = this.state;
            
            if( coordinates && Object.keys(coordinates).length > 0 ){
                
                const point = turf.point([e.lngLat.lng, e.lngLat.lat]);
                let isIn = false;
                for(let zip in coordinates){
                    var tempFeature = {
                        "type": "Polygon",
                        "coordinates": [coordinates[zip]]
                    };
                    
                    let feature = turf.feature(tempFeature)
                    isIn = turf.booleanContains(feature, point);                    
                    if(isIn){
                        break;
                    }
                }

                if(isIn){
                 
                    const markerId = (this.marker.length == 0 ? 1 : this.marker[this.marker.length - 1].id +1);
                    // create DOM element for the marker
                    let el = document.createElement('div');
                    el.className = 'marker';
                    el.innerHTML = '<span><b>' + (markerId) + '</b></span>';

                    const marker = new mapboxgl.Marker(el)
                    .setLngLat([e.lngLat.lng, e.lngLat.lat])                    
                    .addTo(this.map);                    
                    this.marker.push({
                        id: markerId,
                        item: marker
                    });

                    if(this.props.addToLatLngList ){                    
                        this.props.addToLatLngList(this.marker);                    
                    }
            
                }
            
            }
            else {
                alert("zipcode is missing");
            }
            
        });

        

        

         this.map.addControl(new mapboxgl.NavigationControl());
    }

    componentWillReceiveProps(nextProps) {
        
        const layerId = "zipcode";
        const sourceId = "zipcodeSrc";
        //console.log("nextProps", nextProps);
        //zipcodeList
        if( nextProps.showZipcode && nextProps.showZipcode.length > 0 && nextProps.showZipcode != this.state.zipcode ){
            let { coordinates } = this.state;
            this.setState({
                zipcode: nextProps.showZipcode,
                zipcodeList: nextProps.zipcodeList
            });
            //const zipJson = fs.readFileSync(`../Map/zipcode-geojson/${nextProps.showZipcode}.json`);
            const url = process.env.PUBLIC_URL + 'zipcode-geojson/' +nextProps.showZipcode + ".json";
            //console.log("zipJson", url);
            axios.get(url).then(resp => {

                const layerId = "zipcode" +nextProps.showZipcode;
                const sourceId = "zipcodeSrc" + nextProps.showZipcode; 

                if (this.map.getLayer(layerId)) {
                    this.map.removeLayer(layerId);
                }
                if (this.map.getSource(sourceId)) {
                    this.map.removeSource(sourceId);
                }

                const polygon = resp.data;
                
                coordinates[nextProps.showZipcode] = polygon.geometry.coordinates[0];
                //console.log("polygon", coordinates);
                const distance = this.calculateDistance(coordinates);
                //console.log("distance", distance);

                this.map.addSource(sourceId, {
                    'type': 'geojson',
                    'data': polygon
                });
                var center = turf.center(polygon);
                //console.log("center", center);
                this.setState({
                    polygon: polygon,
                    coordinates: coordinates,
                    distance: distance                   
                })
                this.map.flyTo({
                    center: [
                        center.geometry.coordinates[0],
                        center.geometry.coordinates[1]
                    ],
                    essential: true // this animation is considered essential with respect to prefers-reduced-motion
                });
                
                this.map.addLayer({
                    'id': layerId,
                    'type': 'fill',
                    'source': sourceId,
                    'layout': {},
                    'paint': {
                    'fill-color': '#de8e10',
                    'fill-opacity': 0.2
                    }
                });
                
            });
        }

        if( nextProps.showZipcode == "" ){
            

            if (this.map.getLayer(layerId)) {
                this.map.removeLayer(layerId);
            }
            if (this.map.getSource(sourceId)) {
                this.map.removeSource(sourceId);
            }
            this.setState({
                zipcode: ""
            });

            for (let i = 0; i < this.marker.length; i++) {
                this.marker[i].item.remove();
            }
            this.marker = [];
        }

        if( nextProps.markerList.length != this.marker.length ){
            const {markerList} = nextProps;
            for(let i=0; i < this.marker.length; i++){
                let isItem =markerList.find((mItem => mItem.id == this.marker[i].id));
                if(!isItem){
                    this.marker[i].item.remove();
                }
            }
            this.marker = markerList;
        }
        //delete zipcode from list
        if( nextProps.zipcodeList.length < this.state.zipcodeList.length ){
            
            let {zipcodeList, coordinates} = this.state;
            let deleteZip = ""
            for(let i=0; i < zipcodeList.length; i++){
                if(!nextProps.zipcodeList.includes(zipcodeList[i])){
                    deleteZip = zipcodeList[i];
                }
            }
            const layerId = "zipcode" +deleteZip;
            const sourceId = "zipcodeSrc" + deleteZip;
            delete coordinates[deleteZip];
            const distance = this.calculateDistance(coordinates);
            if (this.map.getLayer(layerId)) {
                this.map.removeLayer(layerId);
            }
            if (this.map.getSource(sourceId)) {
                this.map.removeSource(sourceId);
            }
            this.setState({
                zipcodeList: nextProps.zipcodeList,
                coordinates: coordinates,
                distance: distance
            })
        }
    }

    calculateDistance(coordinates){
        let minLat = null;
        let minLng = null;
        let maxLat = null;
        let maxLng = null;
        let i = 0;
        for(let zipCode in coordinates){
            for(let j=0; j < coordinates[zipCode].length; j++){
            
                if(i == 0 && j == 0){
                    minLat = coordinates[zipCode][j][1];
                    maxLat = coordinates[zipCode][j][1];
                    minLng = coordinates[zipCode][j][0];
                    maxLng = coordinates[zipCode][j][0];
                }

                if( coordinates[zipCode][j][1] < minLat ){
                    minLat = coordinates[zipCode][j][1];
                }

                if( coordinates[zipCode][j][0] < minLng ){
                    minLng = coordinates[zipCode][j][0];
                }
                
                if(coordinates[zipCode][j][1] > maxLat){
                    maxLat = coordinates[zipCode][j][1];
                }

                if(coordinates[zipCode][j][0] > maxLng){
                    maxLng = coordinates[zipCode][j][0];
                }
            }
            i++;
        }
        
        //console.log("minLat", minLat, "minLng", minLng);
        //console.log("maxLat", maxLat, "maxLng", maxLng);
        const options = {units: 'kilometers'};
        return turf.distance([minLng, minLat], [maxLng, maxLat], options);
    }

    render() {
        const { lng, lat, zoom, distance } = this.state;
        const { classes } = this.props;
        return (    
            <Grid item xs={9}>
                <div className={classes.wrapper}>
                    <div className="sidebar">
                        Longitude: {lng} | Latitude: {lat} | Zoom: {zoom} | Distance: {distance.toFixed(2)}
                    </div>
                    <div className={classes.mapContainer} ref={this.mapContainer} />
                </div>
            </Grid>    
        );
    }
}


export default withStyles(useStyles)(Left)
