import { PhoneNumberIcon, SupportIcon } from "@/components/icons";
import { Mail } from "lucide-react";
import Link from "next/link";
import { Button } from "../../ui/button";

interface Props {
  first_name: string | undefined;
  last_name: string | undefined;
  mail: string | undefined;
}

const AccountManager = ({ first_name, last_name, mail }: Props) => {
  return (
    <div className="rounded-2xl bg-white px-2 py-5 shadow-sm md:px-5">
      <div className="mb-3 text-xl font-bold text-[#2262C6]">
        Your Account Manager
      </div>
      <div className="align-center mb-2 flex justify-center">
        <img width="100" src="/img/icons/user.png" alt="worldmap" />
      </div>
      <div className="align-center mb-5 text-center text-base">
        <div className="font-bold text-black">
          {" "}
          {first_name} {last_name}{" "}
        </div>
        <div className="text-[#717579]">Project Manager</div>
      </div>
      <div className="rounded-2xl bg-[#F4F7F9] px-4 py-5 drop-shadow">
        <div className="mb-5 flex">
          <div className="flex items-center justify-center px-3">
            <Mail className="h-6 w-6" />
          </div>
          <div className="truncate font-medium text-[#3D3D3D]">
            <Link href={`mailto:${mail}`}>{mail}</Link>
          </div>
        </div>
        <div className="mb-5 flex">
          <div className="flex items-center justify-center px-3">
            <PhoneNumberIcon />
          </div>
          <div className="truncate font-medium text-[#3D3D3D]">
            + 1122 222 222 ext. 2064
          </div>
        </div>
        <div className="mb-5 flex">
          <div className="flex items-center justify-center px-3">
            <img width="23" src="/img/icons/skype.png" alt="worldmap" />
          </div>
          <div className="truncate font-medium text-[#3D3D3D]">
            Skypeaccount
          </div>
        </div>
        <div className="flex ">
          <div className="flex items-center justify-center px-3">
            <SupportIcon />
          </div>
          <div className="truncate font-medium text-[#3D3D3D]">
            support@avapartner.com
          </div>
        </div>
      </div>

      <div className="mt-5 px-4">
        <Button className="w-full" variant="outline" size="lg">
          Open a Ticket
        </Button>
      </div>
    </div>
  );
};

export default AccountManager;
