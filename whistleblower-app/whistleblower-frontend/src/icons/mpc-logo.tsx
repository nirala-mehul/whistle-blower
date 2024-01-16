import { useTheme } from "@mui/material/styles";

export const MPCWalletLogo = (props: any) => {
  const { color: colorProp = "primary" } = props;
  const theme = useTheme();

  const color =
    colorProp === "primary"
      ? theme.palette.primary.main
      : colorProp === "black"
      ? "#1D262D"
      : "#FFFFFF";

  return (
    <svg
      focusable="false"
      aria-hidden="true"
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill={color}
        d="M28.25 19.0618V23.3307C28.25 24.4353 27.3545 25.3307 26.25 25.3307H4C2.89543 25.3307 2 24.4353 2 23.3307V8.66406C2 7.55949 2.89543 6.66406 4 6.66406H26.25C27.3545 6.66406 28.25 7.55949 28.25 8.66406V12.8941"
      ></path>
      <path
        d="M28.25 19.0618V23.3307C28.25 24.4353 27.3545 25.3307 26.25 25.3307H4C2.89543 25.3307 2 24.4353 2 23.3307V8.66406C2 7.55949 2.89543 6.66406 4 6.66406H26.2499C27.3545 6.66406 28.25 7.55949 28.25 8.66406V12.8941"
        stroke="white"
        strokeMiterlimit="10"
      ></path>
      <path
        d="M29 12.8867H20.5C19.9477 12.8867 19.5 13.3344 19.5 13.8867V18.1089C19.5 18.6612 19.9477 19.1089 20.5 19.1089H29C29.5523 19.1089 30 18.6612 30 18.1089V13.8867C30 13.3344 29.5523 12.8867 29 12.8867Z"
        fill={color}
        stroke="white"
        strokeMiterlimit="10"
      ></path>
      <path
        d="M22.37 17.1072C22.9886 17.1072 23.49 16.6057 23.49 15.9872C23.49 15.3686 22.9886 14.8672 22.37 14.8672C21.7514 14.8672 21.25 15.3686 21.25 15.9872C21.25 16.6057 21.7514 17.1072 22.37 17.1072Z"
        fill={color}
      ></path>
    </svg>
  );
};
