import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";

const useErrors = (errors = []) => {
  useEffect(() => {
    errors.forEach(({ isError, error, fallback }) => {
      if (isError) {
        if (typeof fallback === "function") {
          fallback(); // Call fallback only if it's a function
        } else {
          toast.error(error?.data?.message || "Something went wrong");
        }
      }
    });
  }, [errors]);
};

const useAsyncMutation = (mutationHook) => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);

  const [mutate] = mutationHook();
  const executeMutation = async (toastMessage, ...args) => {
    setIsLoading(true);
    const toastId = toast.loading(toastMessage || "Loading data...");
    try {
      const res = await mutate(...args);

      if (res.data) {
        toast.success(res?.data?.message || "Success", { id: toastId });
        setData(res.data);
      } else {
        console.log(error);
        toast.error(res?.error?.data?.message || "Something else went wrong", {
          id: toastId,
        });
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.data?.message || "Something went wrong", {
        id: toastId,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return [executeMutation, isLoading, data];
};

const useSocketEvents = (socket, handlers) => {
  useEffect(() => {
    Object.entries(handlers).forEach(([event, handler]) => {
      socket.on(event, handler);
    });
    return () => {
      Object.entries(handlers).forEach(([event, handler]) => {
        socket.off(event, handler);
      });
    };
  }, [socket, handlers]);
};

export { useErrors, useAsyncMutation, useSocketEvents };
