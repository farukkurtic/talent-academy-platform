import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import logo from "../assets/logos/hnta-logo.png";
import ambasadaLogo from "../assets/misc/ambasada.png";
import hnLogo from "../assets/logos/hnLogo.svg";

import { Facebook, Instagram, Linkedin, Youtube } from "lucide-react";

const schema = yup.object().shape({
  name: yup.string().required("Ovo polje je obavezno"),
  surname: yup.string().required("Ovo polje je obavezno"),
  email: yup
    .string()
    .email("Molimo unesite ispravan mail")
    .required("Ovo polje je obavezno"),
  subject: yup.string().required("Ovo polje je obavezno"),
  message: yup.string().required("Ovo polje je obavezno"),
});

export default function Kontakt() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      // eslint-disable-next-line no-unused-vars
      const response = await axios.post(
        "https://api.emailjs.com/api/v1.0/email/send",
        {
          service_id: "service_v98n5t4",
          template_id: "template_hf0fmgi",
          user_id: "4MRBGzMBDbpsUHeY5",
          template_params: {
            name: data.name,
            surname: data.surname,
            email: data.email,
            subject: data.subject,
            message: data.message,
          },
        }
      );
      alert("Poruka je uspješno poslana!");
      navigate("/kontakt");
    } catch (error) {
      console.error("FAILED...", error);
      alert("Greška pri slanju poruke. Molimo pokušajte opet.");
    }
  };

  return (
    <div className="text-white">
      <div className="min-h-screen w-full flex flex-col items-center justify-center">
        <img src={logo} alt="hnta-logo" className="w-20 m-auto lg:m-0" />
        <h1 className="font-bold text-3xl lg:text-6xl tracking-wider mb-10 mt-6">
          Kontaktirajte nas
        </h1>
        <div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="p-6 rounded-lg shadow-md w-full"
          >
            <div className="mb-4 flex flex-col lg:flex-row gap-5">
              <div>
                <input
                  {...register("name")}
                  type="text"
                  className=" w-xs p-4 mb-5 border rounded mt-1 rounded-full placeholder-white"
                  placeholder="Ime"
                />
                {errors.name && (
                  <p className="text-red-500 tracking-wider text-sm">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div>
                <input
                  {...register("surname")}
                  type="text"
                  className=" w-xs p-4 mb-5 border rounded mt-1 rounded-full placeholder-white"
                  placeholder="Prezime"
                />
                {errors.surname && (
                  <p className="text-red-500 tracking-wider text-sm">
                    {errors.surname.message}
                  </p>
                )}
              </div>
            </div>
            <div className="mb-4 flex flex-col lg:flex-row gap-5">
              <div>
                <input
                  {...register("email")}
                  type="email"
                  className="lg-w-full w-xs p-4 mb-5 border rounded mt-1 rounded-full placeholder-white"
                  placeholder="Email"
                />
                {errors.email && (
                  <p className="text-red-500 tracking-wider text-sm">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div>
                <input
                  {...register("subject")}
                  type="text"
                  className="lg-w-full w-xs p-4 mb-5 border rounded mt-1 rounded-full placeholder-white"
                  placeholder="Predmet"
                />
                {errors.subject && (
                  <p className="text-red-500 tracking-wider text-sm">
                    {errors.subject.message}
                  </p>
                )}
              </div>
            </div>
            <div className="mb-4">
              <textarea
                {...register("message")}
                type="text"
                className="lg:w-full w-xs h-40 p-4 mb-5 border rounded mt-1 rounded-lg placeholder-white"
                placeholder="Poruka"
              />
              {errors.message && (
                <p className="text-red-500 tracking-wider text-sm">
                  {errors.message.message}
                </p>
              )}
            </div>
            <button
              type="submit"
              className="w-xs lg:w-full bg-primary text-white p-2 rounded-full font-semibold tracking-wider mt-10 cursor-pointer"
            >
              Nastavi
            </button>
          </form>
        </div>
      </div>
      <footer className="text-white flex flex-col lg:flex-row items-center justify-center p-30">
        <div className="lg:pr-20 pb-20 lg:pb-0">
          <ul className="text-lg">
            <a href="/kontakt">Kontakt</a>

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
          <Link to="https://talentakademija.ba/">
            <button className="p-3 border-2 border-primary rounded-full text-sm tracking-wider w-full text-primary mt-5 cursor-pointer">
              Talent Akademija
            </button>
          </Link>
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
