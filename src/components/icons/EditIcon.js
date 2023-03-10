const SvgComponent = (props) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 330 330"
        style={{
            enableBackground: "new 0 0 330 330",
        }}
        xmlSpace="preserve"
        {...props}>
        <title>{"Edit order"}</title>
        <path d="M75 180v60c0 8.284 6.716 15 15 15h60a15 15 0 0 0 10.606-4.394l164.999-165c5.858-5.858 5.858-15.355 0-21.213l-60-60a14.997 14.997 0 0 0-21.211.001l-165 165A14.994 14.994 0 0 0 75 180zm30 6.213 150-150L293.787 75l-150 150H105v-38.787z" />
        <path d="M315 150.001c-8.284 0-15 6.716-15 15V300H30V30h135c8.284 0 15-6.716 15-15s-6.716-15-15-15H15C6.716 0 0 6.716 0 15v300c0 8.284 6.716 15 15 15h300c8.284 0 15-6.716 15-15V165.001c0-8.285-6.716-15-15-15z" />
    </svg>
);

export default SvgComponent;
