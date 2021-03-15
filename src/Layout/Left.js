import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import mapboxgl from 'mapbox-gl/dist/mapbox-gl-csp';
// eslint-disable-next-line import/no-webpack-loader-syntax
import MapboxWorker from 'worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker';
import * as turf from '@turf/turf'
import React from 'react';
import axios from "axios";
mapboxgl.workerClass = MapboxWorker;
mapboxgl.accessToken = 'pk.eyJ1Ijoia3JvbnNpLWdyYXBobWFzdGVycyIsImEiOiJja202cGp0a2QwZWtrMm9tenE5NjA3a2Y1In0.C4gSucoo2-_2tzeUKZeO3A';

 

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
            polygon: [],
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
            const {polygon} = this.state;
            if( polygon && polygon.geometry ){
                const point = turf.point([e.lngLat.lng, e.lngLat.lat]);
                const isIn = turf.booleanContains(polygon, point);
                if(isIn){
                    // create the popup
                    const popup = new mapboxgl.Popup({ offset: 25 }).setText(
                    'Construction on the Washington Monument began in 1848.'
                    );
                    const markerId = (this.marker.length == 0 ? 1 : this.marker[this.marker.length - 1].id +1);
                    // create DOM element for the marker
                    let el = document.createElement('div');
                    el.className = 'marker';
                    el.innerHTML = '<span><b>' + (markerId) + '</b></span>';

                    const marker = new mapboxgl.Marker(el)
                    .setLngLat([e.lngLat.lng, e.lngLat.lat])                    
                    .addTo(this.map);
                    /*
                    setTimeout(() => {
                        marker.remove();
                    }, 3000)                    
                    */
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
        if( nextProps.showZipcode && nextProps.showZipcode.length > 0 && nextProps.showZipcode != this.state.zipcode ){
            const { onClear } = this.props;
            this.setState({
                zipcode: nextProps.showZipcode
            });
            //const zipJson = fs.readFileSync(`../Map/zipcode-geojson/${nextProps.showZipcode}.json`);
            const url = process.env.PUBLIC_URL + 'zipcode-geojson/' +nextProps.showZipcode + ".json";
            //console.log("zipJson", url);
            axios.get(url).then(resp => {

                const layerId = "zipcode";
                const sourceId = "zipcodeSrc";

                if (this.map.getLayer(layerId)) {
                    this.map.removeLayer(layerId);
                }
                if (this.map.getSource(sourceId)) {
                    this.map.removeSource(sourceId);
                }

                const polygon = resp.data;

                this.map.addSource(sourceId, {
                    'type': 'geojson',
                    'data': polygon
                });
                var center = turf.center(polygon);
                //console.log("center", center);
                this.setState({
                    polygon: polygon                    
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
                    'fill-opacity': 0.4
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
    }

    render() {
        const { lng, lat, zoom } = this.state;
        const { classes } = this.props;
        return (    
            <Grid item xs={9}>
                <div className={classes.wrapper}>
                    <div className="sidebar">
                        Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
                    </div>
                    <div className={classes.mapContainer} ref={this.mapContainer} />
                </div>
            </Grid>    
        );
    }
}


export default withStyles(useStyles)(Left)
