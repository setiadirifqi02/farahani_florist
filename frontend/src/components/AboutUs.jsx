import { Link } from "@nextui-org/react";
import {
  GlobeAsiaAustraliaIcon,
  HomeIcon,
  PhoneIcon,
} from "@heroicons/react/24/solid";

import MetaData from "./layout/MetaData";

const AboutUs = () => {
  return (
    <>
      <MetaData title={"Tentang Kami"} />
      <div className="about-us___page content grid grid-cols-1 md:grid-cols-2">
        <div className="flex">
          <img
            src="/images/about_us.webp"
            alt="about_us"
            className="rounded-lg mb-5"
          />
        </div>
        <div className="flex flex-col md:px-5">
          <h2 className="headingTitle">Tentang Farhani Florist</h2>
          <h2 className="subTitle mb-4">Profil Singkat</h2>
          <p className="md:max-sm: paragraphDetail mb-4">
            Usaha sejak 2001, dengan pelanggan dari daerah sekitar Baturaden
            Banyumas, Cilacap, Bumiayu, Majenang paling jauh Yogyakarta. Produk
            yang dijual adalah tanaman hias berbagai ukuran sampai kecil-besar.
          </p>
          <p className="md:max-sm: paragraphDetail">
            Menyediakan tanaman untuk pembuatan dan dekorasi taman. Tanaman hias
            untuk dekorasi taman seprti tanaman peneduh, bonsai, palm dst.
          </p>

          <h2 className="subTitle mb-4">Kontak Kami</h2>

          <div className="flex gap-3 items-center">
            <HomeIcon className="h-4 text-green-500" />
            <p className="md:max-sm: paragraphDetail">
              Rempoah Baturraden Purwokerto
            </p>
          </div>
          <div className="flex gap-3 items-center">
            <PhoneIcon className="h-4 text-green-500" />
            <p className="md:max-sm: paragraphDetail">088220259500</p>
          </div>
          <div className="flex gap-3 items-center">
            <GlobeAsiaAustraliaIcon className="h-4 text-green-500" />

            <a
              href={"https://www.instagram.com/farhani_florist/"}
              target="_blank"
              rel="noreferrer"
              className="md:max-sm: paragraphDetail"
            >
              Instagram Farhani Florist
            </a>
          </div>
        </div>
      </div>
      <div className="maps flex flex-col md:flex-row w-full p-3 md:px-10 mt-[-36px]">
        <div className="flex w-3/6"></div>
        <div className="flex flex-col w-3/6 md:px-4">
          <h2 className="subTitle mb-4 text-start ">Temukan Kami</h2>

          <iframe
            className="rounded-2xl w-[350px] h-[350px] lg:w-[500px] lg:h-[450px]"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7913.787227222928!2d109.23557249102824!3d-7.3658205999999975!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e655f30012993ff%3A0x7e2b1ddaa2274b2d!2sFarhani_florist!5e0!3m2!1sen!2sid!4v1722077236988!5m2!1sen!2sid"
            style={{ border: "0" }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </>
  );
};
export default AboutUs;
