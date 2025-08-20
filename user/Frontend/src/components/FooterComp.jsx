import React, { useState } from 'react';

const FooterComp = () => {
  const [activeModal, setActiveModal] = useState('');

  const closeModal = () => setActiveModal('');

  return (
    <div>
      <footer className="bg-black text-white py-4 px-4 md:px-10 text-sm flex flex-col sm:flex-row sm:justify-center items-center gap-4">
        <button onClick={() => setActiveModal('about')} className="hover:underline">
          About Us
        </button>

        <button onClick={() => setActiveModal('privacy')} className="hover:underline">
          Privacy Policy
        </button>

        <button onClick={() => setActiveModal('contact')} className="hover:underline">
          Contact Us
        </button>
      </footer>

      {/* ---------------- About Us Modal ---------------- */}
      {activeModal === 'about' && (
        <Modal title="About Us" closeModal={closeModal}>
          <p className="text-sm text-gray-700">
            Fuel Flux is an innovative startup transforming how people fuel their vehicles.
            With a focus on convenience and efficiency, we offer on-demand refueling services
            through a user-friendly mobile app. Vehicle owners can easily schedule and manage
            fuel bookings (pre-booking slots), eliminating the need for long queues at fuel
            stations. Our mission is to provide a reliable, eco-friendly alternative to
            traditional refueling methods, saving customers valuable time while enhancing their
            overall experience. Committed to sustainability, Fuel Flux promotes energy-efficient
            solutions while ensuring top-tier customer satisfaction, making refueling seamless
            and stress-free. We also provide AI models for the automation of stations.
          </p>
        </Modal>
      )}

      {/* ---------------- Privacy Policy Modal ---------------- */}
      {activeModal === 'privacy' && (
        <Modal title="Terms & Privacy Policy" closeModal={closeModal}>
          <div className="text-sm text-gray-700 space-y-3">
            <p><strong>1. Acceptance of Terms</strong><br />
              By downloading, accessing, or using the Fuel Flux application, you agree to be bound by these terms and our Privacy Policy. If you do not agree with any part of these terms, you should not use the application.
            </p>

            <p><strong>2. User Registration</strong><br />
              To use certain features of the Fuel Flux application, you may need to register for an account. You agree to provide accurate, current, and complete information during the registration process and keep your account information updated.
            </p>

            <p><strong>3. Intellectual Property</strong><br />
              All content, trademarks, and data on the Fuel Flux application, including but not limited to text, software, code, designs, graphics, and logos, are the property of Fuel Flux or its licensors. You may not use, copy, reproduce, or distribute any content without prior written consent.
            </p>

            <p><strong>4. Service Availability</strong><br />
              We strive to keep the Fuel Flux application operational at all times. However, we do not guarantee that the app will always be available or error-free. We reserve the right to modify, suspend, or discontinue any part of the app at any time without notice.
            </p>
          </div>
        </Modal>
      )}

      {/* ---------------- Contact Us Modal ---------------- */}
      {activeModal === 'contact' && (
        <Modal title="Contact Us" closeModal={closeModal}>
          <div className='flex flex-col gap-2'>
            <p> Email Us : mpankitrai557@gmailcom </p>
       
        <p>Phone : +91 9336702228</p>

          </div>
        </Modal>
      )}
    </div>
  );
};

export default FooterComp;


// -------------------- Modal Component --------------------
const Modal = ({ title, children, closeModal }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-2">
      <div className="relative bg-white w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-lg p-5 shadow-xl">
        <button
          onClick={closeModal}
          className="absolute top-2 right-4 text-2xl font-bold text-gray-700 hover:text-red-600"
        >
          &times;
        </button>
        <h2 className="text-xl font-bold mb-4 text-center">{title}</h2>
        {children}
      </div>
    </div>
  );
};
