import { Stack } from 'expo-router';
import { theme } from '../../constants/theme';

export default function AgencyLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.background },
      }}
    />
  );
}
