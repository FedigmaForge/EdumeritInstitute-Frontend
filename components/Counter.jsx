"use client";

import { useEffect, useRef, useState } from "react";

export default function Counter({ target, icon, label, suffix = "" }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !started.current) {
            started.current = true;
            const increment = target / 200;
            let value = 0;
            const tick = () => {
              value += increment;
              if (value < target) {
                setCount(Math.ceil(value));
                setTimeout(tick, 10);
              } else {
                setCount(target);
              }
            };
            tick();
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);

  return (
    <div className="stat-tile">
      <div className="stat-tile-icon">
        <i className={icon}></i>
      </div>
      <div>
        <h3 className="stat-tile-num" ref={ref}>
          {count}
          {suffix}
        </h3>
        <p className="stat-tile-label">{label}</p>
      </div>
    </div>
  );
}
