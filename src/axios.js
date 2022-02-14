// axios
import axios from "axios";

const baseURL = "https://iapitest.eva.guru/";

export default axios.create({
  baseURL,
  // You can add your headers here
});
