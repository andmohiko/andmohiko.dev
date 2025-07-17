import { Metadata } from 'next'
import styles from './style.module.css'
import { ProfileContent } from './components/profile-content'
import { ContentPaginator } from '@/components/navigation/content-paginator'
import { LifeEventsTimeline } from './components/life-events-timeline'

export const metadata: Metadata = {
  title: 'Profile',
  description: 'Profile',
}

export default async function ProfilePage() {
  return (
    <main className={styles.profileMain}>
      <ProfileContent />
      <LifeEventsTimeline />
      <ContentPaginator
        previousLabel="blog"
        nextLabel="work"
        previousSlug="/blogs"
        nextSlug="/"
      />
    </main>
  )
}
