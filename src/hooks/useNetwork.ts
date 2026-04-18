import { useNetworkContext } from '../context/NetworkContext';

export function useNetwork(): boolean {
  const { isOnline } = useNetworkContext();
  return isOnline;
}