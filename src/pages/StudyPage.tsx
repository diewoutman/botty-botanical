import React, { useState, useEffect, useMemo } from 'react';
import { IonPage, IonContent, IonSearchbar, IonGrid, IonRow, IonCol, IonChip, IonLabel, IonInfiniteScroll, IonInfiniteScrollContent, IonRefresher, IonRefresherContent, IonText } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AppHeader from '../components/layout/AppHeader';
import PlantCard from '../components/study/PlantCard';

import EmptyState from '../components/common/EmptyState';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { PlantDataService } from '../services/PlantDataService';
import type { Plant, PlantCategory } from '../types';

const PAGE_SIZE = 20;
const CATEGORIES: { value: PlantCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'study.category.all' },
  { value: 'flower', label: 'study.category.flower' },
  { value: 'tree', label: 'study.category.tree' },
  { value: 'shrub', label: 'study.category.shrub' },
  { value: 'herb', label: 'study.category.herb' },
  { value: 'grass', label: 'study.category.grass' },
  { value: 'fern', label: 'study.category.fern' },
];

const StudyPage: React.FC = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState<PlantCategory | 'all'>('all');
  const [displayCount, setDisplayCount] = useState(PAGE_SIZE);
  const [initialized, setInitialized] = useState(false);
  const [allPlants, setAllPlants] = useState<Plant[]>([]);
  const [bgLoaded, setBgLoaded] = useState(0);
  const [bgLoading, setBgLoading] = useState(false);
  const [metrics, setMetrics] = useState(PlantDataService.getIngestionMetrics());

  useEffect(() => {
    let mounted = true;

    PlantDataService.initialize().then(() => {
      if (!mounted) return;
      const plants = PlantDataService.getBundledPlants();
      console.log('StudyPage: loaded', plants.length, 'plants, first:', plants[0]?.latinName);
      setAllPlants(plants);
      setInitialized(true);
      setBgLoading(PlantDataService.isBackgroundLoading());
      setMetrics(PlantDataService.getIngestionMetrics());

      PlantDataService.startBackgroundExternalLoad((count) => {
        if (!mounted) return;
        setBgLoaded(count);
        setAllPlants(PlantDataService.getBundledPlants());
        setBgLoading(PlantDataService.isBackgroundLoading());
        setMetrics(PlantDataService.getIngestionMetrics());
      })
        .finally(() => {
          if (!mounted) return;
          setBgLoading(false);
          setMetrics(PlantDataService.getIngestionMetrics());
        });
    });

    return () => {
      mounted = false;
    };
  }, []);

  const filteredPlants = useMemo(() => {
    let result = allPlants;
    if (category !== 'all') {
      result = result.filter(p => p.category === category);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(plant => {
        const latinMatch = plant.latinName.toLowerCase().includes(q);
        const nameMatch = Object.values(plant.names).some(name =>
          name.toLowerCase().includes(q)
        );
        return latinMatch || nameMatch;
      });
    }
    return result;
  }, [allPlants, category, searchQuery]);

  const plants = filteredPlants.slice(0, displayCount);

  const loadMore = (e: CustomEvent) => {
    setDisplayCount(prev => prev + PAGE_SIZE);
    (e.target as HTMLIonInfiniteScrollElement).complete();
  };

  const handleRefresh = (event: CustomEvent) => {
    PlantDataService.initialize().then(() => {
      setAllPlants(PlantDataService.getBundledPlants());
      (event.target as HTMLIonRefresherElement).complete();
    });
  };

  const handleCardClick = (id: string) => {
    history.push(`/plant/${id}`);
  };


  if (!initialized) {
    return (
      <IonPage>
        <AppHeader title={t('study.title')} />
        <IonContent>
          <LoadingSpinner message={t('common.loading')} />
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <AppHeader title={t('study.title')} />
      <IonContent>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent />
        </IonRefresher>

        <IonSearchbar
          value={searchQuery}
          onIonInput={(e) => {
            setSearchQuery(e.detail.value ?? '');
            setDisplayCount(PAGE_SIZE);
          }}
          placeholder={t('study.search')}
          debounce={300}
        />

        <div style={{ padding: '0 16px 8px', display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
          {CATEGORIES.map(cat => (
            <IonChip
              key={cat.value}
              color={category === cat.value ? 'success' : 'medium'}
              onClick={() => {
                setCategory(cat.value);
                setDisplayCount(PAGE_SIZE);
              }}
            >
              <IonLabel>{t(cat.label)}</IonLabel>
            </IonChip>
          ))}
        </div>

        <div style={{ padding: '0 16px 8px' }}>
          <IonText color="medium">
            <p style={{ margin: 0, fontSize: '0.85rem' }}>
              {allPlants.length} plants loaded {bgLoaded > 0 ? `(${bgLoaded} background validated)` : ''}
            </p>
            <p style={{ margin: '4px 0 0', fontSize: '0.8rem' }}>
              {bgLoading ? 'Background ingestion running...' : 'Background ingestion idle'}
            </p>
            <p style={{ margin: '4px 0 0', fontSize: '0.8rem' }}>
              Accepted: {metrics.accepted} · Rejected: {metrics.rejected}
            </p>
          </IonText>
        </div>

        {filteredPlants.length === 0 ? (
          <EmptyState message={t('study.noResults')} />
        ) : (
          <IonGrid>
            <IonRow>
              {plants.map(plant => (
                <IonCol size="6" sizeMd="4" sizeLg="3" key={plant.id}>
                  <PlantCard plant={plant} onClick={handleCardClick} />
                </IonCol>
              ))}
            </IonRow>
          </IonGrid>
        )}

        
        <IonInfiniteScroll onIonInfinite={loadMore} threshold="100px">
          <IonInfiniteScrollContent loadingText={t('common.loading')} />
        </IonInfiniteScroll>
      </IonContent>
    </IonPage>
  );
};

export default StudyPage;