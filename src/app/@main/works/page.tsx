import { redirect } from 'next/navigation'

export default function WorksPage() {
  // /worksにアクセスしたらルートページにリダイレクトする
  redirect('/')
}
