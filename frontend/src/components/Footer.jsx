import "../styles/Footer.css";

function Footer(){
    return <footer className="p-10 bg-black flex justify-center items-center w-full h-full">
        <div style={{ maxWidth: "1280px" }} className="flex justify-between items-center w-full h-full flex-col gap-7">
            <div className="flex flex-start w-full flex-col gap-7">
                <h2 className="font-extrabold text-2xl w-full text-left">Footer</h2>
                <div className="footer-content grid grid-row-2 sm:grid-cols-2 gap-7">
                    <div className="footer-links flex flex-col w-full gap-3">
                        <div className="social-text text-left text-sm">Se ti va, puoi seguirmi su: </div>
                        <div className="social-buttons flex gap-3 flex-wrap flex-row justify-between sm:justify-start max-w-[300px]">
                            <div className="instagram w-fit">
                                <a className="ig-button" href="https://www.instagram.com/antonino_palumeri_22/" target="_blank">
                                    <img width={32} height={32} src="/instagram.svg" alt="Instagram Icon"/>
                                </a>
                            </div>
                            <div className="linkedin w-fit">
                                <a className="ln-button" href="https://it.linkedin.com/in/antonino-palumeri-0048bb247" target="_blank">
                                    <img width={24} height={24} src="/linkedin.svg" alt="Linkedin Icon"/>
                                </a>
                            </div>
                            <div className="github w-fit">
                                <a className="gt-button" href="https://github.com/Anto22001?tab=repositories" target="_blank">
                                    <img width={24} height={24} src="/github.svg" alt="Github Icon"/>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="footer-techs text-sm w-full pb-7 sm:pb-0">
                        <p className="text-left sm:text-right mb-2 font-bold">Developed with:</p>
                        <ul className="flex flex-col items-start sm:items-end gap-2">
                            <li>
                                <a href="https://react.dev/" target="_blank">
                                    <img src="/react.svg" alt="React Icon"/>
                                    <p>React</p>
                                    <p className="hidden sm:block">•</p>
                                </a>
                            </li>
                            <li>
                                <a href="https://nodejs.org/" target="_blank">
                                    <img src="/nodejs.svg" alt="NodeJS Icon"/>
                                    <p>NodeJS</p>
                                    <p className="hidden sm:block">•</p>
                                </a>
                            </li>
                            <li>
                                <a href="https://fastify.dev/" target="_blank">
                                    <img src="/fastify-white.svg" alt="Fastify Icon"/>
                                    <p>Fastify</p>
                                    <p className="hidden sm:block">•</p>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="footer-copyright w-full text-left text-sm italic">
                <p>© 2025 Antonino Palumeri — "Se deve succedere, accadrà."</p>
            </div>
        </div>
    </footer>
}

export default Footer;