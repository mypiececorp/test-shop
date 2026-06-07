import type { ReactNode } from "react";
import { ScrollView } from "react-native";
import { Dialog, Portal } from "react-native-paper";

type AppDialogProps = {
  visible: boolean;
  title: string;
  children: ReactNode;
  actions?: ReactNode;
  onDismiss?: () => void;
};

export const AppDialog = ({ visible, title, children, actions, onDismiss }: AppDialogProps) => (
  <Portal>
    <Dialog visible={visible} onDismiss={onDismiss} style={{ borderRadius: 20 }}>
      <Dialog.Title>{title}</Dialog.Title>
      <Dialog.ScrollArea>
        <ScrollView contentContainerStyle={{ gap: 12, paddingVertical: 8 }}>{children}</ScrollView>
      </Dialog.ScrollArea>
      {actions ? <Dialog.Actions>{actions}</Dialog.Actions> : null}
    </Dialog>
  </Portal>
);
