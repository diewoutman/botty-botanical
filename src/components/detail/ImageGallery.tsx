import React, { useState } from 'react';
import { IonIcon } from '@ionic/react';
import { closeOutline, chevronBackOutline, chevronForwardOutline } from 'ionicons/icons';

interface ImageGalleryProps {
  images: { url: string; thumbnailUrl?: string; photographer: string; license: string; sourceUrl: string }[];
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images }) => {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (!images || images.length === 0) return null;

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const goToPrev = () => setLightboxIndex(prev => prev !== null ? (prev - 1 + images.length) % images.length : null);
  const goToNext = () => setLightboxIndex(prev => prev !== null ? (prev + 1) % images.length : null);

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(images.length, 3)}, 1fr)`, gap: '8px', marginTop: '8px' }}>
        {images.map((img, index) => (
          <div
            key={index}
            onClick={() => openLightbox(index)}
            style={{ cursor: 'pointer', borderRadius: '8px', overflow: 'hidden' }}
          >
            <img
              src={img.thumbnailUrl || img.url}
              alt={`Plant image ${index + 1}`}
              style={{ width: '100%', height: '120px', objectFit: 'cover', display: 'block' }}
              loading="lazy"
            />
          </div>
        ))}
      </div>

{lightboxIndex !== null && images[lightboxIndex] && (() => {
          const img = images[lightboxIndex]!;
          return (
            <div
              onClick={closeLightbox}
              style={{
                position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                background: 'rgba(0,0,0,0.9)', zIndex: 10000,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <button
                onClick={(e) => { e.stopPropagation(); closeLightbox(); }}
                style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: 'white', fontSize: '2rem', cursor: 'pointer', zIndex: 10001 }}
              >
                <IonIcon icon={closeOutline} />
              </button>

              <button
                onClick={(e) => { e.stopPropagation(); goToPrev(); }}
                style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.5)', border: 'none', color: 'white', fontSize: '2rem', cursor: 'pointer', borderRadius: '50%', padding: '8px' }}
              >
                <IonIcon icon={chevronBackOutline} />
              </button>

              <img
                src={img.url}
                alt={`Plant image ${lightboxIndex + 1}`}
                onClick={(e) => e.stopPropagation()}
                style={{ maxWidth: '90vw', maxHeight: '80vh', objectFit: 'contain' }}
              />

              <button
                onClick={(e) => { e.stopPropagation(); goToNext(); }}
                style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.5)', border: 'none', color: 'white', fontSize: '2rem', cursor: 'pointer', borderRadius: '50%', padding: '8px' }}
              >
                <IonIcon icon={chevronForwardOutline} />
              </button>

              <div onClick={(e) => e.stopPropagation()} style={{ marginTop: '16px', color: 'white', textAlign: 'center', fontSize: '0.8rem' }}>
                {img.photographer && <p>Photo: {img.photographer}</p>}
                {img.license && <p>License: {img.license}</p>}
                <p>{lightboxIndex + 1} / {images.length}</p>
              </div>
            </div>
          );
        })()}
    </div>
  );
};

export default ImageGallery;