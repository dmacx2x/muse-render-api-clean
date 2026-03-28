import React from "react";
import Link from "next/link";

export default function Home() {
  return (
    <div style={{ padding: "40px" }}>
      <h1>ATA Muse Video Engine</h1>

      <p>Welcome to the render system.</p>

      <Link href="/studio">
        <button style={{ padding: "10px 20px", marginTop: "20px" }}>
          Go to Studio
        </button>
      </Link>
    </div>
  );
}

// 🔥 THIS FIXES YOUR BUILD
export async function getServerSideProps() {
  return {
    props: {}
  };
}