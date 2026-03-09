import React from 'react';

const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    fullWidth = false,
    ...props
}) => {
    const baseStyles = {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        borderRadius: '12px',
        fontWeight: '500',
        transition: 'all 0.2s',
        border: 'none',
        cursor: 'pointer',
        width: fullWidth ? '100%' : 'auto'
    };

    const variants = {
        primary: {
            backgroundColor: 'var(--primary-color)',
            color: 'white',
        },
        secondary: {
            backgroundColor: 'white',
            color: 'var(--primary-color)',
            border: '1px solid var(--primary-color)',
        },
        ghost: {
            backgroundColor: 'transparent',
            color: 'var(--text-dark)',
            border: '1px solid var(--border-color)',
        },
        danger: {
            backgroundColor: 'var(--accent-red)',
            color: 'white',
        }
    };

    const sizes = {
        sm: { padding: '0.5rem 0.75rem', fontSize: '0.875rem' },
        md: { padding: '0.75rem 1.5rem', fontSize: '1rem' },
        lg: { padding: '1rem 2rem', fontSize: '1.125rem' }
    };

    const currentStyles = {
        ...baseStyles,
        ...variants[variant],
        ...sizes[size]
    };

    return (
        <button style={currentStyles} className={className} {...props}>
            {children}
        </button>
    );
};

export default Button;
