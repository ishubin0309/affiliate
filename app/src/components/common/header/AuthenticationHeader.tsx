import { Image } from "@chakra-ui/react";

const AuthenticationHeader = () => {
  return (
    <header className="rounded-lg pt-12 pb-6 font-['Inter'] font-normal">
      <div className="mb-7 text-center text-4xl">
        <Image
          className="ml-1 mr-2 inline-block h-auto w-[115px]"
          src="/img/logo.png"
          width="115"
          alt="logo"
        />
      </div>
      <hr />
      <div className="mt-6 text-center text-3xl">
        Login to your <br />
        <span className="font-bold">Affillate</span> account
      </div>
    </header>
  );
};

export default AuthenticationHeader;
