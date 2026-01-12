const canvas = document.getElementById("pixelCanvas");
const ctx = canvas.getContext("2d");

let pixelSize = 10;
const img = document.getElementById("pixelCar");

// Fade exponent: smaller = slower fade
const fadeExponent = 0.9;

// Hex colors
const color1 = "#B68757"; // start color
const color2 = "#405f5e"; // end color

// Offset to avoid fully opaque first column/row
const offset = 0.05;

// Helper: convert hex to RGB
function hexToRgb(hex) {
  hex = hex.replace(/^#/, "");
  if (hex.length === 3) hex = hex.split("").map(h => h + h).join("");
  const intVal = parseInt(hex, 16);
  return {
    r: (intVal >> 16) & 255,
    g: (intVal >> 8) & 255,
    b: intVal & 255
  };
}

// Linear interpolation
function lerp(a, b, t) {
  return a + (b - a) * t;
}

const rgb1 = hexToRgb(color1);
const rgb2 = hexToRgb(color2);

function generatePixels() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const imgRect = img.getBoundingClientRect();
  const imgLeft = imgRect.left;
  const imgTop = imgRect.top;
  const imgRight = imgRect.right;
  const imgBottom = imgRect.bottom;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const rows = Math.ceil(canvas.height / pixelSize);
  const cols = Math.ceil(canvas.width / pixelSize);

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = c * pixelSize + pixelSize / 2; // avoid 0
      const y = r * pixelSize + pixelSize / 2;

      // Skip pixels inside the image
      if (x >= imgLeft && x < imgRight && y >= imgTop && y < imgBottom) continue;

      let directionalAlpha;

      // Left side
      if (x < imgLeft) {
        directionalAlpha = 1 - Math.pow(Math.max(x / imgLeft, offset), fadeExponent);
      }
      // Right side
      else if (x > imgRight) {
        directionalAlpha = 1 - Math.pow(Math.max((canvas.width - x) / (canvas.width - imgRight), offset), fadeExponent);
      }
      // Top side
      else if (y < imgTop) {
        directionalAlpha = 1 - Math.pow(Math.max(y / imgTop, offset), fadeExponent);
      }
      // Bottom side
      else if (y > imgBottom) {
        directionalAlpha = 1 - Math.pow(Math.max((canvas.height - y) / (canvas.height - imgBottom), offset), fadeExponent);
      } else {
        directionalAlpha = 1; // fallback
      }

      // Randomized opacity
      const randomAlpha = Math.random() * 0.5 + 0.5;
      const opacity = directionalAlpha * randomAlpha;

      // Interpolate color
      const rCol = Math.round(lerp(rgb1.r, rgb2.r, opacity));
      const gCol = Math.round(lerp(rgb1.g, rgb2.g, opacity));
      const bCol = Math.round(lerp(rgb1.b, rgb2.b, opacity));

      ctx.fillStyle = `rgba(${rCol},${gCol},${bCol},${opacity.toFixed(2)})`;
      ctx.fillRect(x, y, pixelSize, pixelSize);
    }
  }
}
// Initial generate
generatePixels();

// Update on resize or image load
window.addEventListener("resize", () => {
  generatePixels();
});
img.addEventListener("load", () => {
  generatePixels();
});
