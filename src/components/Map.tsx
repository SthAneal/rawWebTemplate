import GoogleMapReact from 'google-map-react';
import { MdLocationOn } from 'react-icons/md';

type MapDataType = {
    mapData:string
}

type MarkerType = {
    text?:string
    lat?:GLfloat
    lng?:GLfloat
}

const LocationMarker = ({ text } : MarkerType ) => (
    <div className='locationPin'>
        <MdLocationOn/>
        <span className='label'>{text && text}</span>
    </div>
);

export const Map = ({mapData} : MapDataType)=>{
    //const defaultProps = {
    // "center": {
    //     "lat": -42.83818491310331,
    //     "lng": 147.31145536492832
    //     },
    // "zoom": 11
    // }

    const defaultProps = JSON.parse(mapData);

    return(
         // Important! Always set the container height explicitly
        <div style={{ height: '100%', width: '100%' }}>
            <GoogleMapReact
                bootstrapURLKeys={{ key: "AIzaSyD896hKWizwL1a1MLuW5l9QIqElBb4DxAc" }}
                defaultCenter={defaultProps.center}
                defaultZoom={defaultProps.zoom}
            >
                <LocationMarker
                    lat={defaultProps.center.lat}
                    lng={defaultProps.center.lng}
                    // text="Juveniles Headquarter"
                />
            </GoogleMapReact>
        </div>
    )
}