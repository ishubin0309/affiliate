import { Image } from "@chakra-ui/react";

const AuthenticationFooter = () => {
  return (
    <footer className="flex justify-center pt-7 pb-6 md:px-6 md:pt-7">
      <span className="mt-1 flex text-xs sm:text-center">
        Power by&nbsp;
        <a href="https://affiliatets.com/" target="_blank">
          <Image
            className="ml-1 h-auto w-[64px]"
            src="/img/logo.png"
            width="15"
            alt="logo"
          />
        </a>
      </span>
    </footer>
  );
};

export default AuthenticationFooter;
