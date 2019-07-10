import React, { Component } from 'react';
import { Carousel } from 'react-bootstrap';
import { carouselImgs } from '../mock/home/index.js';

class Home extends Component {
    constructor(props) {
        super(props);
        this.selectCarousel = this.selectCarousel.bind(this);
        this.state = {
            index: 0,
            direction: null,
        };
    }
    selectCarousel(selectIndex, e) {
        this.setState({
            index: selectIndex,
            direction: e.direction,
        });
    }
    render() {
        const { index, direction } = this.state;
        return (
            <div className="home">
                <Carousel
                    activeIndex={index}
                    direction={direction}
                    onSelect={this.selectCarousel}
                >
                    {
                        carouselImgs.map((img, index) => {
                            return (
                                <Carousel.Item key={`carousel_img_${index}`}>
                                    <div className="carousel-img" style={{ backgroundImage: img.url }}></div>
                                    <Carousel.Caption>
                                        <h3>Columbria</h3>
                                    </Carousel.Caption>
                                </Carousel.Item>
                            );
                        })
                    }
                </Carousel>
            </div>
        );
    }
}

export default Home;