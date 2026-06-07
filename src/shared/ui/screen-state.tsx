import { RefreshCcw } from "lucide-react-native";
import { View } from "react-native";
import { Button, Text } from "react-native-paper";

type ScreenStateProps = {
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
};

export const ScreenState = ({ title, message, actionLabel, onAction }: ScreenStateProps) => (
  <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 24, gap: 12 }}>
    <Text variant="titleMedium" selectable>
      {title}
    </Text>
    <Text variant="bodyMedium" selectable style={{ textAlign: "center", color: "#5c665f" }}>
      {message}
    </Text>
    {actionLabel && onAction ? (
      <Button mode="contained-tonal" onPress={onAction} icon={() => <RefreshCcw size={18} />}>
        {actionLabel}
      </Button>
    ) : null}
  </View>
);
