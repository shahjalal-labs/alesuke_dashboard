/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import profileAvatar from "@/assets/navbar/profile.png";
import { useMyProfileQuery } from "@/redux/api/authApi";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AiOutlineMenu } from "react-icons/ai";

const Topbar: React.FC<{ onHamburgerClick: () => void }> = ({
  onHamburgerClick,
}) => {
  // get notification

  // fksdflk

  const { data: myProfileData } = useMyProfileQuery({});

  console.log("profile data", myProfileData);
  const profile = myProfileData?.result;

  const token = Cookies.get("token");

  let decodedToken: any = null;

  if (token) {
    try {
      decodedToken = jwtDecode(token);
    } catch (e) {
      decodedToken = null;
    }
  }

  console.log("decode token details", decodedToken);
  const pathname = usePathname();
  console.log("pathname", pathname)

  return (
    <header className="bg-white shadow-sm py-6 px-6 lg:px-16 w-full">
      <div className="flex justify-between items-center flex-wrap">
        {/* Hamburger Icon for Mobile */}
        <button
          className="lg:hidden text-2xl text-gray-700"
          onClick={onHamburgerClick}
        >
          <AiOutlineMenu />
        </button>

        {/* Welcome Message */}
        <div className="flex items-center gap-6">
          {/* <Image src={leftarrow} className="w-6 h-6" alt="leftarrow icon"/> */}
          <h1 className="text-[#161616] flex items-center gap-2 text-[16px] md:text-[24px] font-bold">
          {pathname === "/admin/user-management" && "User Management"}
          {pathname === "/admin/sales-activity" && "Sales Activity"}
          {pathname === "/admin/settings" && "Settings"}
          </h1>
        </div>

        <div className="flex items-center gap-6">
          {/* <div className="flex items-center bg-white w-9 h-9 rounded-full justify-center shadow-sm">
            <Image src={message} className="w-6 h-6" alt="message icon" />
          </div> */}
          {/* <div className="flex items-center bg-white w-9 h-9 rounded-full justify-center shadow-sm">
            <Image
              src={profile?.profileImage.src || profileAvatar}
              className="w-6 h-6"
              alt="notification icon"
            />
          </div> */}
          
          <Link href={`/admin/settings`}>
            <Image
              src={profile?.profileImage || profileAvatar}
              className="w-10 h-10 rounded-full"
              alt="profile icon"
              width={40}
              height={40}
            />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
