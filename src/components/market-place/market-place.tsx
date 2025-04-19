import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { TEMPLATES_CATEGORIES } from "../../data";
import cv_template from "../../assets/cv-template.svg";

const MarketPlace = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const defaultCategory = searchParams.get("template") || "all";

  const [selectedCategory, setSelectedCategory] = useState(defaultCategory);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const tabRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    const currentTab = tabRefs.current[selectedCategory];
    if (currentTab) {
      const { offsetLeft, offsetWidth } = currentTab;
      setIndicatorStyle({ left: offsetLeft, width: offsetWidth });
    }
  }, [selectedCategory]);

  // Sync URL when category changes
  const handleTabClick = (id: string) => {
    setSelectedCategory(id);
    setSearchParams({ template: id });
  };

  return (
    <div className="font-primary">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Template Marketplace</h1>
        <p>Choose a professional template to get started with your resume</p>
      </div>

      <div className="relative mt-10">
        <div className="flex justify-center items-center gap-10">
          {TEMPLATES_CATEGORIES.map((category) => (
            <div
              key={category.id}
              ref={(el) => {
                tabRefs.current[category.id] = el;
              }}
              onClick={() => handleTabClick(category.id)}
              className={`cursor-pointer pb-2 ${
                selectedCategory === category.id
                  ? "font-semibold text-blue-600"
                  : "text-gray-700"
              }`}
            >
              {category.name}
            </div>
          ))}
        </div>

        <div className="relative h-[2px] mt-2">
          <div
            className="absolute bg-blue-600 transition-all duration-300"
            style={{
              left: indicatorStyle.left,
              width: indicatorStyle.width,
              height: 2,
            }}
          />
        </div>

      

        <div className="flex flex-col justify-between rounded-2xl shadow-md border border-gray-200 mt-10 w-[400px] h-[500px] overflow-hidden">
          
          <div className="h-2/3 border-t border-l border-r border-gray-200 rounded-t-2xl flex justify-center items-center overflow-hidden">
            <img
              src={cv_template}
              alt="template preview"
              className="h-full w-auto object-contain hover:cursor-pointer"
            />
          </div>

         
          <div className="flex flex-col h-1/3 border border-gray-200 rounded-b-2xl px-4 py-3">
            <div className="flex justify-between items-center mb-4">
              <span>Professional Resume</span>
              <span className="px-5 rounded-lg bg-black text-white">Free</span>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-blue-200"
            >
              Use Template
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketPlace;
