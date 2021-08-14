import Document, { Html, Head, Main, NextScript } from 'next/document'

/*
    No next, sempre que há necessidade de se configurar scripts "terceiros" adicionais em uma aplicação,
    isso deve ser feito seguindo exatemente o que este componente faz!

    as tags padrões do html, tem que serem usadas as que são disponiblizadas pelo next por questões de funcionamento
*/

export default class AppDocument extends Document {
    render() {
        return (
            <Html>
                <Head>
                    <link rel="preconnect" href="https://fonts.googleapis.com" />
                    <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
                    <link href="https://fonts.googleapis.com/css2?family=Inter&family=Lexend:wght@500;600&display=swap" rel="stylesheet" />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }
}