import { ImageResponse } from "next/og";
import { personal } from "@/data";

/**
 * OG / social share card — what LinkedIn, Twitter and iMessage render when the
 * site URL is shared. Dark charcoal stage, a small left→right synapse motif
 * (cobalt nodes converging into the lime "me" node), then the name + tagline.
 * Satori supports only flexbox + a CSS subset, so everything is plain divs.
 */

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt =
  "Nihar Domala — Data Engineer moving into AI Systems Engineering";

const COBALT = "#3B82F6";
const LIME = "#CCFF00";

export default function OpenGraphImage() {
  const nodes = [0, 1, 2, 3];
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "#05070C",
          padding: "0 96px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Synapse motif: cobalt nodes → line → lime core */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: 48 }}>
          {nodes.map((i) => (
            <div key={i} style={{ display: "flex", alignItems: "center" }}>
              <div
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: "50%",
                  border: `2px solid ${COBALT}`,
                  background: "rgba(59,130,246,0.15)",
                }}
              />
              <div
                style={{
                  width: 72,
                  height: 2,
                  background:
                    "linear-gradient(to right, rgba(59,130,246,0.7), rgba(59,130,246,0.25))",
                }}
              />
            </div>
          ))}
          <div
            style={{
              width: 22,
              height: 22,
              borderRadius: "50%",
              border: `3px solid ${LIME}`,
              background: "rgba(204,255,0,0.14)",
              boxShadow: "0 0 24px 4px rgba(204,255,0,0.45)",
            }}
          />
        </div>

        <div
          style={{
            fontSize: 84,
            fontWeight: 700,
            letterSpacing: "-0.03em",
            color: "#EDEFF2",
            lineHeight: 1,
          }}
        >
          {personal.name}
        </div>

        <div
          style={{
            marginTop: 28,
            fontSize: 34,
            color: COBALT,
            letterSpacing: "0.01em",
          }}
        >
          {personal.tagline}
        </div>

        <div
          style={{
            marginTop: 20,
            fontSize: 26,
            color: "#9CA3AF",
            maxWidth: 900,
          }}
        >
          {personal.subTagline}
        </div>

        <div
          style={{
            marginTop: 44,
            display: "flex",
            alignItems: "center",
            fontSize: 22,
            color: "#9CA3AF",
          }}
        >
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: LIME,
              marginRight: 12,
              boxShadow: "0 0 10px 2px rgba(204,255,0,0.6)",
            }}
          />
          {`inference: live · ${personal.statusFull.toLowerCase()}`}
        </div>
      </div>
    ),
    { ...size },
  );
}
