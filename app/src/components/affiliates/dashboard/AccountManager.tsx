import { PhoneNumberIcon, SupportIcon } from "@/components/icons";
import { firstLetterUpperCase } from "@/utils/format";
import { Mail } from "lucide-react";
import Link from "next/link";
import { Button } from "../../ui/button";

interface Props {
  first_name: string | undefined;
  last_name: string | undefined;
  mail: string | undefined;
  phone: string | undefined;
  skype: string | undefined;
  group_title: string | undefined;
  link: string | undefined;
  level: string | undefined;
}

const AccountManager = ({
  first_name,
  last_name,
  mail,
  phone,
  skype,
  group_title,
  link,
  level,
}: Props) => {
  const onClickOpenTicket = () => {
    window.open(link, "_blank");
  };
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
          {firstLetterUpperCase(first_name)} {firstLetterUpperCase(last_name)}{" "}
        </div>
        <div className="text-[#717579]">
          {firstLetterUpperCase(level)}
          {/* Project Manager */}
        </div>
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
          <div className="truncate font-medium text-[#3D3D3D]">{phone}</div>
        </div>
        <div className="mb-5 flex">
          <div className="flex items-center justify-center px-3">
            <img width="23" src="/img/icons/skype.png" alt="worldmap" />
          </div>
          <div className="truncate font-medium text-[#3D3D3D]">
            <Link href={`skype:${skype}?call`}>{skype}</Link>
          </div>
        </div>
        <div className="flex ">
          <div className="flex items-center justify-center px-3">
            <SupportIcon />
          </div>
          <div className="truncate font-medium text-[#3D3D3D]">
            {group_title}
          </div>
        </div>
      </div>

      <div className="mt-5 px-4">
        {link != "" && (
          <Button
            className="w-full"
            variant="outline"
            size="lg"
            onClick={onClickOpenTicket}
          >
            Open a Ticket
          </Button>
        )}
      </div>
    </div>
  );
};

export default AccountManager;
