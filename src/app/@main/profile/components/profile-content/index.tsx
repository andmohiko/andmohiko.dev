import Link from 'next/link'
import styles from './style.module.css'
import { FaXTwitter } from 'react-icons/fa6'
import { IoLogoGithub } from 'react-icons/io5'
import { LabelText } from '@/components/typography/LabelText'
import { TitleText } from '@/components/typography/TitleText'
import { ParagraphText } from '@/components/typography/ParagraphText'

export const ProfileContent = () => {
  return (
    <div className={styles.profileContent}>
      <div className={styles.avatar}></div>
      <div className={styles.biography}>
        <div className={styles.sections}>
          <TitleText level="h2" size="xl" color="primary">
            andmohiko
          </TitleText>
          <div className={styles.description}>
            <div className={styles.occupation}>
              <LabelText size="sm" color="primary">
                株式会社スーパーハムスターCTO
              </LabelText>
            </div>
            <div className={styles.verticalBorder} />
            <div className={styles.social}>
              <Link
                href="https://github.com/andmohiko"
                target="_blank"
                rel="noopener noreferrer"
              >
                <IoLogoGithub size={32} color="var(--color-primary)" />
              </Link>
              <Link
                href="https://x.com/andmohiko"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaXTwitter size={32} color="var(--color-primary)" />
              </Link>
            </div>
          </div>
        </div>
        <div className={styles.sections}>
          1996年 東京都生まれ。 
          大学ではコンピュータサイエンスを専攻し、大学院では機械学習とメンヘラの研究をしていました。
          大学院を卒業後、フードデリバリーサービスを提供するmenu株式会社に新卒入社。サーバーサイドエンジニアとして従事。
          その後転職して、メンヘラテクノロジーに入社。開発責任者として複数のプロダクト開発やエンジニア採用、受託開発のプロジェクトマネジメントを担当しました。
          現在は株式会社スーパーハムスターでCTOをしており、開発・マネジメント・採用などをしています。
        </div>
        <div className={styles.section}>
          <SectionHeading label="Tech" />
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
          <SectionHeading label="Thoughts" />
          <ParagraphText size="md" color="primary">
            ・キャリアについて
            <br />
            ・経歴
            <br />
            ・理想のエンジニア組織とチーム像について
          </ParagraphText>
        </div>
        <div className={styles.section}>
          <SectionHeading label="Gears" />
          <ParagraphText size="md" color="primary">
            ・MacBook Pro 16インチ 2024
            <br />
            ・iPhone 15 Pro
            <br />
          </ParagraphText>
        </div>
      </div>
    </div>
  )
}

const SectionHeading = ({ label }: { label: string }) => {
  return <h3 className={styles.sectionHeading}>{label}</h3>
}
