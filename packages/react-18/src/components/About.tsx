import React from "react";
import { Link } from "react-router-dom";
import Greeting from "@react-demo/shared-components/lib/Greeting";

export function About() {
  return (
    <>
      <main>
        <h2>Who are we?</h2>
        <p>
          That feels like an existential question, don't you
          think?
        </p>
      </main>
      <nav>
        <Link to="/">Home</Link>
      </nav>
    </>
  );
}
