import logo from "../assets/hnta-logo.png";
import s1 from "../assets/lines/s1.svg";
import s2 from "../assets/lines/s2.svg";
import s3 from "../assets/lines/s3.svg";
import s4 from "../assets/lines/s4.svg";
import s5 from "../assets/lines/s5.svg";
import pic from "../assets/lecture-1.jpg";

export default function Home() {
  return (
    <div>
      <div className="text-white relative overflow-hidden">
        <img src={s4} className="absolute right-0 top-0 w-xl" />
        <img src={s3} className="absolute left-60 top-0 w-xl" />
        <img src={s2} className="absolute left-0 top-0 w-2xs" />
        <img src={s1} className="absolute -left-10 -bottom-50 " />
        <img src={s5} className="absolute left-75 -bottom-35 w-sm " />

        <div className="h-screen flex flex-col justify-end items-end pr-25">
          <div className="flex items-center">
            <img src={logo} alt="logo" className="w-35 h-35" />
            <h1 className="text-8xl font-black">Dobro došli!</h1> <br />
          </div>
          <div className="pl-35 pb-20">
            <p className="text-xl">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
          </div>
          <div className="pb-15">
            <button className="w-3xs bg-black p-3 border-2 border-primary rounded-full mr-3 cursor-pointer">
              Registruj se!
            </button>
            <button className="w-3xs bg-primary text-white p-3 rounded-full cursor-pointer">
              Prijavi se!
            </button>
          </div>
        </div>
      </div>

      <div className="text-white w-full flex bg-secondary relative overflow-hidden">
        <img src={s5} className="absolute -right-50  w-sm " />
        <img src={s5} className="absolute -bottom-70 -left-50 rotate-240" />
        <div className="w-1/2 p-10 pt-15 flex items-center justify-center">
          <img src={pic} alt="lecture-1" className="w-xl h-xl rounded-2xl" />
        </div>
        <div className="w-1/2 flex flex-col items-start justify-center text-black">
          <h1 className="text-6xl font-bold mb-10">Networking</h1>
          <p className="w-3/4 tracking-wider">
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
      <div className="text-white w-full flex bg-black relative overflow-hidden">
        <img src={s5} className="absolute w-lg -left-80 -bottom-20" />
        <div className="w-1/2 flex flex-col items-end justify-center text-white">
          <h1 className="text-6xl font-bold mb-10">Skill sharing</h1>
          <p className="w-3/4 tracking-wider">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
            nec blandit orci. Cras gravida quam fermentum sapien pharetra, quis
            fringilla mauris gravida. Aenean dui urna, molestie quis lacus sed,
            finibus commodo quam.Lorem ipsum dolor sit amet, consectetur
            adipiscing elit. Suspendisse nec blandit orci. Cras gravida quam
            fermentum sapien pharetra, quis fringilla mauris gravida. Aenean dui
            urna, molestie quis lacus sed, finibus commodo quam.
          </p>
        </div>
        <div className="w-1/2 p-10 pt-15 flex items-center justify-center">
          <img src={pic} alt="lecture-1" className="w-xl h-xl rounded-2xl" />
        </div>
      </div>
      <div className="text-white w-full flex bg-secondary">
        <div className="w-1/2 p-10 pt-15 flex items-center justify-center">
          <img src={pic} alt="lecture-1" className="w-xl h-xl rounded-2xl" />
        </div>
        <div className="w-1/2 flex flex-col items-center justify-center text-black">
          <h1 className="text-6xl font-bold mb-10">Workshops</h1>
          <p className="w-3/4 tracking-wider">
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
    </div>
  );
}
