import React, { useState, useEffect, useRef } from 'react';

const StatCounter = ({ end, label, suffix = "" }) => {
    const [count, setCount] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const counterRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.1 }
        );

        if (counterRef.current) observer.observe(counterRef.current);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!isVisible) return;

        let start = 0;
        const duration = 2000; // 2 seconds
        const increment = end / (duration / 16); // 16ms per frame roughly

        const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
                setCount(end);
                clearInterval(timer);
            } else {
                setCount(Math.floor(start));
            }
        }, 16);

        return () => clearInterval(timer);
    }, [isVisible, end]);

    return (
        <div className="stat_card_premium" ref={counterRef}>
            <div className="stat_number">{count.toLocaleString()}{suffix}</div>
            <div className="stat_label">{label}</div>
        </div>
    );
};

const StatCounters = () => {
    return (
        <div id="impact_counters">
            <StatCounter end={1250} label="FARMERS EMPOWERED" suffix="+" />
            <StatCounter end={85} label="YIELD INCREASE" suffix="%" />
            <StatCounter end={4500} label="SOIL TESTS DONE" suffix="+" />
        </div>
    );
};

export default StatCounters;
