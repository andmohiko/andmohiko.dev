import { Metadata } from 'next'
import styles from './style.module.css'
import { ProfileContent } from './components/profile-content'
import { ContentPaginator } from '@/components/navigation/content-paginator'

export const metadata: Metadata = {
  title: 'Profile',
  description: 'Profile',
}

export default async function ProfilePage() {
  return (
    <main className={styles.profileMain}>
      <ProfileContent />
      人生年表
      <ContentPaginator
        previousLabel="blog"
        nextLabel="work"
        previousSlug="/blogs"
        nextSlug="/"
      />
    </main>
  )
}
