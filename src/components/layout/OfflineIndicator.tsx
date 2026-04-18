import React from 'react';
import { IonBadge } from '@ionic/react';
import { useNetwork } from '../../hooks/useNetwork';

const OfflineIndicator: React.FC = () => {
  const isOnline = useNetwork();

  if (isOnline) return null;

  return (
    <IonBadge color="warning" slot="end" style={{ marginRight: '8px' }}>
      Offline
    </IonBadge>
  );
};

export default OfflineIndicator;