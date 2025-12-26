import * as React from "jsx-dom";
import { useDialog } from "../Dialog";
import Fuse from "fuse.js";
import type { ShortPageData } from "../../shared/type";
import { formatSecond } from "../../shared/time";

export const mountSearch = (triggerSelector: string) => {
  const trigger = document.querySelector(triggerSelector);
  if (!trigger) return;

  let posts: ShortPageData[] = [];
  let fuse: Fuse<ShortPageData> | null = null;
  let filteredPosts: ShortPageData[] = [];
  
  // State
  let query = "";
  let selectedTag = "";
  let selectedYear = "";

  // Elements
  const resultsContainer = <div class="flex flex-col gap-2 max-h-[60vh] overflow-y-auto p-2"></div> as HTMLElement;
  
  const renderResults = () => {
    resultsContainer.innerHTML = "";
    if (filteredPosts.length === 0) {
      resultsContainer.appendChild(<div class="text-center text-gray-500 py-4">No results found.</div>);
      return;
    }

    filteredPosts.forEach(post => {
      const el = (
        <a href={`/post/${post.id}`} class="block p-3 rounded hover:bg-primary/5 transition-colors border border-transparent hover:border-primary/10">
          <div class="font-bold text-lg">{post.title}</div>
          <div class="text-sm text-gray-500 flex gap-2 items-center mt-1">
            <span>{formatSecond(post.createTime)}</span>
            {post.tags.map(tag => <span class="bg-gray-100 dark:bg-gray-800 px-1 rounded text-xs">#{tag}</span>)}
          </div>
          <div class="text-sm mt-1 opacity-80 line-clamp-2">{post.intro}</div>
        </a>
      );
      resultsContainer.appendChild(el);
    });
  };

  const updateSearch = () => {
    if (!posts.length) return;

    let results = posts;

    // 1. Text Search
    if (query && fuse) {
      results = fuse.search(query).map(r => r.item);
    }

    // 2. Tag Filter
    if (selectedTag) {
      results = results.filter(p => p.tags.includes(selectedTag));
    }

    // 3. Year Filter
    if (selectedYear) {
      results = results.filter(p => {
        const date = new Date(p.createTime * 1000);
        return date.getFullYear().toString() === selectedYear;
      });
    }

    filteredPosts = results;
    renderResults();
  };

  const initData = async () => {
    if (posts.length) return;
    try {
      const res = await fetch("/api/search.json");
      posts = await res.json();
      fuse = new Fuse(posts, {
        keys: ["title", "intro", "tags"],
        threshold: 0.4,
      });
      filteredPosts = posts;
      renderResults();
      populateFilters();
    } catch (e) {
      console.error("Failed to load search index", e);
    }
  };

  const tagSelect = <select class="bg-bg border border-gray-300 dark:border-gray-700 rounded px-2 py-1 text-sm outline-none focus:border-primary">
    <option value="">All Tags</option>
  </select> as HTMLSelectElement;

  const yearSelect = <select class="bg-bg border border-gray-300 dark:border-gray-700 rounded px-2 py-1 text-sm outline-none focus:border-primary">
    <option value="">All Time</option>
  </select> as HTMLSelectElement;

  const populateFilters = () => {
    // Tags
    const tags = new Set<string>();
    posts.forEach(p => p.tags.forEach(t => tags.add(t)));
    Array.from(tags).sort().forEach(tag => {
      tagSelect.appendChild(<option value={tag}>{tag}</option>);
    });

    // Years
    const years = new Set<string>();
    posts.forEach(p => {
      const y = new Date(p.createTime * 1000).getFullYear().toString();
      years.add(y);
    });
    Array.from(years).sort().reverse().forEach(y => {
      yearSelect.appendChild(<option value={y}>{y}</option>);
    });
  };

  tagSelect.addEventListener("change", (e) => {
    selectedTag = (e.target as HTMLSelectElement).value;
    updateSearch();
  });

  yearSelect.addEventListener("change", (e) => {
    selectedYear = (e.target as HTMLSelectElement).value;
    updateSearch();
  });

  const searchInput = <input 
    type="text" 
    placeholder="Search..." 
    class="w-full bg-transparent border-b border-gray-300 dark:border-gray-700 p-2 outline-none focus:border-primary text-lg"
  /> as HTMLInputElement;

  searchInput.addEventListener("input", (e) => {
    query = (e.target as HTMLInputElement).value;
    updateSearch();
  });

  const SearchContent = () => (
    <div class="w-[80vw] max-w-[600px] bg-bg rounded-lg shadow-xl flex flex-col max-h-[80vh]">
      <div class="p-4 border-b border-gray-200 dark:border-gray-800">
        {searchInput}
        <div class="flex gap-2 mt-3">
          {tagSelect}
          {yearSelect}
        </div>
      </div>
      {resultsContainer}
    </div>
  );

  const { show } = useDialog(() => SearchContent());

  trigger.addEventListener("click", () => {
    show();
    initData();
    setTimeout(() => searchInput.focus(), 100);
  });
};
