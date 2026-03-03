import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ChatBot from './components/ChatBot';
import Home from './pages/Home';
import SchemeDetail from './pages/SchemeDetail';
import Recommend from './pages/Recommend';
import Admin from './pages/Admin';
import Compare from './pages/Compare';
import Saved from './pages/Saved';

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/scheme/:id" element={<SchemeDetail />} />
          <Route path="/recommend" element={<Recommend />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/saved" element={<Saved />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
      <Footer />
      <ChatBot />
    </BrowserRouter>
  );
}
