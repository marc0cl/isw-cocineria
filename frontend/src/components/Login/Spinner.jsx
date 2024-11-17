const Spinner = () => (
    <svg
        width="24"
        height="24"
        viewBox="0 0 50 50"
        xmlns="http://www.w3.org/2000/svg"
        fill="#003366"
    >
        <path d="M43.935,25.145c0-10.318-8.364-18.682-18.682-18.682c-10.318,0-18.682,8.364-18.682,18.682h4.068
            c0-8.064,6.547-14.611,14.611-14.611s14.611,6.547,14.611,14.611H43.935z">
            <animateTransform
                attributeType="xml"
                attributeName="transform"
                type="rotate"
                from="0 25 25"
                to="360 25 25"
                dur="0.6s"
                repeatCount="indefinite"
            />
        </path>
    </svg>
);

export default Spinner;
