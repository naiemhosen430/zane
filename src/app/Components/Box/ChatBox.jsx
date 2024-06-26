"use client";
import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";
import Singlechatbox from "./singlechatbox";
import { MineContext } from "@/Context/MineContextProvider";

export default function ChatBox() {
  const { chats, setChats, data } = useContext(MineContext);
  const friendChat = chats?.filter((chat) => chat.type === "friend");

  if (!data || !friendChat || !chats) {
    return (
      <>
        <div className="w-full rounded-2xl">
          <h1 className="text-slate-500 p-1 px-2 flex items-center">
            <span className="block w-6/12">Friend and chat</span>
            <Link className="block w-6/12 text-right text-slate-600" href="">
              Create group
            </Link>
          </h1>
          <div className="space-y-2">
            <h1 className="py-10 text-center">No chats found</h1>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="w-full rounded-2xl pb-40">
        <h1 className="text-slate-500 p-1 px-2 flex items-center">
          <span className="block w-6/12">Friend and chat</span>
          <Link className="block w-6/12 text-right text-slate-600" href="">
            {/* Add correct href value */}
          </Link>
        </h1>
        <div className="space-y-2">
          {/* <div className="flex items-center justify-center p-2 px-1">
            <div className="w-2/12 flex items-center rounded-full pb-1">
              <Link
                className="block"
                href={`/profile/65fd48a78af4b8a1e16a7b1d`}
              >
                <img
                  className="w-12 h-12 rounded-full inline-block"
                  src={
                    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQCqu8BOhvKFDaFMAnjpAbK4o0VTGqo9BbeqTOvoWuVVfSqvqgG6hY5dc52EpEf5QTdBKY&usqp=CAU"
                  }
                  alt=""
                />
              </Link>
            </div>
            <div className="w-10/12">
              <Link href={`/converssion/65fd48a78af4b8a1e16a7b1d`}>
                <h1 className="text-sm px-2">
                  MD Naiem
                  <span className="px-2 text-xs text-slate-800">
                    (Zane official)
                  </span>
                </h1>
                <h1 className="text-xs px-2 text-red-500"></h1>
                <h1 className="text-xs px-2 text-red-400 text-right flex">
                  <span className="w-8/12 text-left text-xs block">
                    Hello, need hellp?
                  </span>
                  <span className="text-xs text-right w-4/12 block text-red-500">
                    5 m ago
                  </span>
                </h1>
              </Link>
            </div>
          </div> */}
          {friendChat?.length === 0 || !friendChat ? (
            <h1 className="py-10 text-center">No chats found</h1>
          ) : (
            friendChat
              ?.slice()
              ?.sort((a, b) => {
                const lastMsgTimeA =
                  a.chatArr?.[a.chatArr.length - 1]?.msgtime || 0;
                const lastMsgTimeB =
                  b.chatArr?.[b.chatArr.length - 1]?.msgtime || 0;
                return lastMsgTimeB - lastMsgTimeA;
              })
              ?.map((chat) => <Singlechatbox chat={chat} myid={data?._id} />)
          )}
        </div>
      </div>
    </>
  );
}
