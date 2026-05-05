import { useState, useEffect } from 'react';
import { useHVACStore } from './lib/store/hvac-store';
import { ThemeProvider } from './lib/theme/theme-context';
import { ToastContainer } from './components/toast-container';
import HomeScreen from './pages/Home';
import EditorScreen from './pages/Editor';
import TrainingPage from './pages/Training';

function AppContent() {
  const { currentSystem, hydrate } = useHVACStore();
  const [currentPage, setCurrentPage] = useState<'home' | 'editor' | 'training'>('home');

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return (
    <div className="w-full h-screen bg-background text-foreground">
      {currentPage === 'home' && (
        <HomeScreen
          onNavigateToEditor={() => setCurrentPage('editor')}
          onNavigateToTraining={() => setCurrentPage('training')}
        />
      )}
      {currentPage === 'editor' && currentSystem && (
        <EditorScreen onNavigateHome={() => setCurrentPage('home')} />
      )}
      {currentPage === 'training' && (
        <TrainingPage
          onNavigateToEditor={() => setCurrentPage('editor')}
          onNavigateHome={() => setCurrentPage('home')}
        />
      )}
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
