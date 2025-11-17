import React from "react";
import axios from "../utils/axios";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setPosts } from "../Redux/postSlice";

const useGetAllPosts = () => {

  const dispatch = useDispatch();
                                  
  useEffect(() => {
    const fetchAllPost = async () => {
      try {
        const res = await axios.get("/api/post/getAllPosts");
        dispatch(setPosts(res.data.posts));
      } catch (error) {
        console.log(error);
        toast.error(error.response.data.message);
      }
    };
    fetchAllPost();
  },[dispatch]);
};

export default useGetAllPosts;
