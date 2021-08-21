import { useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import { usePlayer } from '../../contexts/Player'
import styles from './styles.module.scss'

import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'
import { convertDuration2TimeString } from '../../../utils/convertDuration2TimeString'

const Player: React.FC = () => {
    const audioRef = useRef<HTMLAudioElement>(null)
    const [progress, setProgress] = useState(0)
    const {
        episodesList,
        currentEpisodeIndex,
        isPlaying,
        isLooping,
        isShuffling,
        togglePlay,
        toggleLoop,
        toggleShuffle,
        setPlayingState,
        playNext,
        playPrevious,
        hasNext,
        hasPrevious,
        clearPlayerState
    } = usePlayer()
    const playingNow = episodesList[currentEpisodeIndex]

    const dealEpisodeEnded = () => {
        if (hasNext)
            playNext()
        else
            clearPlayerState()
    }

    const setupProgress = () => {
        audioRef.current.currentTime = 0

        audioRef.current.addEventListener('timeupdate', () => {
            setProgress(Math.floor(audioRef.current.currentTime))
        })
    }

    const handleSeek = (current: number) => {
        audioRef.current.currentTime = current
        setProgress(current)
    }

    useEffect(() => {
        if (!audioRef.current)
            return

        audioRef.current[`${!isPlaying ? 'pause' : 'play'}`]()
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
                    <span>{convertDuration2TimeString(progress)}</span>
                    <div className={styles.slider}>
                        {
                            playingNow
                                ? (
                                    <Slider
                                        max={playingNow.duration}
                                        value={progress}
                                        onChange={handleSeek}
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
                    <span>{convertDuration2TimeString(playingNow?.duration ?? 0)}</span>
                </div>

                {playingNow
                    && (
                        <audio
                            autoPlay
                            ref={audioRef}
                            src={playingNow.url}
                            loop={isLooping}
                            onPlay={() => setPlayingState(true)}
                            onPause={() => setPlayingState(false)}
                            onLoadedMetadata={setupProgress}
                            onEnded={dealEpisodeEnded}
                        />
                    )}

                <div className={styles.buttons}>
                    <button
                        className={isShuffling ? styles.isActive : ""}
                        type="button"
                        disabled={!playingNow || episodesList.length === 1}
                        onClick={toggleShuffle}
                    >
                        <img src="/shuffle.svg" alt="Embaralhar" />
                    </button>
                    <button
                        type="button"
                        disabled={!playingNow || !hasPrevious}
                        onClick={playPrevious}
                    >
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
                    <button
                        type="button"
                        disabled={!playingNow || !hasNext}
                        onClick={playNext}
                    >
                        <img src="/play-next.svg" alt="Tocar próxima" />
                    </button>
                    <button
                        className={isLooping ? styles.isActive : ""}
                        type="button"
                        disabled={!playingNow}
                        onClick={toggleLoop}
                    >
                        <img src="/repeat.svg" alt="Repetir" />
                    </button>
                </div>
            </footer>
        </div >
    )
}

export default Player