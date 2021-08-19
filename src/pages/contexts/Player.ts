import { createContext } from 'react'

interface IEpisode {
    title: string
    members: string
    thumbnail: string
    durantion: number
    url: string
}

interface IPlayerContext {
    episodesList: IEpisode[],
    currentEpisodeIndex: number
    play: (episode: IEpisode) => void
    isPlaying: boolean
    togglePlay: () => void
    setPlayingState: (state: boolean) => void
}

export const PlayerContext = createContext({} as IPlayerContext)