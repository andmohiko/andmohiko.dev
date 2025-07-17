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
          time="2021.08.01 (24歳)"
          title="メンヘラテクノロジーに1人目の正社員として入社"
          description="新卒で入社した株式会社menuを4ヶ月で辞め、学生の頃から働いていたメンヘラテクノロジーに入社しました。開発責任者として、自社プロダクトを開発しながら受託開発のPMをしました。"
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
          time="2018.08.08 (21歳)"
          title="ハッシュタグ #駆け出しエンジニアと繋がりたい をつくる"
          description={
            <>
              インターン先で学生エンジニアを採用するために、学生エンジニアが交流できるハッシュタグを作りました。最初の1ヶ月はハッシュタグが使われるように盛り上げていたのですが、学生を2名採用できて目的を達成したので、ハッシュタグのパトロールをやめたらこの世の終わりみたいになってしまいました。
              <a
                href="https://x.com/andmohiko/status/1027206353708695552"
                target="_blank"
                rel="noopener noreferrer"
              >
                そのツイートはこちらです。
              </a>
            </>
          }
        />
        <LifeEvent
          time="1998.02.01 (1歳)"
          title="イギリスへ引っ越す"
          description="イギリスの田舎に引っ越しました。町から出ると一面が草原で羊しかいないみたいな場所に住んでました。近所のリトミックに通い、サムとサーシャとリディアと仲良くなります。機関車トーマスに激ハマりします。この頃は自分が町で唯一のアジア人という自覚がなく、人種という概念をまだ理解していません。"
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
