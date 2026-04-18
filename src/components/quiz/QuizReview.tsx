import React from 'react';
import { IonPage, IonContent, IonList, IonItem, IonLabel, IonIcon, IonButton } from '@ionic/react';
import { checkmarkCircle, closeCircle } from 'ionicons/icons';
import { useTranslation } from 'react-i18next';
import AppHeader from '../../components/layout/AppHeader';
import type { QuizQuestion, QuizAnswer } from '../../types';

interface QuizReviewProps {
  questions: QuizQuestion[];
  answers: QuizAnswer[];
  plants: { id: string; latinName: string; names: Record<string, string>; thumbnail: string | null; taxonomy?: { family?: string } }[];
  onBack: () => void;
}

const QuizReview: React.FC<QuizReviewProps> = ({ questions, answers, plants, onBack }) => {
  const { t, i18n } = useTranslation();

  return (
    <IonPage>
      <AppHeader title="Review" />
      <IonContent>
        <IonList>
          {questions.map((question, index) => {
            const answer = answers[index];
            if (!answer) return null;
            const isCorrect = answer.isCorrect;
            const correctPlant = plants.find(p => p.id === question.plant.id);
            const displayName = correctPlant
              ? (correctPlant.names[i18n.language] || correctPlant.names.en || correctPlant.latinName)
              : question.plant.latinName;

            return (
              <IonItem key={question.id} style={{ '--padding-start': '8px' }}>
                <IonIcon
                  icon={isCorrect ? checkmarkCircle : closeCircle}
                  color={isCorrect ? 'success' : 'danger'}
                  slot="start"
                  style={{ fontSize: '1.5rem', marginRight: '8px' }}
                />
                <IonLabel>
                  <h3>Q{index + 1}: {displayName}</h3>
                  <p style={{ color: isCorrect ? 'var(--ion-color-success)' : 'var(--ion-color-danger)' }}>
                    {isCorrect
                      ? t('quiz.correct')
                      : `${t('quiz.incorrect')}`}
                  </p>
                  {!isCorrect && (
                    <p style={{ color: 'var(--ion-color-success)', fontSize: '0.85rem' }}>
                      Correct: {question.plant.latinName}
                    </p>
                  )}
                </IonLabel>
              </IonItem>
            );
          })}
        </IonList>
        <div style={{ padding: '16px' }}>
          <IonButton expand="block" onClick={onBack}>{t('quiz.tryAgain')}</IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default QuizReview;