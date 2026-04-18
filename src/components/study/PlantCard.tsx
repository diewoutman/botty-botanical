import React from 'react';
import { IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonBadge } from '@ionic/react';
import { useTranslation } from 'react-i18next';
import { ImageService } from '../../services/ImageService';
import type { Plant } from '../../types';

interface PlantCardProps {
  plant: Plant;
  onClick: (id: string) => void;
}

const PlantCard: React.FC<PlantCardProps> = ({ plant, onClick }) => {
  const { i18n } = useTranslation();
  const displayName = plant.names[i18n.language] || plant.names.en || plant.latinName;
  const imageUrl = ImageService.getPlantThumbnail(plant);
  const BADGE_LIMIT = 4;
  const visibleTraits = plant.traits ? Object.entries(plant.traits).slice(0, BADGE_LIMIT) : [];

  return (
    <IonCard button onClick={() => onClick(plant.id)} style={{ cursor: 'pointer' }} role="button" aria-label={displayName}>
      <img
        src={imageUrl}
        alt={displayName}
        style={{ width: '100%', height: '200px', objectFit: 'cover' }}
        loading="lazy"
      />
      <IonCardHeader>
        <IonCardTitle>{displayName}</IonCardTitle>
        <IonCardSubtitle>{plant.latinName}</IonCardSubtitle>
      </IonCardHeader>
      {visibleTraits.length > 0 && (
        <div style={{ padding: '0 16px 12px', display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
          {visibleTraits.map(([key, value]) =>
            value ? (
              <IonBadge key={key} color="success" style={{ fontSize: '0.7rem' }}>
                {key}: {String(value)}
              </IonBadge>
            ) : null
          )}
        </div>
      )}
    </IonCard>
  );
};

export default PlantCard;