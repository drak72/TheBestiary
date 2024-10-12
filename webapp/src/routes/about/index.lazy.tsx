import { createLazyFileRoute } from "@tanstack/react-router";
import "@routes/about/about.css";

export const Route = createLazyFileRoute("/about/")({
  component: AboutComponent,
});
function AboutComponent() {
  return (
    <>
      <section
        style={{
          backgroundImage: `url("https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/The_Hunt_of_the_Unicorn_Tapestry_1.jpg/1280px-The_Hunt_of_the_Unicorn_Tapestry_1.jpg")`,
        }}
        className="hero-section"
      />
      <div className="content-wrapper">
        <div className="hero-content">
          <h1 className="hero-title">The medieval bestiary</h1>
          <h3 className="hero-subtitle">
            Welcome to the Generative Bestiary: Where Myth Meets Imagination
          </h3>
          <p className="hero-text">
            A bestiary is a medieval compendium of fantastic creatures, blending
            natural history, mythology, and moral allegory. These extraordinary
            manuscripts, popular from the 12th to the 15th centuries, were more
            than simple catalogs of animals. They were illuminated texts that
            described both real and imaginary beasts, often imbuing each
            creature with symbolic religious or moral significance.
          </p>
          <p className="hero-text">
            This Generative Bestiary breathes new life into this ancient
            tradition. Here, we explore the rich tapestry of mythical creatures,
            starting with one of the most enchanting—the unicorn.
          </p>
          <p className="hero-text">
            The unicorn's mythology spans millennia and continents. Far from the
            sparkly, rainbow-maned creature of modern popular culture, the
            historical unicorn was a symbol of purity, power, and mystery.
            Ancient Greek historians like Ctesias described unicorns as wild
            Iranian asses with single white horns. Medieval bestiaries
            transformed this creature into a potent Christian allegory: a wild,
            untameable beast that could only be captured by a virgin,
            symbolizing Christ's incarnation.
          </p>
          <p className="hero-text">
            Medieval illuminations often depicted unicorns as elegant,
            horse-like creatures with a single spiraling horn emerging from
            their forehead. This horn was believed to possess miraculous healing
            properties and the ability to purify poisoned water—a metaphor for
            spiritual cleansing.
          </p>
        </div>
      </div>
      <div className="project-section">
        <h1 className="hero-title">This Project</h1>
        <hr />
        <p className="hero-text">
          ...Is not that. This project was a way to become more familiar with
          the capabilities of the various foundation models, and AWS Bedrock as
          a common interface for them. My daughter loves unicorns, and so that
          felt like as good a starting point as any.
        </p>
        <p className="hero-text">
          Every day, a unicorn is generated from a random image model, piped to
          a random multi-mode model for description, and emailed out as a daily
          fun fact card. Sort of a generative zoobooks for my daughter.
        </p>
        <p className="hero-text">I hope that you also enjoy them!</p>
      </div>
      <p className="image-credit">
        "The Hunt of the Unicorn Tapestry Series" The Cloisters, Public domain,
        via Wikimedia Commons
      </p>
    </>
  );
}
