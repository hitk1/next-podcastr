import { useContext, useEffect, useMemo, useRef } from 'react'
import Image from 'next/image'
import { PlayerContext } from '../../contexts/Player'
import styles from './styles.module.scss'

import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'

const Player: React.FC = () => {
    const audioRef = useRef<HTMLAudioElement>(null)
    const { episodesList, currentEpisodeIndex, isPlaying, togglePlay, setPlayingState } = useContext(PlayerContext)
    const playingNow = useMemo(() => episodesList[currentEpisodeIndex], [episodesList, currentEpisodeIndex])

    useEffect(() => {
        if (!audioRef.current)
            return

        audioRef.current[`${isPlaying ? 'pause' : 'play'}`]()
    }, [isPlaying])

    return (
        <div className={styles.playerContainer}>
            <header>
                <img src="/playing.svg" alt="Tocando agora" />
                <strong>Tocando agora {playingNow?.title}</strong>
            </header>

            {
                playingNow
                    ? (
                        <div className={styles.currentEpisode}>
                            <Image
                                width={592}
                                height={592}
                                src={playingNow.thumbnail}
                                alt={playingNow.title}
                                objectFit="cover"
                            />

                            <strong>{playingNow.title}</strong>
                            <span>{playingNow.members}</span>
                        </div>
                    )
                    : (
                        <div className={styles.emptyPlayer}>
                            <strong>Selecione um podcast para ouvir.</strong>
                        </div>
                    )
            }

            <footer className={!playingNow ? styles.empty : ''}>
                <div className={styles.progress}>
                    <span>00:00</span>
                    <div className={styles.slider}>
                        {
                            playingNow
                                ? (
                                    <Slider
                                        trackStyle={{ backgroundColor: '#04d361' }}
                                        railStyle={{ backgroundColor: '#9f57ff' }}
                                        handleStyle={{ borderColor: '#04d361', borderWidth: 4 }}
                                    />
                                )
                                : (
                                    <div className={styles.emptySlider} />
                                )
                        }
                    </div>
                    <span>99:99</span>
                </div>

                {playingNow
                    && (
                        <audio
                            ref={audioRef}
                            src={playingNow.url}
                            autoPlay
                            onPlay={() => setPlayingState(true)}
                            onPause={() => setPlayingState(false)}
                        />
                    )}

                <div className={styles.buttons}>
                    <button type="button" disabled={!playingNow}>
                        <img src="/shuffle.svg" alt="Embaralhar" />
                    </button>
                    <button type="button" disabled={!playingNow}>
                        <img src="/play-previous.svg" alt="Tocar anterior" />
                    </button>
                    <button
                        type="button"
                        className={styles.playButton}
                        disabled={!playingNow}
                        onClick={togglePlay}
                    >
                        {
                            isPlaying
                                ? <img src="/pause.svg" alt="Pausar" />
                                : <img src="/play.svg" alt="Tocar" />
                        }
                    </button>
                    <button type="button" disabled={!playingNow}>
                        <img src="/play-next.svg" alt="Tocar próxima" />
                    </button>
                    <button type="button" disabled={!playingNow}>
                        <img src="/repeat.svg" alt="Repetir" />
                    </button>
                </div>
            </footer>
        </div >
    )
}

export default Player