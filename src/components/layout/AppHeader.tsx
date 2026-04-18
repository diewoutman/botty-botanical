import React from 'react';
import { IonHeader, IonToolbar, IonTitle, IonButton, IonIcon } from '@ionic/react';
import { globeOutline } from 'ionicons/icons';
import { useTranslation } from 'react-i18next';
import OfflineIndicator from './OfflineIndicator';

const AppHeader: React.FC<{ title?: string }> = ({ title }) => {
  const { i18n } = useTranslation();

  const cycleLanguage = () => {
    const languages = ['nl', 'en', 'de', 'fr', 'es'];
    const currentIndex = languages.indexOf(i18n.language);
    const nextIndex = (currentIndex + 1) % languages.length;
    i18n.changeLanguage(languages[nextIndex]);
  };

  return (
    <IonHeader>
      <IonToolbar>
        <IonTitle>{title || 'Planten Kennis'}</IonTitle>
        <IonButton slot="end" fill="clear" onClick={cycleLanguage}>
          <IonIcon icon={globeOutline} slot="icon-only" />
        </IonButton>
        <OfflineIndicator />
      </IonToolbar>
    </IonHeader>
  );
};

export default AppHeader;