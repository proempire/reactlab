import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { Nav, Navbar } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import Home from './component/home.js';
import Topic from './component/topic.js';
import About from './component/about.js';
import Grid from './component/grid';
import Road from './component/road';
import GridPrediction from './component/gridPrediction';
import RoadPrediction from './component/roadPrediction';
// import logo from './logo.svg';
import './App.css';

class App extends Component {
    render() {
        return (
            <BrowserRouter>
                <div className="App">
                    <Navbar bg="light" expand="lg" fixed="top">
                        <Navbar.Brand>Traffic Visualization</Navbar.Brand>
                        <Navbar.Collapse>
                            <Nav defaultActiveKey="/">
                                <LinkContainer to="/grid" exact><Nav.Link>Grid</Nav.Link></LinkContainer>
                                <LinkContainer to="/road" exact><Nav.Link>Road</Nav.Link></LinkContainer>
                                <LinkContainer to="/grid/prediction"><Nav.Link>Grid(Prediction)</Nav.Link></LinkContainer>
                                <LinkContainer to="/road/prediction"><Nav.Link>Road(Prediction)</Nav.Link></LinkContainer>
                                {/* <LinkContainer exact to="/"><Nav.Link>Home</Nav.Link></LinkContainer>
                                <LinkContainer to="/topic"><Nav.Link>Topic</Nav.Link></LinkContainer>
                                <LinkContainer to="/about"><Nav.Link>About</Nav.Link></LinkContainer> */}
                            </Nav>
                        </Navbar.Collapse>
                        <Navbar.Collapse className="justify-content-end">
                            <Navbar.Text>
                                sign in as <a href="/">Peter</a>
                            </Navbar.Text>
                        </Navbar.Collapse>
                    </Navbar>
                    <div className="App-content">
                        <Route path="/grid" component={Grid} exact></Route>
                        <Route path="/road" component={Road} exact></Route>
                        <Route path="/grid/prediction" component={GridPrediction}></Route>
                        <Route path="/taxi/prediction" component={RoadPrediction}></Route>
                        {/* <Route exact path="/" component={Home}></Route>
                        <Route path="/topic" component={Topic}></Route>
                        <Route path="/about" component={About}></Route> */}
                    </div>
                </div>
            </BrowserRouter>
        );
    }
}

export default App;
