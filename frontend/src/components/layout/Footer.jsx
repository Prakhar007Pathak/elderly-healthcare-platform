import { FaFacebookF, FaTwitter, FaYoutube, FaLinkedinIn } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-16">
      <div className="max-w-7xl mx-auto px-6 py-14">

        {/* DESKTOP */}
        <div className="hidden md:grid md:grid-cols-6 gap-10">

          <div className="md:col-span-2">
            <h2 className="text-lg font-semibold text-white mb-4">
              ElderCare
            </h2>

            <p className="text-sm leading-relaxed mb-5">
              Professional elderly nursing and healthcare services delivered at home with care, trust, and compassion.
            </p>

            <div className="text-sm space-y-1 mb-5">
              <p>+91 90000 00000</p>
              <p>support@eldercare.com</p>
            </div>

            <div className="flex space-x-3">
              <FaFacebookF size={14} />
              <FaTwitter size={14} />
              <FaYoutube size={14} />
              <FaLinkedinIn size={14} />
            </div>
          </div>

          <FooterColumn title="Company" items={["About", "Blogs", "Careers", "FAQs"]} />
          <FooterColumn title="Services" items={["Our Caregivers", "Nursing Care", "Elderly Assistance", "Physiotherapy", "Post Hospital Care"]} />
          <FooterColumn title="Locations" items={["Delhi", "Mumbai", "Bangalore", "Noida", "Gurgaon"]} />
          <FooterColumn title="Support" items={["Contact Us", "Terms & Conditions", "Privacy Policy", "Payment Policy"]} />
        </div>

        {/* MOBILE */}
        <div className="md:hidden space-y-12 text-sm">

          {/* Brand Center */}
          <div className="text-center">
            <h2 className="text-lg font-semibold text-white mb-4">
              ElderCare
            </h2>

            <p className="leading-relaxed text-slate-400 max-w-sm mx-auto">
              Professional elderly nursing and healthcare services delivered at home with care and compassion.
            </p>
          </div>

          {/* Equal Spaced Sections */}
          <div className="px-8">
            <div className="grid grid-cols-2 gap-x-8 gap-y-10">

              <div className="flex justify-center text-center">
                <FooterColumn
                  title="Company"
                  items={["About", "Blogs", "Careers", "FAQs"]}
                />
              </div>

              <div className="flex justify-center text-center">
                <FooterColumn
                  title="Services"
                  items={["Nursing Care", "Elderly Assistance", "Physiotherapy"]}
                />
              </div>

              <div className="flex justify-center text-center">
                <FooterColumn
                  title="Locations"
                  items={["Delhi", "Mumbai", "Bangalore"]}
                />
              </div>

              <div className="flex justify-center text-center">
                <FooterColumn
                  title="Support"
                  items={["Contact Us", "Privacy Policy", "Terms"]}
                />
              </div>

            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-700 py-4 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} ElderCare. All rights reserved.
      </div>
    </footer>
  );
};

const FooterColumn = ({ title, items }) => (
  <div>
    <h3 className="font-semibold text-white mb-3">{title}</h3>
    <ul className="space-y-2">
      {items.map((item, index) => (
        <li key={index} className="hover:text-white cursor-pointer transition">
          {item}
        </li>
      ))}
    </ul>
  </div>
);

export default Footer;