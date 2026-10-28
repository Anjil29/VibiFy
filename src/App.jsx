import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <BrowserRouter>
      <div className="App min-h-screen bg-slate-950 font-sans antialiased text-white selection:bg-emerald-500/30 selection:text-emerald-300">
        <AppRoutes />
      </div>
    </BrowserRouter>
  );
}

export default App;
