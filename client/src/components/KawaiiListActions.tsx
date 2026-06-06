export const kawaiiIconButtonStyle = {
  border: "none",
  borderRadius: "999px",
  width: 24,
  height: 24,
  minWidth: 24,
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  fontFamily: "'Nunito', sans-serif",
  fontWeight: 900,
  fontSize: "0.8rem",
  boxShadow: "0 2px 6px rgba(91, 58, 41, 0.12)",
  transition: "transform 0.15s ease, filter 0.15s ease",
} as const;

export function AddKawaiiButton({ onClick, title = "Incluir item" }: { onClick: () => void; title?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-label={title}
      style={{ ...kawaiiIconButtonStyle, background: "#BFD8B8", color: "#3D5C3A" }}
    >
      +
    </button>
  );
}

export function DeleteKawaiiButton({ onClick, title = "Excluir item" }: { onClick: () => void; title?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-label={title}
      style={{ ...kawaiiIconButtonStyle, background: "#FFE8EC", color: "#C95D73" }}
    >
      🗑️
    </button>
  );
}
