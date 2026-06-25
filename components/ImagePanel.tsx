type ImagePanelProps = {
  src?: string;
  label: string;
  text?: string;
};

export default function ImagePanel({ src, label, text }: ImagePanelProps) {
  return (
    <div className="card image-card">
      {src ? (
        <img src={src} alt={label} />
      ) : (
        <div style={{ height: 240, display: "grid", placeItems: "center", background: "#e7edf5", color: "#516076", fontWeight: 800 }}>
          Image placeholder
        </div>
      )}
      {(label || text) ? (
        <div className="caption">
          {label ? <h3>{label}</h3> : null}
          {text && <p>{text}</p>}
        </div>
      ) : null}
    </div>
  );
}
