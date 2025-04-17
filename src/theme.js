// src/theme.js
import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  styles: {
    global: {
      body: {
        fontSize: "sm",
        lineHeight: "1.4",
        bg: "gray.50",
        color: "gray.800",
      },
    },
  },
  components: {
    Button: {
      defaultProps: {
        size: "sm",
        colorScheme: "teal", // 👈 consistent met jouw voorkeur
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
        fontSize: "sm",
        color: "gray.700", // 👈 iets vriendelijker dan gray.800
      },
    },
    Badge: {
      baseStyle: {
        borderRadius: "md", // 👈 consistent afgerond uiterlijk
        px: 2,
        py: 0.5,
        textTransform: "capitalize",
      },
      defaultProps: {
        colorScheme: "teal", // 👈 consistent met CategoryBadge
      },
    },
  },
});

export default theme;
