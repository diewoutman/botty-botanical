import React, { useEffect, useState } from 'react';
import { IonItem, IonLabel, IonList, IonSpinner, IonIcon } from '@ionic/react';
import { globeOutline } from 'ionicons/icons';
import { PlantDataService } from '../../services/PlantDataService';
import { useNetwork } from '../../hooks/useNetwork';

interface ExternalSearchProps {
  query: string;
  onPlantSelect: (pageId: number) => void;
}

const ExternalSearch: React.FC<ExternalSearchProps> = ({ query, onPlantSelect }) => {
  const isOnline = useNetwork();
  const [results, setResults] = useState<{ title: string; snippet: string; pageId: number }[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [temporaryUnavailable, setTemporaryUnavailable] = useState(false);

  useEffect(() => {
    if (!isOnline || !query.trim()) {
      setResults([]);
      setSearched(false);
      setTemporaryUnavailable(false);
      return;
    }

    const controller = new AbortController();
    setLoading(true);
    setTemporaryUnavailable(false);

    const run = async () => {
      try {
        const searchResults = await PlantDataService.searchExternal(query);
        if (controller.signal.aborted) return;
        setResults(searchResults);
      } catch {
        if (controller.signal.aborted) return;
        setResults([]);
        setTemporaryUnavailable(true);
      } finally {
        if (controller.signal.aborted) return;
        setLoading(false);
        setSearched(true);
      }
    };

    run();

    return () => {
      controller.abort();
    };
  }, [isOnline, query]);

  if (!isOnline) {
    return (
      <div style={{ textAlign: 'center', padding: '1rem', color: 'var(--ion-color-medium)' }}>
        <IonIcon icon={globeOutline} style={{ fontSize: '2rem' }} />
        <p>Search requires an internet connection</p>
      </div>
    );
  }

  return (
    <div style={{ marginTop: '1rem' }}>
      {loading && (
        <div style={{ textAlign: 'center', padding: '1rem' }}>
          <IonSpinner name="crescent" />
          <p>Searching plant sources...</p>
        </div>
      )}

      {searched && !loading && results.length === 0 && (
        <p style={{ textAlign: 'center', color: 'var(--ion-color-medium)' }}>
          {temporaryUnavailable ? 'Plant search is temporarily unavailable. Please try again shortly.' : 'No plant results found'}
        </p>
      )}

      {results.length > 0 && (
        <IonList>
          {results.map((result) => (
            <IonItem
              key={result.pageId}
              button
              onClick={() => onPlantSelect(result.pageId)}
            >
              <IonLabel>
                <h3>{result.title}</h3>
                <p>{result.snippet}</p>
              </IonLabel>
            </IonItem>
          ))}
        </IonList>
      )}
    </div>
  );
};

export default ExternalSearch;