import { PropsWithChildren } from "react";
import { CheckSquare, Circle, MinusSquare, Search, Square, X } from "lucide-react-native";
import { MD3LightTheme, PaperProvider } from "react-native-paper";

import { QueryProvider } from "./query-provider";
import { RootStoreProvider } from "./root-store-provider";

const theme = {
  ...MD3LightTheme,
  roundness: 16,
  colors: {
    ...MD3LightTheme.colors,
    primary: "#1f7a4d",
    secondary: "#335c81",
    tertiary: "#b2552f",
    background: "#f6f7f4",
    surface: "#ffffff",
    surfaceVariant: "#e8ece3",
  },
};

const paperIconMap = {
  "checkbox-blank-outline": Square,
  "checkbox-marked": CheckSquare,
  "checkbox-indeterminate": MinusSquare,
  magnify: Search,
  close: X,
};

type PaperIconProps = {
  name: keyof typeof paperIconMap | string;
  color?: string;
  size: number;
};

const renderPaperIcon = ({ name, color, size }: PaperIconProps) => {
  const Icon = paperIconMap[name as keyof typeof paperIconMap] ?? Circle;

  return <Icon color={color ?? "#22312a"} size={size} />;
};

export const AppProviders = ({ children }: PropsWithChildren) => (
  <PaperProvider theme={theme} settings={{ icon: renderPaperIcon }}>
    <QueryProvider>
      <RootStoreProvider>{children}</RootStoreProvider>
    </QueryProvider>
  </PaperProvider>
);
