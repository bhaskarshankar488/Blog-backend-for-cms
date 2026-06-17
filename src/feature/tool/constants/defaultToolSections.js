import { SECTION_TYPES } from "./sectionTypes.js";
import { SECTION_KEYS } from "./sectionKeys.js";

export const DEFAULT_TOOL_SECTIONS = [
  {
    key: SECTION_KEYS.CORE_CAPABILITIES,
    title: "Core Capabilities",
    type: SECTION_TYPES.CARD_GRID,
    order: 1,
  },

  {
    key: SECTION_KEYS.PROS,
    title: "Pros",
    type: SECTION_TYPES.CUSTOM,
    order: 2,
  },

  {
    key: SECTION_KEYS.CONS,
    title: "Cons",
    type: SECTION_TYPES.CUSTOM,
    order: 3,
  },

  {
    key: SECTION_KEYS.LATEST_BLOGS,
    title: "Latest Blogs",
    type: SECTION_TYPES.BLOG_LIST,
    order: 4,
  },

  {
    key: SECTION_KEYS.ENGINE_AND_VALUE,
    title: "Engine & Value",
    type: SECTION_TYPES.CARD_GRID,
    order: 5,
  },

  {
    key: SECTION_KEYS.UNDER_THE_HOOD,
    title: "Under The Hood",
    type: SECTION_TYPES.CARD_GRID,
    order: 6,
  },

  {
    key: SECTION_KEYS.FEATURES,
    title: "Features",
    type: SECTION_TYPES.LOGO_GRID,
    order: 7,
  },

  {
    key: SECTION_KEYS.BEST_FOR,
    title: "Best For",
    type: SECTION_TYPES.CARD_GRID,
    order: 8,
  },

  {
    key: SECTION_KEYS.PERFORMANCE,
    title: "Performance",
    type: SECTION_TYPES.METRICS,
    order: 9,
  },

  {
    key: SECTION_KEYS.FAQS,
    title: "FAQs",
    type: SECTION_TYPES.ACCORDION,
    order: 10,
  },
];