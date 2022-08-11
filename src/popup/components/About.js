import { div, a } from '../skruv/html.js'

export const About = () =>
  div({ class: 'about' }, [
    a({
      target: '_blank',
      class: 'aboutItem',
      href: 'https://www.paypal.com/donate/?hosted_button_id=Z4D6849QVUXD2'
    }, 'Donate'),
    a({
      target: '_blank',
      class: 'aboutItem',
      href: 'https://github.com/dobladov/youtube2Anki/issues'
    }, 'Issues'),
    a({
      target: '_blank',
      class: 'aboutItem',
      href: 'https://github.com/dobladov/youtube2Anki/discussions/categories/ideas'
    }, 'Suggestions')
  ])
