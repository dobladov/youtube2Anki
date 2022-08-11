import { div, a, css } from '../skruv/html.js'

// @ts-ignore
const style = css`
  .about {
    text-align: center;
    display: flex;
    justify-content: space-around;
    list-style-type: none;
    margin: 0;
    padding: 0;
    padding-top: .4rem;
  }

  .aboutItem {
    text-align: center;
    display: block;
    flex: 1;
  }
`

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
  ], style)
