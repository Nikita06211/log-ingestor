import axios from "axios";

const instance = axios.create({
  baseURL: "https://log-ingestor-2nlu.onrender.com",
});

export default instance;