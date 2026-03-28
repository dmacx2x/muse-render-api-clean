import React from "react";

export default function StudioPage() {
  return (
    <div style={{ padding: "40px" }}>
      <h1>ATA Muse Studio</h1>
      <p>Render system is live.</p>
    </div>
  );
}

// 🔥 THIS FIXES YOUR BUILD
export async function getServerSideProps() {
  return {
    props: {}
  };
}