export default function trycatch(promise) {
  return promise.then((data) => [null, data]).catch((err) => [err]);
}
