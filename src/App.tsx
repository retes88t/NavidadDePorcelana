import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Inicio from './pages/Inicio'
import Personajes from './pages/Personajes'
import Actos from './pages/Actos'
import Escenas from './pages/Escenas'
import Arbol from './pages/Arbol'
import Sinopsis from './pages/Sinopsis'
import Guion from './pages/Guion'
import Practica from './pages/Practica'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Inicio />} />
        <Route path="personajes" element={<Personajes />} />
        <Route path="actos" element={<Actos />} />
        <Route path="escenas" element={<Escenas />} />
        <Route path="arbol" element={<Arbol />} />
        <Route path="sinopsis" element={<Sinopsis />} />
        <Route path="guion" element={<Guion />} />
        <Route path="practica" element={<Practica />} />
        <Route path="*" element={<Inicio />} />
      </Route>
    </Routes>
  )
}
