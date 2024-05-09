"use client";
import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";
import { MineContext } from "@/Context/MineContextProvider";
import { CgArrowLeft, CgSearch } from "react-icons/cg";
import Singlechatbox from "../Components/Box/singlechatbox";

export default function page() {
  const { chats, setChats, data } = useContext(MineContext);
  const friendChat = chats?.filter((chat) => chat.type === "random");



  if (!data || !friendChat || !chats) {
    return (
      <>
        <div className="w-full rounded-2xl">
          <div className="rounded-full bg-slate-950 flex items-center sticky top-1">
            <div className="w-2/12 text-center text-2xl">
              <Link href={"/feed"}>
                <CgArrowLeft className="inline-block" />
              </Link>
            </div>
            <h1 className="text-white font-bold px-4">Random Chat</h1>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="w-full overflow-hidden rounded-2xl">
        <div className="rounded-full bg-slate-950 flex items-center sticky top-1">
          <div className="w-2/12 text-center text-2xl">
            <Link href={"/feed"}>
              <CgArrowLeft className="inline-block" />
            </Link>
          </div>
          <h1 className="text-white font-bold px-4">Random Chat</h1>
        </div>

      </div>
    </>
  );
}
