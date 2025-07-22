import Link from 'next/link'
import styles from './style.module.css'
import { FaXTwitter } from 'react-icons/fa6'
import { IoLogoGithub } from 'react-icons/io5'
import { LabelText } from '@/components/typography/LabelText'
import { TitleText } from '@/components/typography/TitleText'
import { ParagraphText } from '@/components/typography/ParagraphText'
import {
  GridThreeColumnLayout,
  GridTwoColumnLayout,
} from '@/components/layout/GirdLayout'

export const ProfileContent = () => {
  return (
    <div className={styles.profileContent}>
      <div className={styles.avatar}></div>
      <div className={styles.biography}>
        <div className={styles.profile}>
          <div className={styles.profileHeader}>
            <TitleText level="h2" size="xl" color="primary">
              andmohiko
            </TitleText>
            <div className={styles.description}>
              <LabelText size="sm" color="primary">
                株式会社スーパーハムスターCTO
              </LabelText>
              <div className={styles.verticalBorder} />
              <div className={styles.social}>
                <Link
                  href="https://github.com/andmohiko"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                >
                  <IoLogoGithub size={32} color="var(--color-primary)" />
                </Link>
                <Link
                  href="https://x.com/andmohiko"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="X"
                >
                  <FaXTwitter size={32} color="var(--color-primary)" />
                </Link>
              </div>
            </div>
          </div>

          <GridTwoColumnLayout>
            <ParagraphText size="md" color="primary">
              1996年 埼玉県生まれ。
              <br />
              大学ではコンピュータサイエンスを専攻し、大学院では機械学習とメンヘラの研究をしていました。
              <br />
              大学院を卒業後、フードデリバリーサービスを提供するmenu株式会社に新卒入社。サーバーサイドエンジニアとして従事。
            </ParagraphText>
            <ParagraphText size="md" color="primary">
              その後転職して、メンヘラテクノロジーに入社。開発責任者として複数のプロダクト開発やエンジニア採用、受託開発のプロジェクトマネジメントを担当しました。
              <br />
              現在は株式会社スーパーハムスターでCTOをしており、開発・マネジメント・採用などをしています。
            </ParagraphText>
          </GridTwoColumnLayout>
        </div>

        <div className={styles.sections}>
          <div className={styles.section}>
            <SectionHeading label="Tech" />
            <GridThreeColumnLayout>
              <SectionTile>
                <LabelText size="sm" color="primary">
                  Frontend
                </LabelText>
                <ParagraphText size="md" color="primary">
                  React
                  <br />
                  Vue.js
                  <br />
                  Astro
                </ParagraphText>
              </SectionTile>
              <SectionTile>
                <LabelText size="sm" color="primary">
                  Backend
                </LabelText>
                <ParagraphText size="md" color="primary">
                  TypeScript
                  <br />
                  Node.js
                  <br />
                  Hono
                  <br />
                  Python
                </ParagraphText>
              </SectionTile>
              <SectionTile>
                <LabelText size="sm" color="primary">
                  Tools
                </LabelText>
                <ParagraphText size="md" color="primary">
                  Firebase
                  <br />
                  GCP
                  <br />
                  BigQuery
                  <br />
                  PostgreSQL
                </ParagraphText>
              </SectionTile>
            </GridThreeColumnLayout>
          </div>
          <div className={styles.section}>
            <SectionHeading label="Thoughts" />
            <ParagraphText size="md" color="primary">
              ・
              <Link
                href="https://andmohiko.notion.site/2dc2fcfcb26941c1945ecb2ca73e2723?pvs=4"
                target="_blank"
                rel="noopener noreferrer"
              >
                キャリアについて
              </Link>
              <br />・
              <Link
                href="https://note.com/andmohiko/n/n4bc128b9083b"
                target="_blank"
                rel="noopener noreferrer"
              >
                経歴
              </Link>
              <br />・
              <Link
                href="https://note.com/andmohiko/n/nd7e1612a2b1f"
                target="_blank"
                rel="noopener noreferrer"
              >
                理想のエンジニア組織とチーム像について
              </Link>
            </ParagraphText>
          </div>
          <div className={styles.section}>
            <SectionHeading label="Likes" />
            <ParagraphText size="md" color="primary">
              ・シーシャ
              <br />
              ・自作キーボード
              <br />
              ・スマブラ
              <br />
              ・アチャモ
            </ParagraphText>
          </div>
          <div className={styles.section}>
            <SectionHeading label="Gears" />
            <GridTwoColumnLayout gap={4}>
              <SectionTile>
                <LabelText size="sm" color="primary">
                  Keyboard
                </LabelText>
                <ParagraphText size="md" color="primary">
                  cocot46plus
                  <br />
                  Corne Cherry V3
                </ParagraphText>
              </SectionTile>
              <SectionTile>
                <LabelText size="sm" color="primary">
                  Camera
                </LabelText>
                <ParagraphText size="md" color="primary">
                  Sigma dp1Quattro
                </ParagraphText>
              </SectionTile>
            </GridTwoColumnLayout>
          </div>
        </div>
      </div>
    </div>
  )
}

const SectionHeading = ({ label }: { label: string }): React.ReactNode => {
  return <h3 className={styles.sectionHeading}>{label}</h3>
}

const SectionTile = ({
  children,
}: {
  children: React.ReactNode
}): React.ReactNode => {
  return <div className={styles.sectionTile}>{children}</div>
}
