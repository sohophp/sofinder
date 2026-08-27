import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import HomeInstallCard from './components/HomeInstallCard.vue'
import HomeSections from './components/HomeSections.vue'
import DocFeedback from './components/DocFeedback.vue'
import SiteFooter from './components/SiteFooter.vue'
import SecurityCallout from './components/SecurityCallout.vue'
import LicenseBadge from './components/LicenseBadge.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  Layout: () => h(DefaultTheme.Layout, null, {
    'home-hero-info-before': () => h(LicenseBadge),
    'home-hero-image': () => h(HomeInstallCard),
    'home-features-after': () => h(HomeSections),
    'doc-after': () => h(DocFeedback),
    'layout-bottom': () => h(SiteFooter),
  }),
  enhanceApp({ app }) {
    app.component('SecurityCallout', SecurityCallout)
  },
}
