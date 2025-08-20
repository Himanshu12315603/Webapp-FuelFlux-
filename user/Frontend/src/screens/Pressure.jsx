import React, { useState } from "react";
import HeaderComp from "../components/HeaderComp";
import { FaPlus, FaMinus } from "react-icons/fa";

const Pressure = () => {
  const [isFaqOpen, setIsFaqOpen] = useState(false);

  const toggleFaq = () => {
    setIsFaqOpen((prev) => !prev);
  };

  return (
    <div>
      <HeaderComp />
      <div className="min-h-screen bg-white font-sans px-4 sm:px-6 lg:px-8">
        <main className="max-w-3xl mx-auto mt-8 bg-white rounded-lg p-6 sm:p-8 shadow-md">
          <h1 className="text-3xl font-bold text-center mb-2 text-gray-800">
            TIRE PRESSURE
          </h1>
          <p className="text-center text-gray-500 mb-6">
            Maintain optimal tire pressure for safety, fuel efficiency, and longer tire life
          </p>

          <div className="flex border-b border-gray-200 mb-4">
            <button className="px-4 py-2 text-orange-500 font-medium border-b-2 border-orange-400 focus:outline-none">
              Quick Guide
            </button>
          </div>

          <ol className="space-y-3 mb-8">
            {[
              "Make sure your tires are cold (haven't been driven for at least 3 hours)",
              "Remove the valve cap from your tire",
              "Press the tire gauge firmly onto the valve stem",
              "Read the pressure displayed on the gauge",
              "Compare with the recommended pressure for your vehicle",
              "Add air if too low, release air if too high",
              "Replace the valve cap securely",
            ].map((item, index) => (
              <li key={index} className="flex items-start">
                <span className="bg-orange-500 text-white rounded-full w-4 h-4 md:w-7 md:h-7 flex items-center justify-center font-bold mr-3 md:text text-xs md:text-base">
                  {index + 1}
                </span>
                <span className="text-gray-700">{item}</span>
              </li>
            ))}
          </ol>

          {/* FAQ Section */}
          <div className="border-t pt-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Frequently Asked Questions</h2>
            <div className="border rounded-md">
              <div
                className="flex justify-between items-center cursor-pointer p-4 bg-gray-100 hover:bg-gray-200 transition"
                onClick={toggleFaq}
              >
                <p className="font-medium text-gray-800">Why Proper Tire Pressure Matters</p>
                <span className="text-gray-600">
                  {isFaqOpen ? <FaMinus /> : <FaPlus />}
                </span>
              </div>
              {isFaqOpen && (
                <div className="p-4 text-gray-700 bg-white border-t text-sm space-y-2">
                  <p>• Improves fuel efficiency (save up to 3% on fuel)</p>
                  <p>• Extends tire life and reduces wear</p>
                  <p>• Enhances vehicle handling and safety</p>
                  <p>• Reduces the risk of blowouts and tire failures</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Pressure;
