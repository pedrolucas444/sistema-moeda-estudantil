import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Index from './pages/Index'

// Simple router shell — root (/) now points to src/pages/Index
const App = () => (
  <BrowserRouter>
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950">
      <Routes>
        <Route path="/" element={<Index />} />
      </Routes>
    </div>
  </BrowserRouter>
)

export default App