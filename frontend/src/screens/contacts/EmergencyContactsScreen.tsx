import { useCallback, useState } from "react";
import { ScrollView, StyleSheet, Text } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { ScreenContainer } from "@/components/ScreenContainer";
import { ContactRow } from "@/components/ContactRow";
import { TextField } from "@/components/TextField";
import { Button } from "@/components/Button";
import {
  createPersonalContactRequest,
  deletePersonalContactRequest,
  fetchOfficialContacts,
  fetchPersonalContacts,
} from "@/services/api/contacts.api";
import { colors, spacing, typography } from "@/theme";
import type { OfficialContact, PersonalContact } from "@/types/contact";

export function EmergencyContactsScreen() {
  const [official, setOfficial] = useState<OfficialContact[]>([]);
  const [personal, setPersonal] = useState<PersonalContact[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const reload = useCallback(() => {
    fetchOfficialContacts().then(setOfficial).catch(() => setOfficial([]));
    fetchPersonalContacts().then(setPersonal).catch(() => setPersonal([]));
  }, []);

  useFocusEffect(reload);

  async function handleAdd() {
    if (!name || !phone) return;
    await createPersonalContactRequest({ name, phone });
    setName("");
    setPhone("");
    reload();
  }

  async function handleDelete(id: string) {
    await deletePersonalContactRequest(id);
    reload();
  }

  return (
    <ScreenContainer>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Contactos del campus</Text>
        {official.map((c) => (
          <ContactRow key={c.id} name={c.label} phone={c.phone} />
        ))}

        <Text style={styles.title}>Tus contactos</Text>
        {personal.map((c) => (
          <ContactRow key={c.id} name={c.name} phone={c.phone} onDelete={() => handleDelete(c.id)} />
        ))}
        <TextField label="Nombre" value={name} onChangeText={setName} />
        <TextField label="Teléfono" keyboardType="phone-pad" value={phone} onChangeText={setPhone} />
        <Button label="Agregar contacto" onPress={handleAdd} />
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: { ...typography.h3, color: colors.textOnDark, marginTop: spacing.lg, marginBottom: spacing.sm },
});
