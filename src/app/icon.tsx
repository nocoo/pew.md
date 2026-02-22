import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

// 32x32 pixel art: cowboy standing on grass lawn
// each cell = 1px, designed for favicon clarity at small sizes
// palette
const _ = "transparent";
const G1 = "#4a8c3f"; // grass base
const G2 = "#3d7a34"; // grass dark
const G3 = "#5a9e4e"; // grass light
const H = "#5b3a29"; // hat brown
const HD = "#3e2723"; // hat brim
const S = "#c4956a"; // skin
const K = "#2a1f1e"; // dark outline
const W = "#f5f0e1"; // shirt white
const R = "#c0392b"; // bandana red
const T = "#8b6914"; // belt/boots tan
const B = "#3b5dc9"; // jeans blue

// prettier-ignore
const ICON: string[][] = [
  // rows 0-9: sky / empty above cowboy
  [G1,G2,G1,G3,G1,G1,G2,G1,G3,G1,G1,G2,G1,G1,G3,G1,G2,G1,G1,G3,G1,G2,G1,G1,G3,G1,G1,G2,G1,G3,G1,G2],
  [G2,G1,G3,G1,G1,G2,G1,G3,G1,G2,G1,G1,G3,G1,G1,G2,G1,G3,G1,G1,G2,G1,G3,G1,G1,G2,G1,G1,G3,G1,G2,G1],
  [G1,G1,G2,G1,G3,G1,G1,G2,G1,G1,G3,G1,G2,G1,G1,G3,G1,G2,G1,G3,G1,G1,G2,G1,G2,G1,G3,G1,G1,G2,G1,G3],
  [G3,G1,G1,G2,G1,G1,G3,G1,G2,G1,G1,G3,G1,G1,G2,G1,G1,G3,G1,G2,G1,G3,G1,G2,G1,G1,G2,G3,G1,G1,G3,G1],
  [G1,G2,G1,G1,G3,G1,G1,G2,G1,G3,G1,G1,G2,G1,G1,G3,G1,G1,G2,G1,G3,G1,G1,G3,G1,G2,G1,G1,G2,G1,G1,G2],
  [G1,G1,G3,G1,G1,G2,G1,G1,G3,G1,G2,G1,G1,G3,G1,G1,G2,G1,G3,G1,G1,G2,G1,G1,G3,G1,G1,G2,G1,G3,G1,G1],
  [G2,G1,G1,G2,G1,G3,G1,G1,G1,G2,G1,G3,G1,G1,G2,G1,G3,G1,G1,G2,G1,G1,G3,G1,G1,G2,G1,G3,G1,G1,G2,G1],
  [G1,G3,G1,G1,G2,G1,G1,G3,G1,G1,G2,G1,G1,G3,G1,G1,G2,G1,G1,G3,G1,G1,G2,G1,G3,G1,G1,G1,G2,G1,G3,G1],
  // row 8: hat top
  [G1,G1,G2,G1,G3,G1,G1,G2,G1,G1,G3,G1, H, H, H, H, H, H, H, H,G1,G1,G2,G1,G3,G1,G1,G2,G1,G1,G3,G1],
  // row 9: hat mid
  [G2,G1,G1,G3,G1,G1,G2,G1,G3,G1, H, H, H, H, H, H, H, H, H, H, H, H,G1,G3,G1,G1,G2,G1,G1,G3,G1,G2],
  // row 10: hat brim (wide)
  [G1,G1,G3,G1,G1,G2,G1,G1,G3, H, H, H, H, H, H, H, H, H, H, H, H, H, H,G1,G2,G1,G1,G3,G1,G1,G2,G1],
  // row 11: brim shadow
  [G1,G2,G1,G1,G3,G1,G1,G2,G1, H,HD,HD,HD,HD,HD,HD,HD,HD,HD,HD,HD, H,G1,G2,G1,G1,G3,G1,G2,G1,G1,G3],
  // row 12: face top
  [G3,G1,G1,G2,G1,G1,G3,G1,G2,G1, K, S, S, S, S, S, S, S, S, K,G1,G1,G3,G1,G1,G2,G1,G1,G3,G1,G3,G1],
  // row 13: eyes
  [G1,G1,G2,G1,G3,G1,G1,G2,G1,G1, S, K, S, S, S, S, S, S, K, S,G1,G2,G1,G3,G1,G1,G2,G1,G1,G2,G1,G1],
  // row 14: face bottom
  [G2,G1,G1,G3,G1,G1,G2,G1,G3,G1, S, S, S, S, S, S, S, S, S, S,G1,G1,G3,G1,G1,G2,G1,G3,G1,G1,G2,G1],
  // row 15: bandana
  [G1,G3,G1,G1,G2,G1,G1,G3,G1,G1,G1, S, R, R, R, R, R, R, S,G1,G1,G3,G1,G1,G2,G1,G1,G3,G1,G1,G3,G1],
  // row 16: neck/shirt top
  [G1,G1,G2,G1,G1,G3,G1,G1,G2,G1,G1, W, W, W, W, W, W, W, W,G1,G1,G1,G2,G1,G3,G1,G1,G2,G1,G3,G1,G2],
  // row 17: shirt
  [G2,G1,G1,G2,G1,G1,G2,G1,G1,G1, W, W, W, W, W, W, W, W, W, W,G1,G2,G1,G1,G2,G1,G2,G1,G1,G2,G1,G1],
  // row 18: shirt + belt
  [G1,G3,G1,G1,G3,G1,G1,G3,G1, W, W, W, W, T, T, T, T, W, W, W, W,G1,G3,G1,G1,G3,G1,G1,G3,G1,G1,G3],
  // row 19: shirt bottom
  [G1,G1,G2,G1,G1,G2,G1,G1,G2, W, W, W, W, T, T, T, T, W, W, W, W,G1,G1,G2,G1,G1,G2,G1,G1,G2,G1,G1],
  // row 20: shirt/jeans transition
  [G2,G1,G1,G3,G1,G1,G2,G1,G1,G1, W, W, W, W, W, W, W, W, W, W,G1,G1,G2,G1,G3,G1,G1,G2,G1,G1,G2,G1],
  // row 21: jeans top
  [G1,G1,G3,G1,G2,G1,G1,G3,G1,G1,G1, B, B, B, B, B, B, B, B,G1,G1,G1,G1,G3,G1,G2,G1,G1,G3,G1,G1,G3],
  // row 22: jeans
  [G1,G2,G1,G1,G1,G3,G1,G1,G2,G1,G1, B, B, B, B, B, B, B, B,G1,G1,G2,G1,G1,G1,G3,G1,G2,G1,G1,G2,G1],
  // row 23: jeans legs
  [G3,G1,G1,G2,G1,G1,G2,G1,G1,G3,G1, B, B,G1,G1,G1,G1, B, B,G1,G3,G1,G1,G2,G1,G1,G2,G1,G1,G3,G1,G1],
  // row 24: boots
  [G1,G1,G2,G1,G3,G1,G1,G2,G1,G1,G1, T, T,G1,G1,G1,G1, T, T,G1,G1,G1,G2,G1,G3,G1,G1,G2,G1,G1,G2,G1],
  // rows 25-31: grass below
  [G2,G1,G1,G3,G1,G1,G2,G1,G3,G1,G1,G2,G1,G3,G1,G1,G2,G1,G3,G1,G1,G2,G1,G3,G1,G1,G2,G1,G3,G1,G1,G2],
  [G1,G3,G1,G1,G2,G1,G1,G3,G1,G1,G2,G1,G1,G3,G1,G1,G2,G1,G1,G3,G1,G1,G2,G1,G1,G3,G1,G1,G2,G1,G3,G1],
  [G1,G1,G2,G1,G1,G3,G1,G1,G2,G3,G1,G1,G2,G1,G3,G1,G1,G2,G1,G1,G3,G1,G1,G2,G3,G1,G1,G2,G1,G3,G1,G1],
  [G2,G1,G1,G2,G3,G1,G1,G2,G1,G1,G3,G1,G1,G2,G1,G1,G3,G1,G2,G1,G1,G2,G3,G1,G1,G3,G1,G1,G2,G1,G1,G2],
  [G1,G3,G1,G1,G1,G2,G1,G1,G3,G1,G1,G2,G1,G1,G3,G1,G1,G3,G1,G1,G2,G1,G1,G2,G1,G1,G2,G1,G1,G3,G2,G1],
  [G1,G1,G2,G1,G3,G1,G3,G1,G1,G2,G1,G1,G3,G1,G1,G2,G1,G1,G2,G1,G3,G1,G3,G1,G1,G2,G1,G3,G1,G1,G1,G3],
  [G2,G1,G1,G3,G1,G1,G1,G2,G1,G1,G3,G1,G1,G2,G1,G1,G3,G1,G1,G3,G1,G1,G1,G2,G1,G1,G3,G1,G2,G1,G2,G1],
];

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: 32,
          height: 32,
          backgroundColor: "#4a8c3f",
        }}
      >
        {ICON.map((row, y) =>
          row.map((color, x) =>
            color !== _ ? (
              <div
                key={`${x}-${y}`}
                style={{
                  position: "absolute",
                  left: x,
                  top: y,
                  width: 1,
                  height: 1,
                  backgroundColor: color,
                }}
              />
            ) : null,
          ),
        )}
      </div>
    ),
    { ...size },
  );
}
