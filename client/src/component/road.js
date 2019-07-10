import React, { Component } from 'react';
import { Map, TileLayer, Polyline } from 'react-leaflet';
// import { CircleMarker } from 'leaflet';
import 'react-dates/initialize';
import { DateRangePicker, SingleDatePicker, DayPickerRangeController } from 'react-dates';
import moment from 'moment';
import HorizontalTimeline from 'react-horizontal-timeline';
import 'react-dates/lib/css/_datepicker.css';
import { InputGroup } from 'react-bootstrap';
import TIMESPANS from '../resource/taxi';
import './taxi.css';

class Road extends Component {
    constructor(props) {
        super(props);
        this.state = {
            lat: 37.75,
            lng: -122.39,
            zoom: 13,
            date: moment('2008-05-17'),
            focused: false,
            timeSpan: 20,
            roads: []
        };

        this.getNewData = this.getNewData.bind(this);
        this.drawRoad = this.drawRoad.bind(this);
    }
    componentDidMount() {
        this.getNewData();
    }
    getNewData(date = this.state.date, timeSpan = this.state.timeSpan) {
        fetch(`/api/road/${timeSpan}/${date.format('YYYYMMDD')}`, {
            cache: 'no-cache'
        })
            .then((response) => {
                this.setState({ date, timeSpan });
                return response.json();
            })
            .then((json) => {
                this.drawRoad(json.data);
            })
            .catch((err) => {
                console.error(err);
            });
    }
    drawRoad(data) {
        const roads = [];
        data.forEach((roadUnit) => {
            roads.push({
                polyline: [
                    [roadUnit.startLat, roadUnit.startLon],
                    [roadUnit.endLat, roadUnit.endLon]
                ],
                opacity: roadUnit.roadCount / 10
            });
        });
        // debugger
        this.setState({
            roads
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
                    {this.state.roads.map((road, roadIndex) =>
                        <Polyline color="red" positions={road.polyline}
                            key={`road${roadIndex}`} opacity={road.opacity}
                        />
                    )}
                </Map>
                <div className="time-span">
                    <HorizontalTimeline
                        index={this.state.timeSpan}
                        indexClick={index => this.getNewData(this.state.date, index)}
                        values={TIMESPANS}
                        getLabel={value => `${Math.floor(value / 2)}:${(value % 2) ? '30' : '00'}-`
                            + `${Math.floor((value + 1) / 2)}:${((value + 1) % 2) ? '30' : '00'}`}
                        labelWidth={100}
                        styles={{ background: '#fff', foreground: '#7b9d6f', outline: '#dfdfdf' }}
                    />
                </div>
            </div>
        );
    }
}

export default Road;