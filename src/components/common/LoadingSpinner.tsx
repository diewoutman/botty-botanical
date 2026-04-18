import React from 'react';
import { IonSpinner } from '@ionic/react';

const LoadingSpinner: React.FC<{ message?: string }> = ({ message }) => (
  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%', padding: '2rem' }}>
    <IonSpinner name="crescent" />
    {message && <p style={{ marginTop: '1rem', color: 'var(--ion-color-medium)' }}>{message}</p>}
  </div>
);

export default LoadingSpinner;