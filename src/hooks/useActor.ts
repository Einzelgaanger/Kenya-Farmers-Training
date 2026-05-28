import { useAuth } from '@/contexts/AuthContext';

export function useActor() {
  const { user } = useAuth();
  if (!user) return undefined;
  return { userId: user.id, userName: user.name };
}
