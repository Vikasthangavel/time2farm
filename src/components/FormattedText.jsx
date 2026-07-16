import React from 'react';

/**
 * Parses and formats markdown AI text responses into clean, beautiful HTML structured elements.
 */
const FormattedText = ({ text, style = {}, isUser = false }) => {
    if (!text) return null;

    // Normalize line endings and split
    const lines = text.split('\n');
    const renderedElements = [];

    lines.forEach((line, index) => {
        const trimmed = line.trim();

        // Empty line space
        if (!trimmed) {
            renderedElements.push(<div key={`space-${index}`} style={{ height: '8px' }} />);
            return;
        }

        // Headings: ### 1. Title or ## Heading
        if (trimmed.startsWith('#')) {
            const headingContent = trimmed.replace(/^#+\s*/, '');
            // Determine heading level based on number of '#'
            const headingLevel = (line.match(/^#+/) || ['#'])[0].length;
            
            // Map heading level to appropriate tag
            let Tag = 'h3';
            let fontSize = '1rem';
            if (headingLevel === 1) {
                Tag = 'h1';
                fontSize = '1.3rem';
            } else if (headingLevel === 2) {
                Tag = 'h2';
                fontSize = '1.15rem';
            }
            
            renderedElements.push(
                <div 
                    key={`h-${index}`} 
                    style={{ 
                        marginTop: '1.25rem', 
                        marginBottom: '0.5rem', 
                        paddingBottom: '0.25rem', 
                        borderBottom: '1px solid rgba(74, 158, 63, 0.15)' 
                    }}
                >
                    <Tag 
                        style={{ 
                            fontSize: fontSize,
                            fontWeight: '700',
                            color: isUser ? 'var(--text-light)' : 'var(--primary-dark)',
                            margin: 0
                        }}
                    >
                        {parseInlineBold(headingContent, isUser)}
                    </Tag>
                </div>
            );
            return;
        }

        // Bullet points: - **Title:** description OR * item
        if (trimmed.match(/^([-*])\s+/)) {
            const bulletContent = trimmed.replace(/^([-*])\s+/, '');
            renderedElements.push(
                <div 
                    key={`b-${index}`} 
                    style={{ 
                        display: 'flex', 
                        alignItems: 'flex-start', 
                        paddingLeft: '0.25rem', 
                        margin: '0.35rem 0',
                        gap: '0.5rem'
                    }}
                >
                    <span 
                        style={{ 
                            width: '6px', 
                            height: '6px', 
                            borderRadius: '50%', 
                            backgroundColor: isUser ? 'var(--text-light)' : 'var(--primary-color)', 
                            marginTop: '0.55rem',
                            flexShrink: 0
                        }} 
                    />
                    <p 
                        style={{ 
                            flex: 1, 
                            fontSize: 'inherit',
                            color: isUser ? 'var(--text-light)' : 'var(--text-body)', 
                            lineHeight: '1.5',
                            margin: 0,
                            ...style
                        }}
                    >
                        {parseInlineBold(bulletContent, isUser)}
                    </p>
                </div>
            );
            return;
        }

        // Numbered lists: 1. Item OR 2. **Title:**
        if (trimmed.match(/^\d+\.\s+/)) {
            const numberMatch = trimmed.match(/^(\d+\.)\s+(.*)/);
            if (numberMatch) {
                const numLabel = numberMatch[1];
                const numContent = numberMatch[2];
                renderedElements.push(
                    <div 
                        key={`n-${index}`} 
                        style={{ 
                            display: 'flex', 
                            alignItems: 'flex-start', 
                            gap: '0.5rem', 
                            margin: '0.35rem 0'
                        }}
                    >
                        <span 
                            style={{ 
                                fontSize: 'inherit',
                                fontWeight: '800', 
                                color: isUser ? 'var(--text-light)' : 'var(--primary-color)',
                                lineHeight: '1.5',
                                flexShrink: 0
                            }}
                        >
                            {numLabel}
                        </span>
                        <p 
                            style={{ 
                                flex: 1, 
                                fontSize: 'inherit',
                                color: isUser ? 'var(--text-light)' : 'var(--text-body)',
                                lineHeight: '1.5',
                                margin: 0,
                                ...style
                            }}
                        >
                            {parseInlineBold(numContent, isUser)}
                        </p>
                    </div>
                );
                return;
            }
        }

        // Standard body line
        renderedElements.push(
            <p 
                key={`p-${index}`} 
                style={{ 
                    fontSize: 'inherit',
                    color: isUser ? 'var(--text-light)' : 'var(--text-body)', 
                    lineHeight: '1.5',
                    margin: '0.35rem 0',
                    ...style
                }}
            >
                {parseInlineBold(trimmed, isUser)}
            </p>
        );
    });

    return <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>{renderedElements}</div>;
};

/**
 * Parses inline **bold** syntax inside text strings.
 */
function parseInlineBold(str, isUser) {
    if (!str) return null;

    // Split by ** delimiters
    const parts = str.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            const boldText = part.slice(2, -2);
            return (
                <strong 
                    key={i} 
                    style={{ 
                        fontWeight: '700', 
                        color: isUser ? 'var(--text-light)' : 'var(--text-dark)' 
                    }}
                >
                    {boldText}
                </strong>
            );
        }
        return part;
    });
}

export default FormattedText;
