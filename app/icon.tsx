import { ImageResponse } from "next/og";

/**
 * Favicon — the lime "me" node on the near-black charcoal, matching the
 * network's core-result token (DESIGN.md palette).
 */

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#05070C",
          borderRadius: 7,
        }}
      >
        <div
          style={{
            width: 16,
            height: 16,
            borderRadius: "50%",
            background: "rgba(204,255,0,0.14)",
            border: "2.5px solid #CCFF00",
            boxShadow: "0 0 8px 2px rgba(204,255,0,0.55)",
          }}
        />
      </div>
    ),
    { ...size },
  );
}
