import { useState } from "react";

function FAQSection({ faqs }) {
  const [openIndex, setOpenIndex] = useState(null);

  function toggleFaq(index) {
    setOpenIndex((currentIndex) =>
      currentIndex === index ? null : index
    );
  }

  return (
    <section className="faq-section" id="faq">
      <div className="section-container">
        <div className="faq-header">
          <p className="section-eyebrow">QUESTIONS?</p>

          <h2>
            WE'VE GOT
            <span> ANSWERS.</span>
          </h2>

          <p>
            Everything you need to know about PAMFITNESS
            FESTIVAL 2026.
          </p>
        </div>

        <div className="faq-list">
          {faqs.map((faq, index) => (
            <div
              className={`faq-item ${
                openIndex === index ? "open" : ""
              }`}
              key={faq.id}
            >
              <button
                type="button"
                className="faq-question"
                onClick={() => toggleFaq(index)}
                aria-expanded={openIndex === index}
              >
                <span>{faq.question}</span>

                <span className="faq-icon">
                  {openIndex === index ? "−" : "+"}
                </span>
              </button>

              {openIndex === index && (
                <div className="faq-answer">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FAQSection;