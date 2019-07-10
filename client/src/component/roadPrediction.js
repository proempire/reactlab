import React, { Component } from 'react';
import { Map, TileLayer, CircleMarker } from 'react-leaflet';
// import { CircleMarker } from 'leaflet';
import 'react-dates/initialize';
import { DateRangePicker, SingleDatePicker, DayPickerRangeController } from 'react-dates';
import HorizontalTimeline from 'react-horizontal-timeline';
import 'react-dates/lib/css/_datepicker.css';
import { InputGroup } from 'react-bootstrap';
import TIMESPANS from '../resource/taxi';
import './taxi.css';

class RoadPrediction extends Component {
    constructor(props) {
        super(props);
        this.state = {
            lat: 37.75,
            lng: -122.39,
            zoom: 13,
            date: null,
            focused: false,
            timeSpan: 0,
            grids: [],
            latUnit: 0.00124378,
            lonUnit: 0.00157495,
            minLat: 37.707409,
            minLon: -122.515239
        };

        this.getNewData = this.getNewData.bind(this);
        this.drawGrid = this.drawGrid.bind(this);
    }
    componentDidMount() {
        fetch('/api/grid/20/20080517', {
            cache: 'no-cache'
        })
            .then((response) => {
                return response.json();
            })
            .then((json) => {
                // debugger
                this.drawGrid(json.data);
            })
            .catch((err) => {
                console.error(err);
            });
    }
    getNewData(date) {
        console.log(date);

        this.setState({ date });
    }
    drawGrid(data) {
        // minLat = 37.707409
        // maxLat = 37.831787
        // latUnit = 0.00124378
        // minLon = -122.515239
        // maxLon = -122.357744
        // lonUnit = 0.00157495
        const grids = [];
        data.forEach((gridUnit) => {
            const lat = this.state.minLat + gridUnit.y * this.state.latUnit;
            const lon = this.state.minLon + gridUnit.x * this.state.lonUnit;
            const center = { lat, lon };
            grids.push({
                center,
                opacity: gridUnit.count / 20
            });
        });
        this.setState({
            grids
        });
    }
    render() {
        const position = [this.state.lat, this.state.lng]
        return (
            <div className="taxi">
                <div className="filter">
                    <InputGroup className="mb-3">
                        <SingleDatePicker
                            date={this.state.date}
                            onDateChange={date => this.getNewData(date)}
                            focused={this.state.focused}
                            onFocusChange={({ focused }) => this.setState({ focused })}
                            id="date"
                        />
                    </InputGroup>
                </div>
                <Map center={position} zoom={this.state.zoom} className="map">
                    <TileLayer
                        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {this.state.grids.map((grid, gridIndex) =>
                        <CircleMarker center={grid.center} color='red' radius={4} key={`grid${gridIndex}`}
                            weight='0' fillOpacity={grid.opacity}>
                            {/* <Popup>Popup in CircleMarker</Popup> */}
                        </CircleMarker>
                    )}
                    {/* <Marker position={position}>
                        <Popup>
                            A pretty CSS3 popup. <br /> Easily customizable.
                        </Popup>
                    </Marker> */}
                </Map>
                <div className="time-span">
                    <HorizontalTimeline
                        index={this.state.timeSpan}
                        indexClick={(index) => {
                            this.setState({ value: index, previous: this.state.timeSpan });
                        }}
                        values={TIMESPANS}
                        getLabel={value => value}
                        styles={{ background: '#fff', foreground: '#7b9d6f', outline: '#dfdfdf' }}
                    />
                </div>
            </div>
        );
    }
}

export default RoadPrediction;