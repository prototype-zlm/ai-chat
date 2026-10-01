import * as React from "react";

export const AIReplyIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" {...props}>
    <path
      d="M12 3c4.97 0 9 3.58 9 8s-4.03 8-9 8c-.9 0-1.77-.11-2.58-.31L6 21l.9-3.3C5.1 16.26 3 13.77 3 11c0-4.42 4.03-8 9-8Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />

    <path
      d="M9 9l.6 1.4L11 11l-1.4.6L9 13l-.6-1.4L7 11l1.4-.6L9 9Z"
      fill="currentColor"
      opacity="0.8"
    />

    <path
      d="M15 8l.5 1.2L17 10l-1.5.6L15 12l-.5-1.4L13 10l1.5-.8L15 8Z"
      fill="currentColor"
      opacity="0.6"
    />
  </svg>
);

export default AIReplyIcon;
