export const convertDuration2TimeString = (duration: number): string => {
    const hours = Math.floor(duration / 3600)
    const minutes = Math.floor((duration % 3600) / 60)
    const seconds = duration % 60

    const formatedResult = [hours, minutes, seconds].map(item => String(item).padStart(2, '0')).join(':')

    return formatedResult
}