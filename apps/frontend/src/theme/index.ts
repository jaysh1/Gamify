import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  colors: {
    // WCAG AA compliant color tokens
    brand: {
      50: "#E6F4FF",
      100: "#BAD9F7",
      200: "#8DBEE8",
      300: "#62A3D9",
      400: "#3788CA",
      500: "#0C63BB",
      600: "#0A539F",
      700: "#084383",
      800: "#063367",
      900: "#04234B",
    },
    accent: {
      50: "#FFF5E6",
      100: "#FFE4BA",
      200: "#FFD38D",
      300: "#FFC260",
      400: "#FFB133",
      500: "#FFA000",
      600: "#E68900",
      700: "#CC7700",
      800: "#B26600",
      900: "#805000",
    },
    success: {
      50: "#E6F9EE",
      100: "#B3F0D1",
      200: "#80E8B4",
      300: "#4DD997",
      400: "#2AD17A",
      500: "#1ABC9C",
      600: "#149E7D",
      700: "#0E805E",
      800: "#09623F",
      900: "#044420",
    },
    danger: {
      50: "#FFE6E6",
      100: "#FFBABA",
      200: "#FF8E8E",
      300: "#FF6262",
      400: "#FF3636",
      500: "#E74C3C",
      600: "#C6262D",
      700: "#A51D23",
      800: "#841419",
      900: "#630C0F",
    },
    warning: {
      50: "#FFF9E6",
      100: "#FFEFBA",
      200: "#FFE58D",
      300: "#FFDB60",
      400: "#FFD133",
      500: "#F39C12",
      600: "#D68D0A",
      700: "#B97E02",
      800: "#9C6F00",
      900: "#805A00",
    },
    neutral: {
      50: "#F8F9FA",
      100: "#E9ECEF",
      200: "#DEE2E6",
      300: "#CED4DA",
      400: "#ADB5BD",
      500: "#6C757D",
      600: "#495057",
      700: "#343A40",
      800: "#212529",
      900: "#111318",
    },
  },
  fonts: {
    body: "system-ui, sans-serif",
    heading: "system-ui, sans-serif",
    mono: "SFMono-Regular, Menlo, monospace",
  },
  components: {
    Button: {
      defaultProps: {
        colorScheme: "brand",
      },
    },
  },
  config: {
    initialColorMode: "light",
    useSystemColorMode: true,
  },
});

export default theme;
