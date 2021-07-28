export default function getOrientation() {
  var orientation = window.innerWidth > window.innerHeight ? "Landscape" : "Portrait";
  if (window.innerWidth < 900) {
    return orientation;
  }
}
