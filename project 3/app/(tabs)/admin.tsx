import { Redirect } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/constants/colors';

export default function AdminTabRedirect() {
  const { isAdmin } = useAuth();

  if (!isAdmin) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Unauthorized</Text>
      </View>
    );
  }

  return <Redirect href="/admin" />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  text: {
    color: colors.text,
    fontSize: 16,
  },
});
