import MarkdownIt from 'markdown-it'

export default ({ app }, inject) => {
  const md = new MarkdownIt({
    langPrefix: 'language-',
    preset: 'default',
    linkify: false,
    breaks: true,
    html: true,
    typegraphy: true,
  })

  md.use(require('markdown-it-meta'))
  md.use(require('markdown-it-anchor'))

  inject('md', md)
}