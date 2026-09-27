import '../styles/tokens.css'
import '../styles/base.css'
import '../styles/layout.css'
import '../styles/components.css'
import { setupNav } from './nav.js'
import { setupNotes } from './notes.js'
import { setupTheme } from './theme.js'

setupTheme(document.querySelector('#theme-toggle'))
setupNav(document.querySelector('#menu-toggle'), document.querySelector('#site-nav'))
setupNotes(document.querySelector('#notes'))
