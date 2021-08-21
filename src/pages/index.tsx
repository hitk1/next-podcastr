import { GetStaticProps } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import Head from 'next/head'
import { api } from '../services/api'
import { format, parseISO } from 'date-fns'
import ptBr from 'date-fns/locale/pt-BR'
import { convertDuration2TimeString } from '../utils/convertDuration2TimeString'
import styles from './home.module.scss'
import { usePlayer } from './contexts/Player'

type Episode = {
  id: string
  title: string
  members: string
  publishedAt: string
  thumbnail: string
  description: string
  duration: number
  durationAsString: string
  url: string
}

type HomeProps = {
  allEpisodes: Episode[]
  latestEpisodes: Episode[]
}

export default function Home({ allEpisodes, latestEpisodes }: HomeProps) {
  const { playSomeList } = usePlayer()

  const episodeList = [...latestEpisodes, ...allEpisodes]

  return (
    <div className={styles.homePage}>
      <Head>
        <title>Home | Podcastr</title>
      </Head>
      <section className={styles.latestEpisodes}>
        <h2>Últimos lançamentos</h2>

        <ul>
          {
            latestEpisodes.map((item, index) => {

              return (
                <li
                  key={`key-${index}`}
                >
                  <Image
                    width={192}
                    height={192}
                    src={item.thumbnail}
                    alt={item.title}
                    objectFit="cover"
                  />

                  <div className={styles.episodeDetails}>
                    <Link href={`/episodes/${item.id}`}>
                      <a >{item.title}</a>
                    </Link>
                    <p>{item.members}</p>
                    <span>{item.publishedAt}</span>
                    <span>{item.durationAsString}</span>
                  </div>

                  <button type="button" onClick={() => playSomeList(episodeList as any, index)}>
                    <img src="/play-green.svg" alt="Tocar episódio" />
                  </button>
                </li>
              )
            })
          }
        </ul>
      </section>
      <section className={styles.allEpisodes}>
        <h2>Todos os episódios</h2>
        <table cellSpacing={0}>
          <thead>
            <tr>
              <th></th>
              <th>Podcast</th>
              <th>Integrantes</th>
              <th>Data</th>
              <th>Duração</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {allEpisodes.map((episode, index) => {
              return (
                <tr key={episode.id}>
                  <td style={{ width: 72 }}>
                    <Image
                      width={120}
                      height={120}
                      src={episode.thumbnail}
                      alt={episode.title}
                      objectFit="cover"
                    />
                  </td>
                  <td>
                    <Link href={`/episodes/${episode.id}`}>
                      <a >{episode.title}</a>
                    </Link>
                  </td>
                  <td>{episode.members}</td>
                  <td style={{ width: 100 }}>{episode.publishedAt}</td>
                  <td>{episode.durationAsString}</td>
                  <td>
                    <button type="button" onClick={() => playSomeList(episodeList as any, latestEpisodes.length + index)}>
                      <img src="/play-green.svg" alt="Tocar episódio" />
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </section>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  /*
    Esta função é responsável por Static Site Generation, ou seja, definimos um modelo estático da nossa pagina em html,
    e esta pagina só será "refeita" (consulta de dados e tudo mais), de acordo com o tempo que definirmos
  */
  const response = await api.get('/episodes',
    {
      params: {
        _limit: 12,
        _sort: 'published_at',
        _order: 'desc'
      }
    })
  const { data } = response

  const episodes = data.map(item => ({
    id: item.id,
    title: item.title,
    members: item.members,
    publishedAt: format(parseISO(item.published_at), 'd MMM yy', { locale: ptBr }),
    duration: Number(item.file.duration),
    thumbnail: item.thumbnail,
    durationAsString: convertDuration2TimeString(Number(item.file.duration)),
    description: item.description,
    url: item.file.url
  }))

  const latestEpisodes = episodes.slice(0, 2)
  const allEpisodes = episodes.slice(2, episodes.length)

  //Para retonar então os dados, obrigatoriamente tem que ser feito dessa maneira
  return {
    props: {
      //os dados desejados devem estar explicitos aqui
      allEpisodes,
      latestEpisodes
    },
    revalidate: 60 * 60 * 8 //Recebe um valor de tempo em segundos, que define o intervalo de tempo que a pagina será "refeita"
  }
}

// export async function getServerSideProps() {
//   /*
//     Esta função é executada no lado do servidor da aplicação, ou seja, antes da pagina ser exibida pro usuario
//     isso implica que os dados já estarão disponíveis e prontos pro usuario assim que a pagina for acessada

//     Exemplo:
//   */

//   const response = await fetch('http://127.0.0.1:3333/episodes')
//   const data = await response.json()

//   //Para retonar então os dados, obrigatoriamente tem que ser feito dessa maneira
//   return {
//     props: {
//       //os dados desejados devem estar explicitos aqui
//       episodes: data
//     }
//   }
// }
