import React from 'react';
import Header from './Header';
const Home = (props) => <div><Header/><h1>Our site</h1>{props.children}</div>;

export default Home