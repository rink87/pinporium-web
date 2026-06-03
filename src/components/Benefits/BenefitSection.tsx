import clsx from "clsx";

import BenefitBullet from "./BenefitBullet";
import DeviceFrame from "../DeviceFrame";
import DeviceVideoFrame from "../DeviceVideoFrame";
import SectionTitle from "../SectionTitle";
import { DEVICE_MOCKUP_IMAGE_SIZES, DEVICE_MOCKUP_WIDTH_CLASS } from "@/lib/deviceFrame";
import { IBenefit } from "@/types";

interface Props {
  benefit: IBenefit;
  imageAtRight?: boolean;
}

const BenefitSection: React.FC<Props> = ({ benefit, imageAtRight }) => {
  const { title, description, imageSrc, bullets, videoSrc, videoPosterSrc } =
    benefit;

  return (
    <section className="benefit-section">
      <div
        className={clsx(
          "benefit-reveal flex flex-wrap flex-col items-center justify-center gap-8 lg:flex-row lg:gap-20 lg:flex-nowrap mb-24 pt-10 md:pt-12",
        )}
      >
        <div
          className={clsx("flex flex-wrap items-center w-full max-w-lg", {
            "justify-start": imageAtRight,
            "lg:order-1 justify-end": !imageAtRight,
          })}
        >
          <div className="w-full text-center lg:text-left">
            <div className="flex flex-col w-full">
              <SectionTitle>
                <h3 className="lg:max-w-2xl">{title}</h3>
              </SectionTitle>

              <p className="mt-1.5 mx-auto lg:ml-0 leading-normal text-foreground-accent">
                {description}
              </p>
            </div>

            <div className="mx-auto lg:ml-0 w-full">
              {bullets.map((item, index) => (
                <BenefitBullet
                  key={index}
                  title={item.title}
                  icon={item.icon}
                  description={item.description}
                />
              ))}
            </div>
          </div>
        </div>

        <div
          className={clsx("mt-5 max-lg:w-full lg:mt-0", {
            "lg:order-2": imageAtRight,
          })}
        >
          <div
            className={clsx(
              "flex justify-center max-lg:mx-auto max-lg:w-full lg:w-fit",
              {
                "lg:justify-start": imageAtRight,
                "lg:justify-end": !imageAtRight,
              },
            )}
          >
            {videoSrc ? (
              <DeviceVideoFrame
                src={videoSrc}
                poster={videoPosterSrc}
                className={clsx("lg:ml-0", DEVICE_MOCKUP_WIDTH_CLASS)}
              />
            ) : (
              <DeviceFrame
                src={imageSrc}
                alt={`Pinporium — ${title}`}
                width={472}
                height={1024}
                sizes={DEVICE_MOCKUP_IMAGE_SIZES}
                className={clsx("lg:ml-0", DEVICE_MOCKUP_WIDTH_CLASS)}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BenefitSection;
