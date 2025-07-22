import styles from './style.module.css'
import { LabelText } from '@/components/typography/LabelText'
import { TitleText } from '@/components/typography/TitleText'
import { ParagraphText } from '@/components/typography/ParagraphText'

type LifeEvent = {
  time: string
  title: string
  description: React.ReactNode
}

const lifeEvents: LifeEvent[] = [
  {
    time: '2024.03.20 (27歳)',
    title: 'スーパーハムスターCTO就任',
    description: '株式会社スーパーハムスターのCTOになりました。',
  },
  {
    time: '2021.08.01 (24歳)',
    title: 'メンヘラテクノロジーに1人目の正社員として入社',
    description:
      '新卒で入社した株式会社menuを4ヶ月で辞め、学生の頃から働いていたメンヘラテクノロジーに入社しました。開発責任者として、自社プロダクトを開発しながら受託開発のPMをしました。',
  },
  {
    time: '2019.12.18 (23歳)',
    title: 'メンヘラテクノロジーJoin',
    description: 'メンヘラテクノロジーにエンジニアとしてジョインしました。',
  },
  {
    time: '2018.08.08 (21歳)',
    title: 'ハッシュタグ #駆け出しエンジニアと繋がりたい をつくる',
    description: (
      <>
        インターン先で学生エンジニアを採用するために、学生エンジニアが交流できるハッシュタグを作りました。最初の1ヶ月はハッシュタグが使われるように盛り上げていたのですが、学生を2名採用できて目的を達成したので、ハッシュタグのパトロールをやめたらこの世の終わりみたいになってしまいました。
        <a
          href="https://x.com/andmohiko/status/1027206353708695552"
          target="_blank"
          rel="noopener noreferrer"
        >
          ツイートはこちら。
        </a>
      </>
    ),
  },
  {
    time: '2015.04.01 (18歳)',
    title: '早稲田大学に入学',
    description:
      '早稲田大学基幹理工学部に入学する。進振りがある学部だったため、大学1年生の間は情報系以外にも数学や機械系の人とも過ごす。',
  },
  {
    time: '2013.07.05（17歳）',
    title: 'ブレフロにハマる',
    description:
      '「ブレイブフロンティア」という当時誰もやっていなかったソシャゲを始める。攻略のためにLINEグループを作り、Twitterで参加者を集める。最大で100人超えのグループの主を務める。趣味を共有できる人が周りにいなければ自分でコミュニティをつくるという手段があることに気づく。',
  },
  {
    time: '2013.02.01 (17歳)',
    title: '苦手なベクトルを克服する',
    description:
      '数2Bのベクトルが苦手で成績の足を引っ張っていたので、集中的に勉強して逆に得意分野にする。課題を戦略的に解決するという発想を手にいれる。',
  },
  {
    time: '2012.04.08 (16歳)',
    title: '受験勉強のスイッチが入る',
    description:
      '友達から「高3はみんな頑張るから受験で差がつくのは高2の時」ということを力説され、受験勉強を始める。1日4時間勉強するようになり、夏頃から数学の成績が伸び始める。',
  },
  {
    time: '2012.12.05 (16歳)',
    title: 'DTMを始める',
    description: '歌ってみたのMixを始める。たまにニコニコ生放送もする。',
  },
  {
    time: '2012.08.03 (15歳)',
    title: '初めてのオフ会',
    description:
      'インターネットで知り合った人と会うということを初めて体験する。',
  },
  {
    time: '2012.04.08 (15歳)',
    title: '攻玉社高校に入学',
    description:
      '中高一貫校のため、そのまま高校に進学する。部活は引き続き水泳部を続ける。',
  },
  {
    time: '2012.01.15 (15歳)',
    title: 'Skypeで夜な夜な通話する',
    description:
      'インターネットで繋がった人と夜な夜なSkypeで通話するようになる。夜更かしをするようになり、身長の伸びが止まる。',
  },
  {
    time: '2011.01.11 (14歳)',
    title: 'インターネットを始める',
    description:
      'TwitterやBBSへの書き込みなどでインターネット上の人との交流を始める。「ネットの友達」というものができる。',
  },
  {
    time: '2010.11.26 (14歳)',
    title: 'ハロプロにハマる',
    description:
      'イナズマイレブンのEDで聴いたBerryz工房をきっかけにハロプロにハマる。この時に作ったメールアドレスで一生ベリヲタであることを背負う。',
  },
  {
    time: '2010.01.08 (13歳)',
    title: 'ボカロを聴き始める',
    description:
      'TSUTAYAでたまたま「初音ミク ベスト〜memories〜」を借りてボカロを聴き始める。',
  },
  {
    time: '2009.05.16 (12歳)',
    title: '水泳部に入る',
    description:
      '小学生から続けていたので水泳部に入る。土日含めて週6で練習があり、6年間毎日学校に通う生活が始まる。',
  },
  {
    time: '2009.04.08 (12歳)',
    title: '攻玉社中学校に入学',
    description:
      '攻玉社という都内の中高一貫の男子校に入学する。入学時に席が近かった開成落ちの2人とたまたま仲良くなる。この交友関係が中高生活の特に後半で効いてくる。',
  },
  {
    time: '2007.03.01 (10歳)',
    title: 'ディズニーチャンネルで英語を維持する',
    description:
      '「ハイスクールミュージカル」「スイートライフ」「ウェイバリー通りのウィザードたち」にハマる。毎日英語に触れることでなんとか英語のリスニング力を維持する。',
  },
  {
    time: '2006.12.01 (10歳)',
    title: '3.14の段を覚える',
    description:
      '塾の往復時間がひまだったので3.14の段を暗記したら円周率を使った計算が速くなった。自分は記憶力で戦うタイプだと気づく。',
  },
  {
    time: '2006.08.01 (10歳)',
    title: '中学受験の受験勉強を始める',
    description:
      'クラスの半分以上が中学受験するため、周りと同じように塾に通い始める。SAPIXの中だとレベルの低いクラスにいたため、自分は勉強ができない方だという自認を持つ。',
  },
  {
    time: '2006.05.01 (10歳)',
    title: 'ポケモンのルビーをやりこむ',
    description:
      '家がゲーム禁止だったため、周りがDSをやっている中、友達のもう使わなくなったゲームボーイアドバンスを借りてポケモンのルビーやりこむ。人生で一番思い出に残っているゲーム。',
  },
  {
    time: '2005.11.01 (9歳)',
    title: 'ポケモンカードを自作して学校で配る',
    description:
      'ポケモンカードを買ってもらえなかったので自分で作り始める。壊れカードだったので同級生には受け入れられなかったが、無いものは作るという考え方を身につける。',
  },
  {
    time: '2005.08.01 (8歳)',
    title: '水泳を始める',
    description:
      'プールの授業でクラスで自分だけ泳げなかったことに危機感を持つ。小学生の間は毎年プールの授業があるため、今のうちに克服しておかなければと思い、スイミングスクールに通い始める。この頃は自分が高3まで水泳を続けるとは思っていなかった。',
  },
  {
    time: '2004.07.04 (7歳)',
    title: '日本に帰国する',
    description: (
      <>
        日本の公立の小学校に通う。それまで日本語は両親との会話でしか使ったことがないため、学校で使われる日本語がわからず、同級生から悪口を言われても理解できていない。
        <br />
        英語だと一人称は「I」で済むが、日本語には僕・俺・私があり、他の人は何を基準に選んだり使い分けているのかわからず、一人称の旅が始まる。
      </>
    ),
  },
  {
    time: '2003.09.01 (6歳)',
    title: 'フランスに引っ越す',
    description:
      'パリのブリティッシュスクールに通い始める。インド人の友達が優秀すぎて自分は勉強が得意という自認ではない。ハリーポッターを原書で読んでいた。',
  },
  {
    time: '2003.08.01 (5歳)',
    title: 'はじめてのテレビゲーム - スマブラDX',
    description:
      '一時帰国したときに近所の家で初めてテレビゲームというものを体験する。ゲームキューブのスマブラをやらされ、操作方法も勝利条件もわからないままロイを選んでとりあえずプレイする。今でも魂のメインキャラがロイなのはこの時がきっかけ。',
  },
  {
    time: '2002.04.01 (4歳)',
    title: 'バイオリンを始める',
    description:
      '同級生の影響でバイオリンを始める。小学生まで続けましたがもう弾けません。',
  },
  {
    time: '2000.09.01 (3歳)',
    title: 'ドイツに引っ越す',
    description: (
      <>
        ドイツのインターナショナルスクールに通い始める。初めて日本人コミュニティというものに出会うが馴染めず、ドイツ人とアメリカン人の友達とばかり遊んでいた。
        <br />
        自分がバイリンガルであるという自覚がなく、学校では英語を話し、家では日本語を話すことが当たり前だと思っている。アメリカ人の友達も皆そうしていると思っていたらしい。
      </>
    ),
  },
  {
    time: '1999.12.01 (3歳)',
    title: 'アルファベットとひらがなを覚える',
    description: (
      <>
        保育園ではアルファベットを教えられ、家ではひらがなを覚えさせられた。かるたで自分の名前のひらがなを取るのに必死。
      </>
    ),
  },
  {
    time: '1998.02.01 (1歳)',
    title: 'イギリスへ引っ越す',
    description:
      'イギリスの田舎に引っ越す。町から一歩出ると一面が草原であとは羊しかいないみたいな場所に住む。近所のリトミックに通い、英語を覚える。機関車トーマスに激ハマりする。この頃は自分が町で唯一のアジア人という自覚がなく、人種という概念をまだ理解していない。',
  },
  {
    time: '1996.10.12 (0歳)',
    title: '生まれる',
    description: '埼玉県で生まれた。オギャー',
  },
]

export const LifeEventsTimeline = () => {
  return (
    <div className={styles.lifeEventsTimeline}>
      <TitleText level="h2" size="xl">
        人生年表
      </TitleText>
      <div className={styles.lifeEventsTimelineContent}>
        {lifeEvents.map((lifeEvent, index) => (
          <LifeEvent
            key={index}
            time={lifeEvent.time}
            title={lifeEvent.title}
            description={lifeEvent.description}
            isFirst={index === 0}
            isLast={index === lifeEvents.length - 1}
          />
        ))}
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
