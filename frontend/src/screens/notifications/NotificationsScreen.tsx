import { useCallback, useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { ScreenContainer } from "@/components/ScreenContainer";
import { fetchNotifications, markNotificationReadRequest } from "@/services/api/notifications.api";
import { getSocket } from "@/services/socket";
import { colors, radius, spacing, typography } from "@/theme";
import type { Notification } from "@/types/notification";

export function NotificationsScreen() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const reload = useCallback(() => {
    fetchNotifications()
      .then((items) => {
        setNotifications(items);
        items.forEach((n) => markNotificationReadRequest(n.id));
      })
      .catch(() => setNotifications([]));
  }, []);

  useFocusEffect(reload);

  useEffect(() => {
    const socket = getSocket();
    const onNew = (notification: Notification) =>
      setNotifications((prev) => [notification, ...prev]);
    socket?.on("notification:new", onNew);
    return () => {
      socket?.off("notification:new", onNew);
    };
  }, []);

  return (
    <ScreenContainer>
      <Text style={styles.title}>Alertas del campus</Text>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemTitle}>{item.title}</Text>
            <Text style={styles.itemBody}>{item.body}</Text>
            <Text style={styles.itemDate}>{new Date(item.createdAt).toLocaleString()}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No hay alertas por ahora.</Text>}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: { ...typography.h2, color: colors.textOnDark, marginBottom: spacing.md },
  item: {
    backgroundColor: colors.backgroundElevated,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  itemTitle: { ...typography.bodyStrong, color: colors.accent },
  itemBody: { ...typography.body, color: colors.textOnDark, marginTop: spacing.xs },
  itemDate: { ...typography.caption, color: colors.textOnDarkMuted, marginTop: spacing.xs },
  empty: { ...typography.body, color: colors.textOnDarkMuted, textAlign: "center", marginTop: spacing.xl },
});
