import type { SVGProps } from 'react';

export const CatPorfileIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 64 64"
        {...props}
    >
        <g
            fill="none"
            fillRule="evenodd"
        >
            <circle
                cx={32}
                cy={32}
                r={30}
                fill="#FAB3A9"
            />
            <ellipse
                cx={32}
                cy={30}
                fill="#0B090A"
                rx={10}
                ry={8}
            />
            <path
                fill="#0B090A"
                d="M22.139 60.342A39.905 39.905 0 0 1 22 57c0-11.046 4.477-20 10-20s10 8.954 10 20c0 1.139-.048 2.255-.139 3.342A29.956 29.956 0 0 1 32 62c-3.454 0-6.773-.584-9.861-1.658zm6.474-37.294S26.657 18.55 24.47 17c0 0-2.353 6.176-1.107 11.298M35 23.048S36.956 18.55 39.142 17c0 0 2.353 6.176 1.107 11.298"
            />
        </g>
    </svg>
);
