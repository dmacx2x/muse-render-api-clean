import Link from "next/link";

export default function Home() {
  return (
    <div style={{ padding: 40 }}>
      <h1>ATA Muse Video Engine</h1>

      <p>System is live.</p>

      <Link href="/studio">
        Go to Studio
      </Link>
    </div>
  );
}