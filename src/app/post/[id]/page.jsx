import axios from "axios";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function page() {
  const { id } = useParams();
  const [postInfo, setPostInfo] = useState(null);
  const [profile, setProfile] = useState(null);
  useEffect(() => {
    const fatchData = async () => {
      await axios
        .get(`/api/post/${id}`)
        .then((data) => {
          setPostInfo(data.data.data);
        })
        .catch((err) => {
          setPostInfo("none");
          console.log(err);
        });
    };
    fatchData();
  }, []);

  useEffect(() => {
    const fatchData = async () => {
      await axios
        .get(`/api/profile/${postInfo.userid}`)
        .then((data) => {
          setProfile(data.data.data);
        })
        .catch((err) => {
          setProfile("none");
          console.log(err);
        });
    };
    fatchData();
  }, [postInfo]);

  if (!profile) {
    return (
      <>
        <div className="p-2 my-10 loadingbig">
          {/* header */}
          <div className="flex items-center space-x-2">
            <div className="w-2/12 text-center">
              <Link
                className="w-10 m-auto h-10 loading rounded-full block"
                href={""}
              ></Link>
            </div>
            <div className="w-8/12">
              <h1 className="text-xl loading text-white font-bold">
                <Link href={""}></Link>
              </h1>
              <h1 className="text-sm loading text-slate-600 font-bold"></h1>
            </div>
            <div className="w-2/12 loading text-2xl text-center"></div>
          </div>

          {/* content */}
          <div className="py-4 text-slate-600">
            <p className="py-10 loadingbig"></p>
          </div>

          {/* footer */}
          <div className="flex items-center space-x-5">
            <div className="w-6/12 text-xl loading cursor-pointer hover:bg-slate-600 text-center bg-slate-950 p-1 rounded-xl"></div>
            <div className="w-6/12 loading text-xl cursor-pointer hover:bg-slate-600 text-center bg-slate-950 p-1 rounded-xl"></div>
          </div>
        </div>
      </>
    );
  }

  //   format time
  const createdAt = new Date(postInfo.createdAt);

  const year = createdAt.getFullYear();
  const month = String(createdAt.getMonth() + 1).padStart(2, "0");
  const day = String(createdAt.getDate()).padStart(2, "0");

  const formattedDate = `${year}-${month}-${day}`;

  return (
    <>
      <div className="p-2">
        {/* header */}
        <div className="p-2 flex items-center text-3xl">
          <div className="w-6/12">
            <Link href={"/feed"}>
              <CgArrowLeft />
            </Link>
          </div>
          <div className="w-6/12 text-right">
            <MdHelp className="inline-block" />
          </div>
        </div>
      </div>
      <div className="p-0">
        {/* header */}
        <div className="flex items-center space-x-2">
          <div className="w-2/12 text-center">
            <Link href={`/profile/${profile}`}>
              <img
                className="w-10 m-auto h-10 rounded-full block"
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfhHGR8bTVzFRi4LjAKEbCXe3Nm7wSxh3H3g&usqp=CAU"
                alt=""
              />
            </Link>
          </div>
          <div className="w-8/12">
            <h1 className="text-xl text-white font-bold">
              <Link href={`/profile/${profile._id}`}>{profile.name}</Link>
            </h1>
            <h1 className="text-sm text-slate-600 font-bold">
              {formattedDate}
            </h1>
          </div>
          <div className="w-2/12 text-2xl text-center">
            <MdHelp className="inline-block" />
          </div>
        </div>

        {/* content */}
        <div className="py-14 text-white rounded-lg text-center my-2 p-4 bg-slate-800">
          <p>{postInfo.postcontent}</p>
        </div>

        {/* footer */}
        <div className="flex items-center space-x-5">
          <div className="w-6/12 flex justify-center items-center text-xl cursor-pointer hover:bg-slate-600 text-center bg-slate-950 p-1 rounded-xl">
            <span>{postInfo?.reactions?.length}</span>
            <CgHeart className="inline-block" />
          </div>
          <div className="w-6/12 text-xl flex justify-center items-center cursor-pointer hover:bg-slate-600 text-center bg-slate-950 p-1 rounded-xl">
            <span>{postInfo?.comments?.length}</span>
            <CgComment className="inline-block" />
          </div>
        </div>
      </div>
    </>
  );
}