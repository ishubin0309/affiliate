import { CreativeMaterialDialogComponent } from "./CreativeMaterialDialogComponent";

interface Props {
  values: valueProps[];
  file?: string;
  alt: string;
  url: string;
  toggleShow?: boolean;
}

interface valueProps {
  title: string;
  value: string | undefined;
}

export const CreativeMaterialComponent = ({
  values,
  file,
  alt,
  url,
  toggleShow,
}: Props) => {
  return (
    <div className=" mb-5 rounded-xl bg-white p-4 shadow">
      <div
        className={
          "mt-4 items-start " +
          (toggleShow
            ? "md:grid md:grid-cols-1 md:gap-4"
            : "md:grid md:grid-cols-3 md:gap-4")
        }
      >
        <div className="mx-auto mb-5 h-64 rounded-xl">
          <img
            src={
              "https://go.best-brokers-partners.com/files/banners/1486039482v82Ip.jpg"
            }
            className="mx-auto	my-0 max-h-64 rounded-xl bg-cover"
            alt={alt}
          />
        </div>
        <CreativeMaterialDialogComponent
          values={values}
          url={url}
          toggleShow={toggleShow}
        />
      </div>
    </div>
  );
};
