/**
 * ポートフォリオ詳細コンポーネント
 */

'use client'

import { Work } from '@/types/work'
import styles from './style.module.css'
import { BaseModal } from '@/components/layout/base-modal'
import { TitleText } from '@/components/typography/TitleText'
import { ContentPaginator } from '@/components/navigation/content-paginator'
import { LabelText } from '@/components/typography/LabelText'
import Image from 'next/image'
import { ParagraphText } from '@/components/typography/ParagraphText'
import { LabelBadge } from '@/components/displays/label-badge'

/**
 * WorkModalコンポーネントのプロパティ型
 */
type WorkModalProps = {
  /** ポートフォリオデータ */
  work: Work
  /** 前のポートフォリオのスラッグ */
  previousSlug?: string
  /** 次のポートフォリオのスラッグ */
  nextSlug?: string
}

/**
 * ポートフォリオ詳細モーダルコンポーネント
 *
 * @param {WorkModalProps} props - コンポーネントのプロパティ
 * @returns {JSX.Element} ポートフォリオ詳細モーダル
 */
export const WorkContent: React.FC<WorkModalProps> = ({
  work,
  previousSlug,
  nextSlug,
}) => {
  return (
    <div className={styles.wrapper}>
      <BaseModal>
        {work ? (
          <article className={styles.content}>
            <Image
              src={work.thumbnail.url}
              alt={work.title}
              width={780}
              height={320}
              className={styles.thumbnail}
            />
            <div className={styles.texts}>
              <div className={styles.header}>
                <TitleText level="h2" size="lg" color="primary">
                  {work.title}
                </TitleText>
                <ParagraphText color="primary">
                  {work.description}
                </ParagraphText>
                <div className={styles.tags}>
                  {work.tags.map((tag) => (
                    <LabelBadge key={tag} label={tag} />
                  ))}
                </div>
              </div>
              <div
                dangerouslySetInnerHTML={{ __html: work.body }}
                className={styles.body}
              />
            </div>
          </article>
        ) : (
          <LabelText size="lg" color="primary">
            loading...
          </LabelText>
        )}
      </BaseModal>
      <ContentPaginator
        previousSlug={previousSlug ? `/works/${previousSlug}` : undefined}
        nextSlug={nextSlug ? `/works/${nextSlug}` : undefined}
      />
    </div>
  )
}
