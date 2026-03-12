'use client'

import { usePathname } from 'next/navigation'
import { Blog } from '@/types/blog'
import { Work } from '@/types/work'
import { BlogList } from '../../blogs/components/blog-list'
import { WorkList } from '../work-list'

type Props = {
  works: Work[]
  blogs: Blog[]
}

export const DefaultContainer = ({ works, blogs }: Props) => {
  const pathname = usePathname()
  const isInBlogPage = pathname.includes('/blogs')
  const isInWorkPage = pathname.includes('/works')

  if (isInBlogPage) {
    return <BlogList blogs={blogs} />
  }
  if (isInWorkPage) {
    return <WorkList works={works} />
  }
  return null
}
