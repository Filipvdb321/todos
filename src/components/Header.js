import React from 'react';
import { Link } from 'react-router';

const Header = () =>
    <nav>
        <Link activeClassName="active" to="/">Home</Link>
        <Link activeClassName="active" to="/about">About</Link>
        <Link activeClassName="active" to="/contact">Contact</Link>
    </nav>;

export default Header