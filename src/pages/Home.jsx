import { useEffect, useState } from "react";
import {
  getActiveFestival,
  getFestivalActivities,
  getFestivalGallery,
  getFestivalFaqs,
} from "../services/festivalService";

import Hero from "../components/Hero";
import Navbar from "../components/Navbar";
import AboutSection from "../components/AboutSection";
import ActivitiesSection from "../components/ActivitiesSection";
import GallerySection from "../components/GallerySection";
import RegistrationSection from "../components/RegistrationSection";
import VestSection from "../components/VestSection";
import VendorSection from "../components/VendorSection";
import FAQSection from "../components/FAQSection";
import ContactSection from "../components/ContactSection";
import Footer from "../components/Footer";

function Home() {
  const [festival, setFestival] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [gallery, setGallery] = useState([]);
  const [faqs, setFaqs] = useState([]);

  useEffect(() => {
    async function loadFestival() {
      try {
        const festivalData = await getActiveFestival();

        const activitiesData = await getFestivalActivities(
          festivalData.id
        );

        const galleryData = await getFestivalGallery(
  festivalData.id
);

const faqsData = await getFestivalFaqs(
  festivalData.id
);

        setFestival(festivalData);
        setActivities(activitiesData);
        setGallery(galleryData);
        setFaqs(faqsData);


      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadFestival();
  }, []);

  if (loading) {
    return <div className="app">Loading festival...</div>;
  }

  if (error) {
    return (
      <div className="app">
        <h1>Unable to load festival</h1>
        <p>{error}</p>
      </div>
    );
  }

 return (
  <main>

    <Navbar festival={festival} />

    <Hero festival={festival} />

    <AboutSection festival={festival} />

    <ActivitiesSection activities={activities} />

    <GallerySection gallery={gallery} />

    <RegistrationSection festival={festival} />

    <VestSection festival={festival} />

    <VendorSection festival={festival} />

    <FAQSection faqs={faqs} />

    <ContactSection festival={festival} />

    <Footer festival={festival} />

  

    
  </main>
);
}

export default Home;