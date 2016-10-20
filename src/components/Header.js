import React from 'react';
import { Link } from 'react-router';

const Header = () =>
    <nav>
        <Link activeClassName="active" to="/">Home</Link>
        <Link activeClassName="active" to="/about">About</Link>
        <Link activeClassName="active" to="/contact">Contact</Link>
        <Link activeClassName="active" to={{pathname:'/contact', query:{country:'Belgium'}}}>Contact Belgium</Link>
    </nav>;

export default Header