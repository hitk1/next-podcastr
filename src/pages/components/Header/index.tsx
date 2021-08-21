import { useMemo } from 'react'
import format from 'date-fns/format'
import ptBr from 'date-fns/locale/pt-BR'

import styles from './styles.module.scss'

const Header: React.FC = () => {
    const currentDate = useMemo(() => format(new Date(), 'EEEEEE, d MMMM', { locale: ptBr }), [])

    return (
        <header className={styles.headerContainer}>
            <img src="/logo.svg" alt="Podcastr logo" />
            <p>O melhor para você ouvir, sempre</p>
            <span>{currentDate}</span>
        </header>
    )
}

export default Header