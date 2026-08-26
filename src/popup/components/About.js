import { elementFactory } from '../skruv-0.7.7/skruv.js'
import { css } from '../skruv-0.7.7/utils/css.js'
const { div, a } = elementFactory

// @ts-ignore
const style = css`
  :scope {
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
  div({ class: style }, [
    a({
      target: '_blank',
      class: 'aboutItem',
      href: 'https://www.paypal.com/donate/?hosted_button_id=Z4D6849QVUXD2'
    }, chrome.i18n.getMessage('aboutDonate')),
    a({
      target: '_blank',
      class: 'aboutItem',
      href: 'https://github.com/dobladov/youtube2Anki/issues'
    }, chrome.i18n.getMessage('aboutIssues')),
    a({
      target: '_blank',
      class: 'aboutItem',
      href: 'https://github.com/dobladov/youtube2Anki/discussions/categories/ideas'
    }, chrome.i18n.getMessage('aboutSuggestions'))
  ])
