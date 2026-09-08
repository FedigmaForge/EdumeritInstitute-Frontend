"use client";

export default function DownloadButton({ label = "Download" }) {
  return (
    <a
      href="#"
      className="btn-download"
      onClick={(e) => {
        e.preventDefault();
        alert("This resource isn't uploaded yet. Please contact us on WhatsApp and we'll share it with you directly.");
      }}
    >
      <i className="fas fa-download"></i> {label}
    </a>
  );
}
