// test passed
import axios, { Canceler } from "../../src";
const CancelToken = axios.CancelToken;

// // CancelToken.source 静态方法取消
const { token, cancel } = CancelToken.source();
// axios
//   .get("/cancel/get", {
//     cancelToken: token,
//   })
//   .catch((err) => {
//     if (axios.isCancel(err)) {
//       console.log("Request canceled:", err.message);
//     }
//   });

setTimeout(() => {
  // cancel("Operation canceled by the user.");

  axios.post("/cancel/post", { a: 1 }, { cancelToken: token }).catch((err) => {
    if (axios.isCancel(err)) {
      console.log(err.message);
    }
  });
  // post no cancel
}, 200);

// // cancel 实例取消
// let cancel2: Canceler;
// axios
//   .get("/cancel/get", {
//     cancelToken: new CancelToken((c) => (cancel2 = c)),
//   })
//   .catch((err) => {
//     if (axios.isCancel(err)) {
//       console.log("Request canceled.");
//     }
//   });
// setTimeout(() => {
//   cancel2();
// }, 200);
