import React from "react";
import axios from "../utils/axios";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setUserProfile } from "../Redux/authSlice";

const useGetUserProfile = (userId) => {

  const dispatch = useDispatch();
                                  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`/api/user/profile/${userId}`);
        dispatch(setUserProfile(res.data.user));
      } catch (error) {
        console.log(error);
        toast.error(error.response.data.message);
      }
    };
    fetchUser();
  },[userId]);
};

export default useGetUserProfile;
