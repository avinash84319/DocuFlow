import React from 'react';
import { GraphCanvas } from '../components/graph/GraphCanvas';
import { RightPanel } from '../components/panels/RightPanel';
import { AddNodeModal } from '../components/graph/AddNodeModal';
import '@xyflow/react/dist/style.css';

function App() {
  return (
    <main className="w-screen h-screen flex overflow-hidden">
      {/* Main Canvas Area */}
      <GraphCanvas />

      {/* Slide-out Sidebar Panel */}
      <RightPanel />

      <AddNodeModal />
    </main>
  );
}

export default App;
