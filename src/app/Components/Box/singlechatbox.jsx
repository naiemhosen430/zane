"use client";
import { MineContext } from "@/Context/MineContext";
import axios from "axios";
import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";

export default function Singlechatbox({ chat, myid }) {
  const { profileInfo, setMyfriendid } = useContext(MineContext);

  const myfriendid = chat?.chatids.filter((item) => item !== myid);
  setMyfriendid(myfriendid[0]);
  console.log({ aaaa: myfriendid[0] });

  if (!profileInfo || !myfriendid[0]) {
    return (
      <>
        <div className="flex items-center loadingbig justify-center p-2 px-1">
          <div className="w-2/12 flex items-center rounded-full pb-1">
            <div
              className="w-12 h-12 loading rounded-full inline-block"

            ></div>
          </div>
          <div className="w-10/12">
            <h1 className="text-sm loading px-2"></h1>
            <h1 className="text-xs loading px-2 text-red-500"></h1>
            <h1 className="text-xs loading px-2 text-red-400 text-right flex">
              <span className="w-8/12 loading text-left text-base block"></span>
              <span className="text-xs loading text-right w-4/12 block text-red-500"></span>
            </h1>
          </div>
        </div>
      </>
    );
  }
  return (
    <div className="flex items-center justify-center p-2 px-1" key={chat.id}>
      <div className="w-2/12 flex items-center rounded-full pb-1">
        <Link className="block" href={`/profile/${chat[0]?._id}`}>
          <img
            className="w-12 h-12 rounded-full inline-block"
            src={profileInfo?.profilepicture}
            alt=""
          />
        </Link>
      </div>
      <div className="w-10/12">
        <Link href={`/converssion/${profileInfo?._id}`}>
          <h1 className="text-sm px-2">{profileInfo?.name}</h1>
          <h1 className="text-xs px-2 text-red-500">active 11 m ago</h1>
          <h1 className="text-xs px-2 text-red-400 text-right flex">
            <span className="w-8/12 text-left text-base block">
              {chat?.lastmessage}
            </span>
            <span className="text-xs text-right w-4/12 block text-red-500">
              5 m ago
            </span>
          </h1>
        </Link>
      </div>
    </div>
  );
}
