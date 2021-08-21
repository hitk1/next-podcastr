import { createContext, useContext, useState } from 'react'

interface IEpisode {
    title: string
    members: string
    thumbnail: string
    duration: number
    url: string
}

interface IPlayerContext {
    episodesList: IEpisode[],
    currentEpisodeIndex: number
    play: (episode: IEpisode) => void
    isPlaying: boolean
    isLooping: boolean
    isShuffling: boolean
    hasPrevious: boolean
    hasNext: boolean
    togglePlay: () => void
    toggleLoop: () => void
    toggleShuffle: () => void
    setPlayingState: (state: boolean) => void
    playSomeList: (list: IEpisode[], index: number) => void
    playNext: () => void
    playPrevious: () => void
    clearPlayerState: () => void
}

export const PlayerContext = createContext({} as IPlayerContext)

const PlayerContextProvider: React.FC = ({ children }) => {
    const [episodesList, setEpisodesList] = useState([])
    const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0)
    const [isPlaying, setIsPlaying] = useState(false)
    const [isLooping, setIsLooping] = useState(false)
    const [isShuffling, setIsShuffling] = useState(false)

    const play = (episode: IEpisode) => {
        setEpisodesList([episode])
        setCurrentEpisodeIndex(0)
    }

    const playSomeList = (list: IEpisode[], index: number) => {
        console.log("entrou na função")
        setEpisodesList(list)
        setCurrentEpisodeIndex(index)
        setIsPlaying(true)
    }

    const togglePlay = () => {
        setIsPlaying(!isPlaying)
    }

    const toggleLoop = () => {
        setIsLooping(!isLooping)
    }

    const toggleShuffle = () => {
        setIsShuffling(!isShuffling)
    }

    const setPlayingState = (state: boolean) => {
        setIsPlaying(state)
    }

    const clearPlayerState = () => {
        setEpisodesList([])
        setCurrentEpisodeIndex(0)
    }

    const hasPrevious = currentEpisodeIndex > 0
    const hasNext = isShuffling || currentEpisodeIndex + 1 < episodesList.length

    const playNext = () => {
        if (!hasNext)
            return

        if (isShuffling) {
            const nextRandomIndex = Math.floor(Math.random() * episodesList.length)

            setCurrentEpisodeIndex(nextRandomIndex)
        } else
            setCurrentEpisodeIndex(currentEpisodeIndex + 1)
    }

    const playPrevious = () => {
        if (!hasPrevious)
            return

        setCurrentEpisodeIndex(currentEpisodeIndex - 1)
    }


    return (
        <PlayerContext.Provider value={{
            episodesList,
            currentEpisodeIndex,
            play,
            isPlaying,
            isLooping,
            isShuffling,
            togglePlay,
            toggleLoop,
            toggleShuffle,
            setPlayingState,
            playSomeList,
            playNext,
            playPrevious,
            hasNext,
            hasPrevious,
            clearPlayerState
        }}>
            {children}
        </PlayerContext.Provider>
    )
}

const usePlayer = () => {
    return useContext(PlayerContext)
}

export { usePlayer }
export default PlayerContextProvider