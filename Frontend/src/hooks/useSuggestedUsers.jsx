import React from "react";
import axios from "../utils/axios";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setSuggestedUsers } from "../Redux/authSlice";

const useSuggestedUsers = () => {

  const dispatch = useDispatch();
                                  
  useEffect(() => {
    const fetchSuggestedUsers = async () => {
      try {
        const res = await axios.get("/api/user/suggested");
        dispatch(setSuggestedUsers(res.data.users));
      } catch (error) {
        console.log(error);
        toast.error(error.response.data.message);
      }
    };
    fetchSuggestedUsers();
  },[dispatch]);
};

export default useSuggestedUsers;
