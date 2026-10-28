// Pure-JS QR encoder from the "qrcode" package. Imported directly so Metro
// never pulls the Node/canvas renderers.
declare module "qrcode/lib/core/qrcode" {
  export { create } from "qrcode";
}
