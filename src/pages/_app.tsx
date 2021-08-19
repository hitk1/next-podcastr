import '../styles/global.scss'

import Header from './components/Header'
import Player from './components/Player'

import styles from '../styles/app.module.scss'
import { PlayerContext } from './contexts/Player'
import { useState } from 'react'

function MyApp({ Component, pageProps }) {
  const [episodesList, setEpisodesList] = useState([])
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const play = (episode) => {
    setEpisodesList([episode])
    setCurrentEpisodeIndex(0)
  }

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const setPlayingState = (state: boolean) => {
    setPlayingState(state)
  }

  return (
    <PlayerContext.Provider value={{
      episodesList,
      currentEpisodeIndex,
      play,
      isPlaying,
      togglePlay,
      setPlayingState
    }}>
      <div className={styles.appWrapper}>
        <main>
          <Header />
          <Component {...pageProps} />
        </main>
        <Player />
      </div>
    </PlayerContext.Provider>
  )
}

export default MyApp
