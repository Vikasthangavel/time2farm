import React from 'react';

const Card = ({ children, className = '', padding, onClick, hoverable = false, style = {} }) => {
    const defaultStyles = {
        backgroundColor: 'var(--bg-card)',
        borderRadius: 'var(--border-radius-lg)',
        boxShadow: 'var(--shadow-sm)',
        padding: padding || '1.25rem',
        border: '1px solid var(--border-color)',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'transform 0.2s, box-shadow 0.2s',
    };

    return (
        <div
            className={`card-component ${hoverable ? 'hoverable' : ''} ${className}`}
            style={{ ...defaultStyles, ...style }}
            onClick={onClick}
        >
            {children}
        </div>
    );
};

export default Card;
