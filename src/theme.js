// src/theme.js
import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  styles: {
    global: {
      body: {
        fontSize: "sm", // 👈 kleiner font
        lineHeight: "1.4", // 👈 iets strakkere regelafstand
        bg: "gray.50",
        color: "gray.800",
      },
    },
  },
  components: {
    Button: {
      defaultProps: {
        size: "sm", // 👈 kleinere knoppen
      },
    },
    Heading: {
      baseStyle: {
        fontWeight: "semibold",
      },
      sizes: {
        xl: { fontSize: "2xl" },
        lg: { fontSize: "xl" },
        md: { fontSize: "lg" },
        sm: { fontSize: "md" },
      },
    },
    Text: {
      baseStyle: {
        fontSize: "sm", // 👈 kleinere paragrafen
      },
    },
  },
});

export default theme;
