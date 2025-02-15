import utility from "../assets/utility-drawing.png";
import logo from "../assets/hnta-logo.png";
import { Facebook, Globe, Instagram, Linkedin, Youtube } from "lucide-react";
import ambasadaLogo from "../assets/ambasada.png";
import hnLogo from "../assets/hnLogo.svg";

export default function UsloviKoristenja() {
  return (
    <div>
      <div className="text-white min-h-screen flex items-center justify-center px-5">
        <div className="flex flex-col lg:flex-row items-center justify-center w-full max-w-6xl">
          <div className="w-full lg:w-1/2 flex items-center justify-center order-first lg:order-last lg:ml-10">
            <img
              src={utility}
              alt="utility-visual"
              className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg p-5"
            />
          </div>

          <div className="w-full lg:w-1/2 p-5 lg:text-left tracking-wider">
            <a href="/">
              <img
                src={logo}
                alt="hnta-logo"
                className="w-20 mb-6 mx-auto lg:mx-0"
              />
            </a>
            <h1 className="text-3xl sm:text-3xl lg:text-5xl font-bold mb-6 tracking-wider text-center lg:text-left    ">
              Uslovi korištenja
            </h1>
            <div>
              <p className="text-lg leading-relaxed tracking-wide mb-5">
                Dobrodošli na web stranicu Helem Nejse Talent Akademije.
                Korištenjem ove web stranice, prihvatate sljedeće uslove:
              </p>
              <ul className="text-lg">
                <li className="mb-5 italic">
                  - Sadržaj web stranice je vlasništvo Helem Nejse Talent
                  Akademije i zaštićen je autorskim pravima, osim ako nije
                  drugačije naznačeno.
                </li>
                <li className="mb-5 italic">
                  - Dozvoljeno je pregledanje, kopiranje i distribucija sadržaja
                  isključivo u nekomercijalne svrhe, uz navođenje izvora.
                </li>
                <li className="mb-5 italic">
                  - Zabranjeno je mijenjanje, objavljivanje, prenošenje,
                  distribuiranje ili stvaranje izvedenih radova na osnovu
                  sadržaja web stranice bez prethodnog pisanog odobrenja
                  Akademije.
                </li>
                <li className="mb-5 italic">
                  - Akademija ne garantuje kontinuirano i
                  neometanofunkcionisanje web stranice i ne preuzima odgovornost
                  za štetu nastalu uslijed nemogućnosti pristupa stranici.
                </li>
                <li className="mb-5 italic">
                  - Akademija zadržava pravo da u bilo kom trenutku izmijeni ove
                  Uslove korištenja bez prethodne najave.
                </li>
              </ul>
              <p className="mt-5 text-lg">
                Ukoliko ne prihvatate ove uslove korištenja, molimo vas da
                prestanete sa korištenjem ove web stranice.
              </p>
            </div>
          </div>
        </div>
      </div>
      <footer className="text-white flex flex-col lg:flex-row items-center justify-center p-30">
        <div className="lg:pr-20 pb-20 lg:pb-0">
          <ul className="text-lg">
            <li className="mb-2 cursor-pointer">Kontakt</li>
            <li className="mb-2 cursor-pointer">Privatnost</li>
            <li className="mb-2 cursor-pointer">
              <a href="/uslovi-koristenja">Uslovi korištenja</a>
            </li>
          </ul>
        </div>
        <div className="pb-20 lg:pb-0">
          <ul className="flex">
            <li className="pr-2 cursor-pointer">
              <Instagram size={25} strokeWidth={1} />
            </li>
            <li className="pr-2 cursor-pointer">
              <Facebook size={25} strokeWidth={1} />
            </li>
            <li className="pr-2 cursor-pointer">
              <Youtube size={25} strokeWidth={1} />
            </li>
            <li className="pr-2 cursor-pointer">
              <Linkedin size={25} strokeWidth={1} />
            </li>
            <li className="pr-2 cursor-pointer">
              <Globe size={25} strokeWidth={1} />
            </li>
          </ul>
          <button className="p-3 border-2 border-primary rounded-full text-sm tracking-wider w-full text-primary mt-5 cursor-pointer">
            Talent Akademija
          </button>
        </div>
        <div className="ml-20 ml-auto">
          <div>
            <h1 className="mb-5 font-bold tracking-wider pb-10 lg:pb-0 ">
              Helem Nejse Talent Akademiju implementiraju:
            </h1>
            <div>
              <img src={hnLogo} alt="helem-nejse-logo" />
            </div>
          </div>
          <div className="pt-10 lt:pb-0">
            <h1 className="my-5 font-bold tracking-wider">Podržano od:</h1>
            <div className="flex items-start">
              <img src={ambasadaLogo} alt="britanija-logo" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
