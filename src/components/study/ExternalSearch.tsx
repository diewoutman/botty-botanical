import React, { useState } from 'react';
import { IonItem, IonLabel, IonList, IonButton, IonSpinner, IonIcon } from '@ionic/react';
import { globeOutline } from 'ionicons/icons';
import { PlantApiService } from '../../services/PlantApiService';
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

  const handleSearch = async () => {
    if (!isOnline || !query.trim()) return;
    setLoading(true);
    try {
      const searchResults = await PlantApiService.searchWikipedia(query);
      setResults(searchResults);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
      setSearched(true);
    }
  };

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
      {!searched && !loading && (
        <IonButton fill="outline" expand="block" onClick={handleSearch}>
          Search Wikipedia for &quot;{query}&quot;
        </IonButton>
      )}

      {loading && (
        <div style={{ textAlign: 'center', padding: '1rem' }}>
          <IonSpinner name="crescent" />
          <p>Searching Wikipedia...</p>
        </div>
      )}

      {searched && !loading && results.length === 0 && (
        <p style={{ textAlign: 'center', color: 'var(--ion-color-medium)' }}>
          No results found on Wikipedia
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