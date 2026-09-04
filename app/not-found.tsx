import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found",
  description: "That page could not be found.",
};

export default function NotFound() {
  return (
    <div className="container page page-narrow">
      <div className="page-hero">
        <h1>Page not found</h1>
        <p className="lead">
          That page doesn’t exist. Start from the job:{" "}
          <Link href="/">what are you trying to do?</Link>
        </p>
      </div>
    </div>
  );
}
