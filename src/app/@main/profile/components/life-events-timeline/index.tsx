import styles from './style.module.css'
import { LabelText } from '@/components/typography/LabelText'
import { TitleText } from '@/components/typography/TitleText'
import { ParagraphText } from '@/components/typography/ParagraphText'

export const LifeEventsTimeline = () => {
  return (
    <div className={styles.lifeEventsTimeline}>
      <TitleText level="h2" size="xl">
        人生年表
      </TitleText>
      <div className={styles.lifeEventsTimelineContent}>
        <LifeEvent
          time="2024.03.20"
          title="スーパーハムスターCTO就任"
          description="株式会社スーパーハムスターのCTOになりました。"
          isFirst
        />
        <LifeEvent
          time="2021.04.01 (24歳)"
          title="menu株式会社に入社"
          description="新卒で株式会社menuにサーバーサイドエンジニアとして就職しました。"
        />
        <LifeEvent
          time="2019.12.18 (23歳)"
          title="メンヘラテクノロジーJoin"
          description="株式会社メンヘラテクノロジーにエンジニアとしてジョインしました。"
        />
        <LifeEvent
          time="1998.02.01 (1歳)"
          title="イギリスへ引っ越す"
          description="イギリスの田舎に引っ越しました。町から出ると一面が草原で羊しかいないみたいな場所に住んでました。"
        />
        <LifeEvent
          time="1996.10.12 (0歳)"
          title="生まれる"
          description="埼玉県で生まれました。オギャー"
          isLast
        />
      </div>
    </div>
  )
}

type LifeEventProps = {
  time: string
  title: string
  description: string | React.ReactNode
  isFirst?: boolean
  isLast?: boolean
}

const LifeEvent = ({
  time,
  title,
  description,
  isFirst,
  isLast,
}: LifeEventProps) => {
  return (
    <div className={styles.lifeEvent}>
      {isFirst && <div className={styles.lineUpperFirst} />}
      {!isFirst && <div className={styles.lineUpper} />}
      {!isLast && <div className={styles.lineLower} />}
      <LabelText size="sm">{time}</LabelText>
      <TitleText level="h3" size="md">
        {title}
      </TitleText>
      <ParagraphText size="md" opacity="50">
        {description}
      </ParagraphText>
    </div>
  )
}
