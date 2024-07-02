import * as React from "react";
const SvgComponent = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={18}
    height={18}
    fill="none"
    {...props}
  >
    <path
      fill="#23282D"
      fillRule="evenodd"
      d="M13.09 1.636v-.405a1.226 1.226 0 1 1 2.456 0v.405h.825c.9 0 1.629.735 1.629 1.63V16.37c0 .9-.728 1.629-1.63 1.629H1.63C.73 18 0 17.265 0 16.371V3.265c0-.9.728-1.629 1.63-1.629h.825v-.405a1.226 1.226 0 1 1 2.454 0v.405h2.455v-.405a1.226 1.226 0 1 1 2.454 0v.405h3.273ZM1.637 7.364v9h14.728v-9H1.636Z"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgComponent;
