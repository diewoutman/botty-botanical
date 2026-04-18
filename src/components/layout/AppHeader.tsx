import React from 'react';
import { IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon } from '@ionic/react';
import { chevronBackOutline, globeOutline } from 'ionicons/icons';
import { useHistory, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import OfflineIndicator from './OfflineIndicator';

interface AppHeaderProps {
  title?: string;
  showBackButton?: boolean;
  fallbackRoute?: string;
}

const AppHeader: React.FC<AppHeaderProps> = ({ title, showBackButton = false, fallbackRoute = '/study' }) => {
  const { i18n } = useTranslation();
  const history = useHistory();
  const location = useLocation();

  const cycleLanguage = () => {
    const languages = ['nl', 'en', 'de', 'fr', 'es'];
    const currentIndex = languages.indexOf(i18n.language);
    const nextIndex = (currentIndex + 1) % languages.length;
    i18n.changeLanguage(languages[nextIndex]);
  };

  const handleBack = () => {
    const canGoBack = window.history.length > 1 && location.key !== 'default';
    if (canGoBack) {
      history.goBack();
      return;
    }
    history.replace(fallbackRoute);
  };

  return (
    <IonHeader>
      <IonToolbar>
        {showBackButton && (
          <IonButtons slot="start">
            <IonButton fill="clear" onClick={handleBack} aria-label="Back">
              <IonIcon icon={chevronBackOutline} slot="icon-only" />
            </IonButton>
          </IonButtons>
        )}
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