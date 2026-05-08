import React, { useEffect, useState } from 'react';

const CustomCursor = () => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);

    useEffect(() => {
        const handleMouseMove = (e) => {
            setPosition({ x: e.clientX, y: e.clientY });
        };

        const handleMouseOver = (e) => {
            if (e.target.closest('a, button, .tilt-card, .team_card, .pillar_card')) {
                setIsHovering(true);
            } else {
                setIsHovering(false);
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseover', handleMouseOver);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseover', handleMouseOver);
        };
    }, []);

    return (
        <>
            <div 
                className="custom-cursor" 
                style={{ 
                    left: `${position.x}px`, 
                    top: `${position.y}px`,
                    transform: `translate(-50%, -50%) scale(${isHovering ? 1.5 : 1})`,
                    background: isHovering ? 'var(--accent-yellow)' : 'var(--primary-light)',
                    boxShadow: `0 0 ${isHovering ? '30px' : '20px'} ${isHovering ? 'var(--accent-yellow)' : 'var(--primary-light)'}`
                }} 
            />
            <div 
                className="cursor-follower" 
                style={{ 
                    left: `${position.x}px`, 
                    top: `${position.y}px`,
                    transform: `translate(-50%, -50%) scale(${isHovering ? 2.5 : 1})`,
                    borderColor: isHovering ? 'var(--accent-yellow)' : 'var(--primary-light)'
                }} 
            />
        </>
    );
};

export default CustomCursor;
