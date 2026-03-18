import type { SVGProps } from 'react';

export const EyeIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={24}
        height={24}
        fill="none"
        stroke="#000"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        style={{
            opacity: 1,
        }}
        {...props}
    >
        <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
        <circle
            cx={12}
            cy={12}
            r={3}
        />
    </svg>
);

export const EyeOffIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={24}
        height={24}
        fill="none"
        stroke="#000"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        style={{
            opacity: 1,
        }}
        {...props}
    >
        <path d="m15 18-.722-3.25M2 8a10.645 10.645 0 0 0 20 0m-2 7-1.726-2.05M4 15l1.726-2.05M9 18l.722-3.25" />
    </svg>
);
