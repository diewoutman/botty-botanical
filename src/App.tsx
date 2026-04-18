import React, { useEffect, useState } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { IonApp, IonTabs, IonRouterOutlet, IonTabBar, IonTabButton, IonIcon, IonLabel, IonSpinner } from '@ionic/react';
import { IonReactHashRouter } from '@ionic/react-router';
import { leaf, helpCircle, settings } from 'ionicons/icons';
import { useTranslation } from 'react-i18next';
import { LanguageProvider } from './context/LanguageContext';
import { NetworkProvider } from './context/NetworkContext';
import { PlantDataService } from './services/PlantDataService';
import { PlantDetailService } from './services/PlantDetailService';
import StudyPage from './pages/StudyPage';
import DetailPage from './pages/DetailPage';
import QuizPage from './pages/QuizPage';
import SettingsPage from './pages/SettingsPage';

const TabBar: React.FC = () => {
  const { t } = useTranslation();

  return (
    <IonTabBar slot="bottom">
      <IonTabButton tab="study" href="/study">
        <IonIcon icon={leaf} />
        <IonLabel>{t('tabs.study')}</IonLabel>
      </IonTabButton>
      <IonTabButton tab="quiz" href="/quiz">
        <IonIcon icon={helpCircle} />
        <IonLabel>{t('tabs.quiz')}</IonLabel>
      </IonTabButton>
      <IonTabButton tab="settings" href="/settings">
        <IonIcon icon={settings} />
        <IonLabel>{t('tabs.settings')}</IonLabel>
      </IonTabButton>
    </IonTabBar>
  );
};

const App: React.FC = () => {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!initialized) {
      Promise.all([PlantDataService.initialize(), PlantDetailService.initialize()])
        .then(() => {
          console.log('Planten Kennis: Data initialized');
          setInitialized(true);
        })
        .catch((err) => {
          console.error('Failed to initialize:', err);
          setInitialized(true);
        });
    }
  }, [initialized]);

  if (!initialized) {
    return (
      <IonApp>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <IonSpinner name="crescent" />
        </div>
      </IonApp>
    );
  }

  return (
    <LanguageProvider>
      <NetworkProvider>
        <IonApp>
          <IonReactHashRouter>
            <IonTabs>
              <IonRouterOutlet>
                <Route exact path="/" render={() => <Redirect to="/study" />} />
                <Route exact path="/study" component={StudyPage} />
                <Route path="/plant/:id" component={DetailPage} />
                <Route exact path="/quiz" component={QuizPage} />
                <Route exact path="/settings" component={SettingsPage} />
              </IonRouterOutlet>
              <TabBar />
            </IonTabs>
          </IonReactHashRouter>
        </IonApp>
      </NetworkProvider>
    </LanguageProvider>
  );
};

export default App;