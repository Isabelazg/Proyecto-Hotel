import { Outlet } from 'react-router-dom'
import PublicHeader from '../components/PublicHeader'
import PublicFooter from '../components/PublicFooter'

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader />
      <main className="flex-grow">
        <Outlet />
      </main>
      <PublicFooter />
    </div>
  )
}
