import React from 'react';
import { Link } from 'react-router';

const Header = () =>
    <nav>
        <Link to="/">Home</Link>
        <Link to="/todo">Todo app</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
    </nav>;

export default Header