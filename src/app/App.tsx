import MainApp from "./MainApp";

export default function App() {
  return (
    <div className="min-h-screen" style={{
      backgroundImage: `
        linear-gradient(to bottom, #f5f3f0 0%, #f8f6f3 100%),
        repeating-linear-gradient(
          45deg,
          transparent,
          transparent 2px,
          rgba(0, 0, 0, 0.008) 2px,
          rgba(0, 0, 0, 0.008) 4px
        )
      `,
      backgroundBlendMode: 'overlay'
    }}>
      <MainApp />
    </div>
  );
}