import React from "react";
import axios from "../utils/axios";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setUserPost } from "../Redux/postSlice";

const useGetPostByUser = (postId) => {

  const dispatch = useDispatch();
                                  
  useEffect(() => {
    const fetchUserPost = async () => {
      try {
        const res = await axios.get(`/api/post/getPostByUser/${postId}`);
        dispatch(setUserPost(res.data.posts));
      } catch (error) {
        console.log(error);
        toast.error(error.response.data.message);
      }
    };
    fetchUserPost();
  },[dispatch, postId]);
};

export default useGetPostByUser;
