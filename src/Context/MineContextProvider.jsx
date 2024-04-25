"use client";
import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { off, onValue, ref } from "firebase/database";
import { db } from "@/app/firebaseConfig";

export const MineContext = createContext();

const MineContextProvider = ({ children }) => {
  // Context state variables
  const router = useRouter();

  const [data, setData] = useState(null);
  const [chats, setChats] = useState(null);
  const [profileInfo, setProfileInfo] = useState(null);
  const [myfriendid, setMyfriendid] = useState(null);
  const [allPost, setAllPost] = useState([]);
  const [allMyPost, setAllMyPost] = useState(null);
  const [lilLoader, setLilLoader] = useState(null);
  const [allfriendPost, setAllfriendPost] = useState(null);
  const [pandingMsg, setPandingMsg] = useState(0);
  const [error, setError] = useState(null);

  // Fetch website information on component mount
  const fetchfriendpostData = async (id) => {
    try {
      const responseMyData = await axios.get(`/api/post/friendpost/${id}`);
      setAllfriendPost(responseMyData.data.data);
    } catch (error) {
      setAllfriendPost([]);
      console.error({ error });
    }
  };

  const fetchMypostData = async () => {
    try {
      const responseMyData = await axios.get(`/api/post/mypost`);
      setAllMyPost(responseMyData.data.data);
    } catch (error) {
      setAllMyPost([]);
      console.error({ error });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseMyData = await axios.get(`/api/me`);
        setData(responseMyData.data.data);
      } catch (error) {
        setData("");
        console.error({ error });
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchChatData = async () => {
      let newChats = [];
      try {
        const chatDataResponse = await axios.get("/api/chat");
        const chatData = chatDataResponse.data.data || null;
        if (chatData) {
          for (const chat of chatData) {
            const otherUserId = chat?.chatids?.find((id) => id !== data?._id);
            try {
              if (otherUserId) {
                const profileResponse = await axios.get(
                  `/api/profile/${otherUserId}`
                );
                const profileData = profileResponse.data.data;

                const chatWithProfile = {
                  ...chat,
                  profileInfo: profileData,
                };

                newChats.push(chatWithProfile);
              }
            } catch (error) {
              console.error(error);
            }
          }
        }

        setChats(newChats);
      } catch (err) {
        console.error(err);
        setChats(null);
      }
    };

    fetchChatData();
  }, [data]);

  useEffect(() => {
    if (data && setChats) {
      const ntfRef = ref(db, "ntf/" + data?._id);

      const handleNotificationChange = (snapshot) => {
        if (snapshot.exists()) {
          const ntfData = snapshot.val();
          const chatId = ntfData.newMsgId;
          const friendaction = ntfData.friendaction;
          setPandingMsg(ntfData.msgUnseen);

          const id = ntfData.id;

          const fetchProfileData = async (chatId, id) => {
            try {
              const profileResponse = await axios.get(`/api/profile/${id}`);
              const profileData = profileResponse.data.data;
              const newChat = {
                chatids: [data._id, id],
                createdAt: ntfData?.msgtime,
                type: "random",
                _id: chatId,
                profileInfo: profileData,
              };
              setChats((prevChats) => [...prevChats, newChat]);
            } catch (error) {
              console.error(error);
            }
          };

          const updateFriendState = async (chatId, action) => {
            switch (action) {
              case "friend":
                const indexToUpdate = chats?.findIndex(
                  (chatItem) => chatItem?._id === chatId
                );

                if (indexToUpdate !== -1) {
                  const updatedChat = {
                    ...chats[indexToUpdate],
                    type: action,
                  };

                  const updatedChats = [
                    ...chats.slice(0, indexToUpdate),
                    updatedChat,
                    ...chats.slice(indexToUpdate + 1),
                  ];

                  setChats(updatedChats);
                }
                break;

              case "delete":
                const indexToDelete = chats?.findIndex(
                  (chatItem) => chatItem?.id === chatId
                );

                if (indexToDelete !== -1) {
                  const updatedChats = chats?.filter(
                    (_, index) => index !== indexToDelete
                  );
                  setChats(updatedChats);
                }
                break;

              default:
                break;
            }
          };

          const isChat = chats?.find((chatItem) => chatItem._id === id);
          console.log(isChat);
          const isAlreadyfnd = chats?.find(
            (chatItem) => chatItem?.friendaction === friendaction
          );

          if (!isChat) {
            fetchProfileData(chatId, id);
          }

          if (!isAlreadyfnd && isChat) {
            updateFriendState(chatId, friendaction);
          }
        }
      };

      onValue(ntfRef, handleNotificationChange);

      return () => {
        off(ntfRef, "value", handleNotificationChange);
      };
    }

    // update chatid and id to database null
  }, [data, setChats]);

  useEffect(() => {
    const fetchData = async () => {
      await axios
        .get(`/api/profile/${myfriendid}`)
        .then((data) => {
          setProfileInfo(data.data.data);
        })
        .catch((err) => {
          setProfileInfo("none");
        });
    };
    if (myfriendid) {
      fetchData();
    }
  }, []);

  // useEffect(() => {
  //   if (data) {
  //     const fetchData = async () => {
  //       let newPosts = [];
  //       try {
  //         const postData = await axios.get(`/api/post`);
  //         const actualData = postData.data.data;

  //         if (actualData) {
  //           for (const post of actualData) {
  //             const profileData = await axios.get(
  //               `/api/profile/${post?.userid}`
  //             );
  //             const profile = profileData.data.data;

  //             const postWithProfile = {
  //               ...post,
  //               profile,
  //             };

  //             newPosts.push(postWithProfile);
  //           }
  //         }

  //         setAllPost(newPosts);
  //       } catch (error) {
  //         setAllPost([]);
  //       }
  //     };
  //     fetchData();
  //   }
  // }, [data]);

  // Function to add a new post
  const handleAddPost = async (postContent, selectedOptions) => {
    try {
      if (!postContent.trim()) {
        setError("Post content is required");
        return;
      }

      const response = await axios.post("/api/post/add", {
        content: postContent,
        tags: selectedOptions,
        hidefrom: [],
        mentions: [],
        bgcolor: "",
        textcolor: "",
      });

      if (response?.data.statusCode === 200) {
        const newPost = response?.data?.data;

        const newSinglePost = {
          ...newPost,
          profile: data,
        };
        const newAllPosts = [...allPost, newSinglePost];

        setAllPost(newAllPosts);
        router.push("/feed");
      } else {
        setError("Failed to add post");
      }
    } catch (error) {
      console.error("Error adding post:", error);
      setError("Failed to add post");
    }
  };

  return (
    <MineContext.Provider
      value={{
        data,
        chats,
        profileInfo,
        myfriendid,
        allPost,
        error,
        setData,
        setChats,
        setProfileInfo,
        setMyfriendid,
        setAllPost,
        handleAddPost,
        allMyPost,
        setAllMyPost,
        allfriendPost,
        setAllfriendPost,
        fetchMypostData,
        fetchfriendpostData,
        pandingMsg,
        setPandingMsg,
        error,
        setError,
        lilLoader,
        setLilLoader,
      }}
    >
      {children}
    </MineContext.Provider>
  );
};

export default MineContextProvider;
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function (nums, target) {
  const sortedNumArray = nums.slice().sort((a, b) => a - b); // Sorting the array numerically

  let firstIndex = 0;
  let secondIndex = null;

  function getIndex(firstIndex) {
    for (let i = 0; i < sortedNumArray.length; i++) {
      if (sortedNumArray[firstIndex] + sortedNumArray[i] === target) {
        secondIndex = sortedNumArray.indexOf(sortedNumArray[i]);
        break;
      }
    }
  }

  getIndex(firstIndex);

  return [firstIndex, secondIndex];
};
                                                      