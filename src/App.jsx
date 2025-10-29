import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './layouts/Layout'
import Movies from './pages/Movies'
import NotFound from './pages/NotFound'
import Overview from './pages/Overview'
import Series from './pages/Series'
import Episodes from './pages/Episodes'
import Channels from './pages/Channels'
import Users from './pages/Users'
import Subscriptions from './pages/Subscriptions'
import UserSubscribtions from './pages/UserSubscribtions'
import Settings from './pages/Settings'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Overview />} />
          <Route path="movies" element={<Movies />} />
          <Route path="series" element={<Series />} />
          <Route path="episodes" element={<Episodes />} />
          <Route path="channels" element={<Channels />} />
          <Route path="users" element={<Users />} />
          <Route path="subscriptions" element={<Subscriptions />} />
          <Route path="user-subscriptions" element={<UserSubscribtions />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
