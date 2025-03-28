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
          <h2 className="subTitle mb-4">Profile Singkat</h2>
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
    </>
  );
};
export default AboutUs;
