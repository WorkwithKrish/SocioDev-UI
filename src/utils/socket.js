import io from "socket.io-client";
import { BASE_URL } from "./constants";

const createSocketConnection = () => {
  const redirectUrl =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
      ? BASE_URL
      : "https://devkp.xyz/api";
  const socket = io(redirectUrl);
  return socket;
};
export default createSocketConnection;
