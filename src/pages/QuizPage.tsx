import React, { useState, useEffect, useCallback } from 'react';
import { IonPage, IonContent, IonButton, IonText, IonProgressBar } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AppHeader from '../components/layout/AppHeader';
import QuizReview from '../components/quiz/QuizReview';
import { PlantDataService } from '../services/PlantDataService';
import { ImageService } from '../services/ImageService';
import { StorageService } from '../services/StorageService';
import type { Plant, QuizQuestion, QuizAnswer } from '../types';

function generateQuestions(plants: Plant[], count: number): QuizQuestion[] {
  if (plants.length < 4) return [];
  const shuffled = [...plants].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, Math.min(count, shuffled.length));

  return selected.map((plant, index) => {
    const type = Math.random() > 0.5 ? 'IMAGE_TO_NAME' : 'NAME_TO_IMAGE';
    const others = plants.filter(p => p.id !== plant.id).sort(() => Math.random() - 0.5).slice(0, 3);
    const allOptions = [plant, ...others].sort(() => Math.random() - 0.5);
    const correctIndex = allOptions.findIndex(p => p.id === plant.id);

    return {
      id: `q_${index}`,
      type: type as 'IMAGE_TO_NAME' | 'NAME_TO_IMAGE',
      plant,
      options: type === 'IMAGE_TO_NAME'
        ? allOptions.map(p => p.latinName)
        : allOptions.map(p => p.id),
      correctIndex,
      imageUrl: plant.thumbnail || undefined,
    };
  });
}

const QuizPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const history = useHistory();
  const [phase, setPhase] = useState<'start' | 'playing' | 'results' | 'review'>('start');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [highScore, setHighScore] = useState(0);
  const [plants, setPlants] = useState<Plant[]>([]);

  useEffect(() => {
    PlantDataService.initialize().then(() => {
      setPlants(PlantDataService.getBundledPlants());
    });
    StorageService.getQuizHighScore().then(score => setHighScore(score));
  }, []);

  const startQuiz = useCallback(() => {
    const qs = generateQuestions(plants, 10);
    setQuestions(qs);
    setAnswers([]);
    setCurrentIndex(0);
    setSelectedIndex(null);
    setPhase('playing');
  }, [plants]);

  const handleAnswer = useCallback((index: number) => {
    if (selectedIndex !== null || !questions[currentIndex]) return;
    setSelectedIndex(index);
    const question = questions[currentIndex];
    const newAnswers: QuizAnswer[] = [...answers, {
      questionId: question.id,
      plantId: question.plant.id,
      type: question.type,
      selectedIndex: index,
      correctIndex: question.correctIndex,
      isCorrect: index === question.correctIndex,
    }];
    setAnswers(newAnswers);

    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setSelectedIndex(null);
      } else {
        const correct = newAnswers.filter(a => a.isCorrect).length;
        const score = Math.round((correct / (questions.length || 1)) * 100);
        if (score > highScore) {
          StorageService.setQuizHighScore(score);
          setHighScore(score);
        }
        setPhase('results');
      }
    }, 1000);
  }, [selectedIndex, answers, currentIndex, questions, highScore]);

  const currentQuestion = questions[currentIndex];

  useEffect(() => {
    if (phase !== 'playing' || !questions.length) return;
    const nextIndex = currentIndex + 1;
    if (nextIndex >= questions.length) return;
    const nextQ = questions[nextIndex];
    if (!nextQ) return;
    const urls: string[] = [];
    if (nextQ.imageUrl) urls.push(nextQ.imageUrl);
    if (nextQ.type === 'NAME_TO_IMAGE') {
      nextQ.options.forEach(optId => {
        const p = plants.find(pl => pl.id === optId);
        if (p) {
          const thumb = ImageService.getPlantThumbnail(p);
          if (thumb) urls.push(thumb);
        }
      });
    }
    if (urls.length > 0) ImageService.prefetchImages(urls);
  }, [phase, currentIndex, questions, plants]);

  if (phase === 'start') {
    return (
      <IonPage>
        <AppHeader title={t('quiz.title')} />
        <IonContent className="ion-padding ion-text-center">
          <h1>{t('quiz.title')}</h1>
          {highScore > 0 && <p>{t('quiz.highScore', { score: highScore })}</p>}
          <IonButton onClick={startQuiz} size="large" color="success">
            {t('quiz.start')}
          </IonButton>
        </IonContent>
      </IonPage>
    );
  }

  if (phase === 'results') {
    const correct = answers.filter(a => a.isCorrect).length;
    const score = Math.round((correct / (questions.length || 1)) * 100);

    return (
      <IonPage>
        <AppHeader title={t('quiz.results')} />
        <IonContent className="ion-padding ion-text-center">
          <h1>{t('quiz.score')}</h1>
          <h2>{score}%</h2>
          <p>{t('quiz.outOf', { correct, total: questions.length })}</p>
          {score > highScore && <IonText color="success"><p>New high score!</p></IonText>}
          <IonButton onClick={startQuiz} color="success">{t('quiz.tryAgain')}</IonButton>
          <IonButton onClick={() => setPhase('review')} fill="outline" style={{ marginLeft: '8px' }}>
            {t('quiz.review')}
          </IonButton>
          <IonButton onClick={() => history.push('/study')} fill="outline" style={{ marginLeft: '8px' }}>
            {t('quiz.backToStudy')}
          </IonButton>
        </IonContent>
      </IonPage>
    );
  }

  if (phase === 'review' && questions.length > 0) {
    return (
      <QuizReview
        questions={questions}
        answers={answers}
        plants={plants}
        onBack={() => setPhase('start')}
      />
    );
  }

  if (!currentQuestion) return null;

  const getOptionStyle = (index: number): React.CSSProperties => {
    if (selectedIndex === null) return { cursor: 'pointer' };
    if (index === currentQuestion.correctIndex) return { borderColor: 'var(--ion-color-success)', background: 'var(--ion-color-success-tint)' };
    if (index === selectedIndex && index !== currentQuestion.correctIndex) return { borderColor: 'var(--ion-color-danger)', background: 'var(--ion-color-danger-tint)' };
    return { opacity: 0.5 };
  };

  return (
    <IonPage>
      <AppHeader title={t('quiz.title')} />
      <IonContent className="ion-padding">
        <IonProgressBar value={(currentIndex + 1) / questions.length} color="success" />
        <p style={{ textAlign: 'center' }}>{t('quiz.question', { current: currentIndex + 1, total: questions.length })}</p>

        {currentQuestion.type === 'IMAGE_TO_NAME' ? (
          <>
            {currentQuestion.imageUrl && (
              <img src={currentQuestion.imageUrl} alt="" style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '8px', marginBottom: '16px' }} />
            )}
            <p style={{ textAlign: 'center', fontWeight: 'bold' }}>{t('quiz.typeA')}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '16px' }}>
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  disabled={selectedIndex !== null}
                  aria-label={String(option)}
                  style={{ padding: '12px', border: '1px solid var(--ion-color-medium)', borderRadius: '8px', background: 'var(--ion-item-background)', ...getOptionStyle(index) }}
                >
                  {option}
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <p style={{ textAlign: 'center', fontWeight: 'bold' }}>
              {currentQuestion.plant.names[i18n.language] || currentQuestion.plant.names.en || currentQuestion.plant.latinName}
              <br />
              <em style={{ fontWeight: 'normal' }}>{currentQuestion.plant.latinName}</em>
            </p>
            <p style={{ textAlign: 'center' }}>{t('quiz.typeB')}</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '16px' }}>
              {currentQuestion.options.map((optionId, index) => {
                const optPlant = plants.find(p => p.id === optionId);
                const imgSrc = optPlant ? ImageService.getPlantThumbnail(optPlant) : '';
                return (
                  <button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    disabled={selectedIndex !== null}
                    aria-label={optPlant?.latinName || `Option ${index + 1}`}
                    style={{
                      border: '1px solid var(--ion-color-medium)', borderRadius: '8px',
                      background: 'var(--ion-item-background)', padding: '8px',
                      ...getOptionStyle(index),
                    }}
                  >
                    {imgSrc ? (
                      <img src={imgSrc} alt="" style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '4px' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100px', background: 'var(--ion-color-light)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {optPlant?.latinName?.charAt(0) || '?'}
                      </div>
                    )}
                    <p style={{ margin: '4px 0 0', fontSize: '0.75rem' }}>{optPlant?.latinName}</p>
                  </button>
                );
              })}
            </div>
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default QuizPage;