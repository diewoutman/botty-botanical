import React, { useState, useEffect } from 'react';
import { IonPage, IonContent, IonList, IonItem, IonLabel, IonSelect, IonSelectOption, IonButton, IonAlert, IonProgressBar, IonIcon } from '@ionic/react';
import { cloudDownloadOutline, trashOutline, informationCircleOutline } from 'ionicons/icons';
import { useTranslation } from 'react-i18next';
import AppHeader from '../components/layout/AppHeader';
import { useLanguage } from '../context/LanguageContext';
import { OfflineService } from '../services/OfflineService';
import { SUPPORTED_LANGUAGES, LANGUAGE_NAMES, type Language } from '../types';

const SettingsPage: React.FC = () => {
  const { t } = useTranslation();
  const { language, setLanguage } = useLanguage();
  const [showClearAlert, setShowClearAlert] = useState(false);
  const [storageInfo, setStorageInfo] = useState<{ used: number; details: Record<string, number> } | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState({ current: 0, total: 0 });
  const [quotaInfo, setQuotaInfo] = useState<{ usage: number; quota: number; percentage: number } | null>(null);
  const [showAbout, setShowAbout] = useState(false);

  useEffect(() => {
    OfflineService.getStorageInfo().then(info => setStorageInfo(info));
    OfflineService.checkStorageQuota().then(info => setQuotaInfo(info));
  }, []);

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const handleClearCache = async () => {
    await OfflineService.clearAllCachedData();
    const info = await OfflineService.getStorageInfo();
    setStorageInfo(info);
  };

  const handleDownloadAll = async () => {
    setDownloading(true);
    await OfflineService.downloadAllForOffline((current, total) => {
      setDownloadProgress({ current, total });
    });
    setDownloading(false);
    setDownloadProgress({ current: 0, total: 0 });
    const info = await OfflineService.getStorageInfo();
    setStorageInfo(info);
  };

  return (
    <IonPage>
      <AppHeader title={t('settings.title')} />
      <IonContent className="ion-padding">
        <IonList>
          <IonItem>
            <IonLabel>{t('settings.language')}</IonLabel>
            <IonSelect
              value={language}
              onIonChange={(e) => setLanguage(e.detail.value as Language)}
              interface="popover"
            >
              {SUPPORTED_LANGUAGES.map(lang => (
                <IonSelectOption key={lang} value={lang}>
                  {LANGUAGE_NAMES[lang]}
                </IonSelectOption>
              ))}
            </IonSelect>
          </IonItem>
        </IonList>

        <h3>{t('settings.offlineData')}</h3>

        {storageInfo && (
          <div style={{ marginBottom: '12px' }}>
            <p>{t('settings.storageUsed', { size: formatBytes(storageInfo.used) })}</p>
            {storageInfo.details && (
              <div style={{ fontSize: '0.85rem', color: 'var(--ion-color-medium)', marginLeft: '8px' }}>
                <p>Plant data: {formatBytes(storageInfo.details.plantData || 0)}</p>
                <p>Images: {formatBytes(storageInfo.details.images || 0)}</p>
                <p>Settings: {formatBytes(storageInfo.details.settings || 0)}</p>
              </div>
            )}
            {quotaInfo && quotaInfo.quota > 0 && (
              <div style={{ marginTop: '8px' }}>
                <IonProgressBar value={quotaInfo.percentage / 100} color={quotaInfo.percentage > 80 ? 'warning' : 'success'} />
                <p style={{ fontSize: '0.8rem', color: 'var(--ion-color-medium)', marginTop: '4px' }}>
                  {quotaInfo.percentage.toFixed(1)}% of storage used
                </p>
              </div>
            )}
          </div>
        )}

        <IonButton
          expand="block"
          color="success"
          onClick={handleDownloadAll}
          disabled={downloading}
        >
          <IonIcon icon={cloudDownloadOutline} slot="start" />
          {downloading
            ? t('settings.downloadProgress', downloadProgress)
            : t('settings.downloadAll')
          }
        </IonButton>

        {downloading && downloadProgress.total > 0 && (
          <IonProgressBar value={downloadProgress.current / downloadProgress.total} color="success" />
        )}

        <IonButton
          expand="block"
          color="danger"
          fill="outline"
          onClick={() => setShowClearAlert(true)}
          style={{ marginTop: '8px' }}
        >
          <IonIcon icon={trashOutline} slot="start" />
          {t('settings.clearCache')}
        </IonButton>

        <IonAlert
          isOpen={showClearAlert}
          onDidDismiss={() => setShowClearAlert(false)}
          header={t('settings.clearCache')}
          message={t('settings.confirmClear')}
          buttons={[
            { text: t('common.cancel'), role: 'cancel' },
            { text: t('common.confirm'), handler: handleClearCache },
          ]}
        />

        <h3 style={{ marginTop: '2rem' }}>{t('settings.about')}</h3>
        <IonList>
          <IonItem button onClick={() => setShowAbout(true)}>
            <IonIcon icon={informationCircleOutline} slot="start" />
            <IonLabel>About Planten Kennis</IonLabel>
          </IonItem>
        </IonList>

        <IonAlert
          isOpen={showAbout}
          onDidDismiss={() => setShowAbout(false)}
          header="Planten Kennis"
          message="Botanical Knowledge PWA v0.1.0. Data from Wikipedia, GBIF, iNaturalist, Wikimedia Commons. Images subject to individual licenses."
          buttons={['OK']}
        />
      </IonContent>
    </IonPage>
  );
};

export default SettingsPage;