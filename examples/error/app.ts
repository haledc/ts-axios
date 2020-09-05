import axios, { AxiosError } from "../../src";

// 404
axios({
  method: "get",
  url: "/error/get1",
})
  .then((res) => console.log(res))
  .catch((err) => console.log(err));

// 500
axios({
  method: "get",
  url: "/error/get",
})
  .then((res) => console.log(res))
  .catch((err) => console.log(err));

// delay
setTimeout(() => {
  axios({
    method: "get",
    url: "/error/get",
  })
    .then((res) => console.log(res))
    .catch((err) => console.log(err));
}, 5000);

// timeout
// ! test fail
axios({
  method: "get",
  url: "/error/timeout",
  timeout: 2000,
})
  .then((res) => console.log(res))
  .catch((err: AxiosError) => {
    // console.log('err =>', err)
    console.log(err.message);
    console.log(err.code);
  });
