import React, { useState, useEffect } from 'react';
import { IonPage, IonContent, IonList, IonItem, IonLabel, IonBadge, IonImg, IonSkeletonText, IonButton, IonIcon } from '@ionic/react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { downloadOutline } from 'ionicons/icons';
import AppHeader from '../components/layout/AppHeader';
import ImageGallery from '../components/detail/ImageGallery';
import { PlantDataService } from '../services/PlantDataService';
import { PlantDetailService } from '../services/PlantDetailService';
import { ImageService } from '../services/ImageService';
import type { Plant, PlantDetail } from '../types';

const DetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t, i18n } = useTranslation();
  const [plant, setPlant] = useState<Plant | undefined>(undefined);
  const [detail, setDetail] = useState<PlantDetail | null>(null);
  const [activeTab, setActiveTab] = useState<'general' | 'deep'>('general');
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  const isExternal = id?.startsWith('ext_');

  useEffect(() => {
    if (!id) return;
    const p = PlantDataService.getPlantById(id);
    setPlant(p);

    if (p) {
      const d = PlantDetailService.getPlantDetailById(id);
      setDetail(d);
      setLoading(false);
    } else if (isExternal) {
      PlantDataService.fetchExternalPlantDetails(parseInt(id.replace('ext_', '')))
        .then(d => {
          setDetail(d);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [id, isExternal]);

  const displayName = plant
    ? (plant.names[i18n.language] || plant.names.en || plant.latinName)
    : '';

  const handleDownloadOffline = async () => {
    if (!id || !isExternal) return;
    setDownloading(true);
    try {
      await PlantDataService.fetchExternalPlantDetails(parseInt(id.replace('ext_', '')));
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <IonPage>
        <AppHeader title="..." />
        <IonContent>
          <IonSkeletonText animated style={{ width: '100%', height: '200px' }} />
          <div style={{ padding: '16px' }}>
            <IonSkeletonText animated style={{ width: '60%' }} />
            <IonSkeletonText animated style={{ width: '40%' }} />
          </div>
        </IonContent>
      </IonPage>
    );
  }

  if (!plant && !detail) {
    return (
      <IonPage>
        <AppHeader title={t('common.error')} />
        <IonContent>
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p>{t('common.error')}</p>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  const thumbnail = plant ? ImageService.getPlantThumbnail(plant) : '';
  const latinName = plant?.latinName || '';
  const names = plant?.names || {};
  const traits = plant?.traits || {};

  return (
    <IonPage>
      <AppHeader title={displayName} />
      <IonContent>
        {plant?.thumbnail ? (
          <IonImg
            src={plant.thumbnail}
            alt={displayName}
            style={{ width: '100%', height: '250px', objectFit: 'cover' }}
          />
        ) : thumbnail && (
          <img
            src={thumbnail}
            alt={displayName}
            style={{ width: '100%', height: '250px', objectFit: 'cover' }}
          />
        )}

        <div style={{ padding: '16px' }}>
          <h2 style={{ margin: '0 0 4px' }}>{displayName}</h2>
          <p style={{ margin: '0 0 8px', fontStyle: 'italic', color: 'var(--ion-color-medium)' }}>
            {latinName}
          </p>

          {plant && Object.entries(names).filter(([lang]) => lang !== i18n.language && names[lang]).map(([lang, name]) => (
            <IonBadge key={lang} color="light" style={{ marginRight: '4px', fontSize: '0.75rem' }}>
              {name}
            </IonBadge>
          ))}

          {Object.entries(traits).length > 0 && (
            <div style={{ marginTop: '8px', display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
              {Object.entries(traits).map(([key, value]) =>
                value ? (
                  <IonBadge key={key} color="success" style={{ fontSize: '0.7rem' }}>
                    {key}: {String(value)}
                  </IonBadge>
                ) : null
              )}
            </div>
          )}

          {isExternal && (
            <IonButton
              expand="block"
              fill="outline"
              color="success"
              style={{ marginTop: '12px' }}
              onClick={handleDownloadOffline}
              disabled={downloading}
            >
              <IonIcon icon={downloadOutline} slot="start" />
              {downloading ? 'Downloading...' : t('detail.downloadOffline')}
            </IonButton>
          )}
        </div>

        {detail?.images && detail.images.length > 0 && (
          <div style={{ padding: '0 16px' }}>
            <h4>{t('detail.images')}</h4>
            <ImageGallery images={detail.images} />
          </div>
        )}

        <div style={{ display: 'flex', borderBottom: '1px solid var(--ion-color-light)' }}>
          <button
            onClick={() => setActiveTab('general')}
            style={{
              flex: 1, padding: '12px', border: 'none', background: 'transparent',
              fontWeight: activeTab === 'general' ? 'bold' : 'normal',
              color: activeTab === 'general' ? 'var(--ion-color-success)' : 'var(--ion-color-medium)',
              cursor: 'pointer',
            }}
          >
            {t('detail.general')}
          </button>
          <button
            onClick={() => setActiveTab('deep')}
            style={{
              flex: 1, padding: '12px', border: 'none', background: 'transparent',
              fontWeight: activeTab === 'deep' ? 'bold' : 'normal',
              color: activeTab === 'deep' ? 'var(--ion-color-success)' : 'var(--ion-color-medium)',
              cursor: 'pointer',
            }}
          >
            {t('detail.deep')}
          </button>
        </div>

        <div style={{ padding: '16px' }}>
          {activeTab === 'general' && (
            <div>
              {detail?.general?.description?.[i18n.language] && (
                <><h3>{t('detail.description')}</h3><p>{detail.general.description[i18n.language]}</p></>
              )}
              {detail?.general?.description?.en && !detail?.general?.description?.[i18n.language] && (
                <><h3>{t('detail.description')}</h3><p>{detail.general.description.en}</p></>
              )}
              {plant?.taxonomy && (
                <IonList>
                  <IonItem><IonLabel slot="start">{t('detail.family')}</IonLabel><IonLabel>{plant.taxonomy.family}</IonLabel></IonItem>
                  <IonItem><IonLabel slot="start">{t('detail.genus')}</IonLabel><IonLabel>{plant.taxonomy.genus}</IonLabel></IonItem>
                  <IonItem><IonLabel slot="start">{t('detail.species')}</IonLabel><IonLabel>{plant.taxonomy.species}</IonLabel></IonItem>
                </IonList>
              )}
              {detail?.general?.nativeRange && detail.general.nativeRange.length > 0 && (
                <p><strong>{t('detail.nativeRange')}:</strong> {detail.general.nativeRange.join(', ')}</p>
              )}
              {detail?.general?.growthHabit && (
                <p><strong>{t('detail.growthHabit')}:</strong> {detail.general.growthHabit}</p>
              )}
            </div>
          )}

          {activeTab === 'deep' && (
            <div>
              {detail?.deep ? (
                <>
                  {detail.deep.history?.[i18n.language] && (
                    <><h3>{t('detail.history')}</h3><p>{detail.deep.history[i18n.language]}</p></>
                  )}
                  {detail.deep.etymology?.[i18n.language] && (
                    <><h3>{t('detail.etymology')}</h3><p>{detail.deep.etymology[i18n.language]}</p></>
                  )}
                  {detail.deep.culturalSignificance?.[i18n.language] && (
                    <><h3>{t('detail.culturalSignificance')}</h3><p>{detail.deep.culturalSignificance[i18n.language]}</p></>
                  )}
                  {detail.deep.usesTraditional && detail.deep.usesTraditional.length > 0 && (
                    <><h3>{t('detail.usesTraditional')}</h3><ul>{detail.deep.usesTraditional.map((u, i) => <li key={i}>{u}</li>)}</ul></>
                  )}
                  {detail.deep.usesModern && detail.deep.usesModern.length > 0 && (
                    <><h3>{t('detail.usesModern')}</h3><ul>{detail.deep.usesModern.map((u, i) => <li key={i}>{u}</li>)}</ul></>
                  )}
                  {detail.deep.conservationStatus && (
                    <p><strong>{t('detail.conservationStatus')}:</strong> {detail.deep.conservationStatus}</p>
                  )}
                </>
              ) : (
                <p>{t('detail.noDeepInfo')}</p>
              )}
            </div>
          )}

          {detail?.sources && detail.sources.length > 0 && (
            <div style={{ marginTop: '2rem', borderTop: '1px solid var(--ion-color-light)', paddingTop: '1rem' }}>
              <h3>{t('detail.attribution')}</h3>
              {detail.sources.map((source, i) => (
                <p key={i}><a href={source.url} target="_blank" rel="noopener noreferrer">{source.name}</a></p>
              ))}
            </div>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default DetailPage;