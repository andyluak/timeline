import Image from "next/image";

import Layout from "components/layouts/Layout";

import useDeviceSize from "hooks/useDeviceSize";

import content from "../content.json";

export default function Home({ hero, features, useCases }) {
  const { isMobile } = useDeviceSize();
  return (
    <div>
      <section className="responsive-padding">
        <div className="flex flex-col-reverse items-center md:flex-row md:justify-between">
          <div className="flex w-1/2 w-full flex-col items-center md:items-start">
            <h1 className="tracking-header text-center text-4xl font-bold md:text-left">
              {hero.title}
            </h1>
            <div className="m-auto mt-4 w-4/5 md:m-0 md:mt-4">
              <p className="tracking-body text-center text-xl md:text-left">
                {hero.body}
              </p>
            </div>
            <button className="relative mt-4 border border-black p-3 px-4 uppercase shadow-md hover:shadow-2xl">
              Create an account now
            </button>
          </div>
          <div>
            <Image
              src={"/hero.svg"}
              width={isMobile ? 300 : 400}
              height={400}
              alt="hero image"
              priority
            />
          </div>
        </div>
      </section>
      <section id="features" className="mt-6 bg-gray-600 p-5 md:px-10">
        <div className="flex flex-col justify-around md:flex-row">
          {features.map((f, i) => {
            return (
              <div
                className="my-2 flex flex-col items-start px-4 py-6 md:mx-2 md:w-[500px]"
                key={i}
              >
                <div className="relative">
                  <Image
                    src={"https://placehold.jp/300x300.png"}
                    width={400}
                    height={400}
                    alt="placeholder"
                  />
                </div>
                <div className="mt-2 flex flex-col items-start gap-4 text-white">
                  <h2 className="tracking-header text-left text-3xl md:text-left">
                    {f.title}
                  </h2>
                  <p className="md:1/2 tracking-body text-md w-4/5 text-left leading-[18px]  md:text-left">
                    {f.body}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
      <section id="use-cases" className="mt-6 p-5 md:px-10">
        <div className="flex flex-col justify-around md:flex-row">
          {useCases.map((u, i) => {
            return (
              <div
                className="my-2 flex flex-col items-start bg-gray-300 px-4 py-6 md:mx-2 md:w-[500px]"
                key={i}
              >
                <div className="relative w-full">
                  <Image
                    src={"https://placehold.jp/300x300.png"}
                    width={400}
                    height={400}
                    alt="placeholder"
                  />
                </div>
                <div className="mt-2 flex flex-col items-start gap-4">
                  <h2 className="tracking-header text-left text-3xl md:text-left">
                    {u.title}
                  </h2>
                  <p className="md:1/2 tracking-body text-md w-4/5 text-left leading-[18px]  md:text-left">
                    {u.body}
                  </p>
                </div>
                <button className="relative mt-6 border border-black p-3 px-4 uppercase shadow-md hover:shadow-2xl">
                  Create an account now
                </button>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

Home.getLayout = function getLayout(page) {
  return (
    <>
      <Layout title="Home">{page}</Layout>
    </>
  );
};

export const getStaticProps = async () => {
  return {
    props: {
      hero: content.hero,
      features: content.features,
      useCases: content.useCases,
    },
  };
};
