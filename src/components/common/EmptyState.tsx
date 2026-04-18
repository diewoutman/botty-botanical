import React from 'react';
import { IonIcon } from '@ionic/react';
import { searchOutline } from 'ionicons/icons';

interface EmptyStateProps {
  message?: string;
  icon?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  message = 'No plants found',
  icon = searchOutline,
}) => (
  <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--ion-color-medium)' }}>
    <IonIcon icon={icon} style={{ fontSize: '3rem', marginBottom: '1rem' }} />
    <p>{message}</p>
  </div>
);

export default EmptyState;