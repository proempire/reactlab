import React, { Component } from 'react';
import { Map, TileLayer, CircleMarker } from 'react-leaflet';
import 'react-dates/initialize';
import { SingleDatePicker } from 'react-dates';
import moment from 'moment';
import HorizontalTimeline from 'react-horizontal-timeline';
import 'react-dates/lib/css/_datepicker.css';
import { InputGroup } from 'react-bootstrap';
import TIMESPANS from '../resource/taxi';
import './taxi.css';

class GridPrediction extends Component {
    constructor(props) {
        super(props);
        this.state = {
            lat: 37.75,
            lng: -122.39,
            zoom: 13,
            date: moment('2008-05-17'),
            focused: false,
            timeSpan: 20,
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
        this.getNewData();
    }
    getNewData(date = this.state.date, timeSpan = this.state.timeSpan) {
        fetch(`/api/grid/prediction/${timeSpan}/${date.format('YYYYMMDD')}`, {
            cache: 'no-cache'
        })
            .then((response) => {
                this.setState({ date, timeSpan });
                return response.json();
            })
            .then((json) => {
                this.drawGrid(json.data);
            })
            .catch((err) => {
                console.error(err);
            });
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
                            isOutsideRange={() => false}
                            initialVisibleMonth={() => moment('2008-05-01')}
                        />
                    </InputGroup>
                </div>
                <Map center={position} zoom={this.state.zoom} className="map">
                    <TileLayer
                        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {this.state.grids.map((grid, gridIndex) =>
                        <CircleMarker center={grid.center} color="red" radius={4} key={`grid${gridIndex}`}
                            weight={0} fillOpacity={grid.opacity}>
                        </CircleMarker>
                    )}
                </Map>
                <div className="time-span">
                    <HorizontalTimeline
                        index={this.state.timeSpan}
                        indexClick={index => this.getNewData(this.state.date, index)}
                        values={TIMESPANS}
                        getLabel={value => `${Math.floor(value / 2)}:${(value % 2) ? '30' : '00'}-`
                            + `${Math.floor((value + 1)/ 2)}:${((value + 1) % 2) ? '30' : '00'}`}
                        labelWidth={100}
                        styles={{ background: '#fff', foreground: '#7b9d6f', outline: '#dfdfdf' }}
                    />
                </div>
            </div>
        );
    }
}

export default GridPrediction;