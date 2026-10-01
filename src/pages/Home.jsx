import React from "react";
import Hero from "../components/Hero/Hero";
import Conversations from "../components/Home/Conversations";
import FeaturedSeries from "../components/Home/FeaturedSeries";
import Spotlight from "../components/Home/Spotlight";
import BusinessFirst from "../components/Home/BusinessFirst";
import ResourcesBlock from "../components/Home/ResourcesBlock";
import InDepth from "../components/Home/InDepth";
import EnquiriesPreview from "../components/Enquiries/Enquiries";
import BusinessQAPreview from "../components/BusinessQA/BusinessQA";
import DiscoverMore from "../components/common/DiscoverMore";
import "../styles/home.css";

// Homepage flow follows yourstory.com: Top Picks + lead + side column ->
// Conversations -> Featured row -> Spotlight -> Business First -> Resources ->
// In-Depth, then the community sections (enquiries, Q&A) and Discover more.
export default function Home() {
  return (
    <>
      <Hero />
      <Conversations />
      <FeaturedSeries />
      <Spotlight />
      <BusinessFirst />
      <ResourcesBlock />
      <InDepth />
      <EnquiriesPreview />
      <BusinessQAPreview />
      <DiscoverMore />
    </>
  );
}
