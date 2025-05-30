import { Link } from "react-router-dom";

import logo from "../assets/logos/hnta-logo.png";
import ambasadaLogo from "../assets/misc/ambasada.png";
import hnLogo from "../assets/logos/hnLogo.svg";

import s1 from "../assets/lines/s1.svg";
import s2 from "../assets/lines/s2.svg";
import s3 from "../assets/lines/s3.svg";
import s4 from "../assets/lines/s4.svg";
import s5 from "../assets/lines/s5.svg";
import pic from "../assets/pictures/lecture-1.jpg";

import { Instagram, Facebook, Youtube, Linkedin } from "lucide-react";

export default function Home() {
  return (
    <div>
      <div className="text-white relative overflow-hidden">
        <img src={s4} className="absolute right-0 top-0 w-xl hidden lg:block" />
        <img src={s3} className="absolute left-60 top-0 w-xl hidden lg:block" />
        <img src={s2} className="absolute left-0 top-0 w-2xs hidden lg:block" />
        <img
          src={s1}
          className="absolute right-0 -top-30 lg:right-auto lg:top-auto lg:left-0 lg:-bottom-50 rotate-180 lg:rotate-0 w-2xs lg:w-sm lg:block"
        />
        <img
          src={s5}
          className="absolute left-75 -bottom-35 w-sm hidden lg:block"
        />
        <div className="h-screen flex flex-col justify-end lg:justify-end lg:items-end lg:pr-25 text-center">
          <div className="flex flex-col lg:flex-row items-center">
            <img src={logo} alt="logo" className="w-35 h-35" />
            <h1 className="text-5xl lg:text-8xl font-black">
              Dobro došli!
            </h1>{" "}
            <br />
          </div>
          <div className="lg:pl-35 pb-20">
            <p className="text-xl">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
          </div>
          <div className="pb-15">
            <a href="/registracija">
              <button className="w-3xs bg-black p-3 border-2 border-primary rounded-full lg:mr-3 cursor-pointer mb-5 lg:mb-0">
                Registruj se!
              </button>
            </a>
            <a href="/prijava">
              <button className="w-3xs bg-primary text-white p-3 rounded-full cursor-pointer">
                Prijavi se!
              </button>
            </a>
          </div>
        </div>
      </div>
      <div className="text-white w-full flex flex-col lg:flex-row bg-secondary relative overflow-hidden">
        <div className="lg:w-1/2 p-10 pt-15 flex items-center justify-center">
          <img src={pic} alt="lecture-1" className="w-xl h-xl rounded-2xl" />
        </div>
        <div className="lg:w-1/2 flex flex-col items-center lg:items-start justify-center text-black p-10">
          <h1 className="text-6xl font-bold mb-10">Networking</h1>
          <p className="lg:w-3/4 tracking-wider">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
            nec blandit orci. Cras gravida quam fermentum sapien pharetra, quis
            fringilla mauris gravida. Aenean dui urna, molestie quis lacus sed,
            finibus commodo quam.Lorem ipsum dolor sit amet, consectetur
            adipiscing elit. Suspendisse nec blandit orci. Cras gravida quam
            fermentum sapien pharetra, quis fringilla mauris gravida. Aenean dui
            urna, molestie quis lacus sed, finibus commodo quam.
          </p>
        </div>
      </div>
      <div className="text-white w-full flex flex-col lg:flex-row bg-black relative overflow-hidden">
        <div className="lg:w-1/2 flex flex-col items-center lg:items-end justify-center text-white p-10">
          <h1 className="text-6xl font-bold mb-10">Skill sharing</h1>
          <p className="lg:w-3/4 tracking-wider">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
            nec blandit orci. Cras gravida quam fermentum sapien pharetra, quis
            fringilla mauris gravida. Aenean dui urna, molestie quis lacus sed,
            finibus commodo quam.Lorem ipsum dolor sit amet, consectetur
            adipiscing elit. Suspendisse nec blandit orci. Cras gravida quam
            fermentum sapien pharetra, quis fringilla mauris gravida. Aenean dui
            urna, molestie quis lacus sed, finibus commodo quam.
          </p>
        </div>
        <div className="lg:w-1/2 p-10 pt-15 flex items-center justify-center">
          <img src={pic} alt="lecture-1" className="w-xl h-xl rounded-2xl" />
        </div>
      </div>
      <div className="text-white w-full flex flex-col lg:flex-row bg-secondary">
        <div className="lg:w-1/2 p-10 pt-15 flex items-center justify-center">
          <img src={pic} alt="lecture-1" className="w-xl h-xl rounded-2xl" />
        </div>
        <div className="lg:w-1/2 flex flex-col items- lg:items-start justify-center text-black p-10">
          <h1 className="text-6xl font-bold mb-10">Workshops</h1>
          <p className="lg:w-3/4 tracking-wider">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
            nec blandit orci. Cras gravida quam fermentum sapien pharetra, quis
            fringilla mauris gravida. Aenean dui urna, molestie quis lacus sed,
            finibus commodo quam.Lorem ipsum dolor sit amet, consectetur
            adipiscing elit. Suspendisse nec blandit orci. Cras gravida quam
            fermentum sapien pharetra, quis fringilla mauris gravida. Aenean dui
            urna, molestie quis lacus sed, finibus commodo quam.
          </p>
        </div>
      </div>
      <footer className="text-white flex flex-col lg:flex-row items-center justify-center p-30">
        <div className="lg:pr-20 pb-20 lg:pb-0">
          <ul className="text-lg">
            <a href="/kontakt">
              <li className="mb-2 cursor-pointer">Kontakt</li>
            </a>

            <li className="mb-2 cursor-pointer">
              <a href="/uslovi-koristenja">Uslovi korištenja</a>
            </li>
          </ul>
        </div>
        <div className="pb-20 lg:pb-0">
          <ul className="flex">
            <Link to="https://www.instagram.com/talentakademija/">
              <li className="pr-2 cursor-pointer">
                <Instagram size={25} strokeWidth={1} />
              </li>
            </Link>
            <Link to="https://www.facebook.com/profile.php?id=61559380710858&locale=nb_NO">
              <li className="pr-2 cursor-pointer">
                <Facebook size={25} strokeWidth={1} />
              </li>
            </Link>
            <Link to="https://www.youtube.com/@talentakademija">
              <li className="pr-2 cursor-pointer">
                <Youtube size={25} strokeWidth={1} />
              </li>
            </Link>
            <Link to="https://www.linkedin.com/company/helem-nejse-talent-akademija/">
              <li className="pr-2 cursor-pointer">
                <Linkedin size={25} strokeWidth={1} />
              </li>
            </Link>
          </ul>
          <a>
            <Link to="https://talentakademija.ba/">
              <button className="p-3 border-2 border-primary rounded-full text-sm tracking-wider w-full text-primary mt-5 cursor-pointer">
                Talent Akademija
              </button>
            </Link>
          </a>
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
