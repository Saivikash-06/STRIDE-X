"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  X,
  FolderKanban,
  Building2,
  Users,
  Layers,
  ClipboardCheck,
  MessageSquareWarning,
  MapPin,
  Command,
  ArrowRight,
} from "lucide-react";
import {
  MOCK_PROJECTS,
  MOCK_SCHEMES,
  MOCK_NGOS,
  MOCK_BENEFICIARIES,
  MOCK_GRIEVANCES,
  MOCK_INSPECTIONS,
} from "@/mock/adminMockData";
import { AdminTab, Project } from "@/types/admin";

interface GlobalSearchResultItem {
  id: string;
  category: "projects" | "schemes" | "ngos" | "beneficiaries" | "grievances" | "inspections" | "districts";
  title: string;
  subtitle: string;
  badge: string;
  tab: AdminTab;
  meta?: unknown;
}

interface GlobalSearchProps {
  onSelectTab?: (tab: AdminTab) => void;
  onSelectProject?: (project: Project) => void;
  className?: string;
  placeholder?: string;
}

export const GlobalSearch: React.FC<GlobalSearchProps> = ({
  onSelectTab,
  onSelectProject,
  className = "",
  placeholder = "Search projects, schemes, NGOs, beneficiaries, grievances, inspections...",
}) => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Keyboard shortcut listener (Ctrl+K / Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Compute matched items
  const results: GlobalSearchResultItem[] = React.useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();
    const items: GlobalSearchResultItem[] = [];

    // 1. Projects
    MOCK_PROJECTS.forEach((p) => {
      if (
        p.name.toLowerCase().includes(q) ||
        p.projectCode.toLowerCase().includes(q) ||
        p.district.toLowerCase().includes(q) ||
        p.state.toLowerCase().includes(q)
      ) {
        items.push({
          id: p.id,
          category: "projects",
          title: p.name,
          subtitle: `${p.projectCode} • ${p.district}, ${p.state} • ${p.schemeName}`,
          badge: p.riskLevel + " RISK",
          tab: "projects",
          meta: p,
        });
      }
    });

    // 2. Schemes
    MOCK_SCHEMES.forEach((s) => {
      if (s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q)) {
        items.push({
          id: s.id,
          category: "schemes",
          title: `${s.code} - ${s.name}`,
          subtitle: `${s.category} • Budget: ₹${s.budgetAllocatedCr} Cr`,
          badge: s.status,
          tab: "schemes",
          meta: s,
        });
      }
    });

    // 3. NGOs
    MOCK_NGOS.forEach((n) => {
      if (
        n.name.toLowerCase().includes(q) ||
        n.darpanId.toLowerCase().includes(q) ||
        n.district.toLowerCase().includes(q)
      ) {
        items.push({
          id: n.id,
          category: "ngos",
          title: n.name,
          subtitle: `Darpan ID: ${n.darpanId} • ${n.district}, ${n.state}`,
          badge: `Score ${n.complianceScore}%`,
          tab: "ngos",
          meta: n,
        });
      }
    });

    // 4. Beneficiaries
    MOCK_BENEFICIARIES.forEach((b) => {
      if (b.fullName.toLowerCase().includes(q) || b.beneficiaryId.toLowerCase().includes(q)) {
        items.push({
          id: b.id,
          category: "beneficiaries",
          title: b.fullName,
          subtitle: `${b.beneficiaryId} • Category: ${b.category} • ${b.district}`,
          badge: b.aadhaarVerified ? "Aadhaar e-KYC" : "Unverified",
          tab: "beneficiaries",
          meta: b,
        });
      }
    });

    // 5. Grievances
    MOCK_GRIEVANCES.forEach((g) => {
      if (
        g.grievanceId.toLowerCase().includes(q) ||
        g.description.toLowerCase().includes(q) ||
        g.category.toLowerCase().includes(q)
      ) {
        items.push({
          id: g.id,
          category: "grievances",
          title: `${g.grievanceId}: ${g.category}`,
          subtitle: `${g.projectName} • Beneficiary: ${g.beneficiaryName}`,
          badge: g.priority,
          tab: "grievances",
          meta: g,
        });
      }
    });

    // 6. Inspections
    MOCK_INSPECTIONS.forEach((i) => {
      if (
        i.inspectionId.toLowerCase().includes(q) ||
        i.projectName.toLowerCase().includes(q) ||
        i.inspectorName.toLowerCase().includes(q)
      ) {
        items.push({
          id: i.id,
          category: "inspections",
          title: `${i.inspectionId} - ${i.projectName}`,
          subtitle: `Inspector: ${i.inspectorName} (${i.inspectorBadge})`,
          badge: i.status,
          tab: "inspections",
          meta: i,
        });
      }
    });

    return items.slice(0, 15);
  }, [query]);

  const handleSelectResult = (item: GlobalSearchResultItem) => {
    setIsOpen(false);
    setQuery("");
    if (item.category === "projects" && item.meta && onSelectProject) {
      onSelectProject(item.meta as Project);
    }
    if (onSelectTab) {
      onSelectTab(item.tab);
    }
  };

  const getCategoryIcon = (category: GlobalSearchResultItem["category"]) => {
    switch (category) {
      case "projects":
        return <FolderKanban className="w-3.5 h-3.5 text-blue-500" />;
      case "schemes":
        return <Layers className="w-3.5 h-3.5 text-indigo-500" />;
      case "ngos":
        return <Building2 className="w-3.5 h-3.5 text-teal-500" />;
      case "beneficiaries":
        return <Users className="w-3.5 h-3.5 text-emerald-500" />;
      case "grievances":
        return <MessageSquareWarning className="w-3.5 h-3.5 text-amber-500" />;
      case "inspections":
        return <ClipboardCheck className="w-3.5 h-3.5 text-purple-500" />;
      default:
        return <MapPin className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Input Field */}
      <div className="relative flex items-center">
        <Search className="w-4 h-4 absolute left-3 text-slate-400 pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          placeholder={placeholder}
          className="w-full pl-9 pr-14 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0B5ED7]/30 dark:focus:ring-blue-500/40 focus:bg-white dark:focus:bg-slate-900 transition-all shadow-xs"
        />

        <div className="absolute right-2.5 flex items-center gap-1">
          {query ? (
            <button
              onClick={() => setQuery("")}
              className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-200/60 dark:bg-slate-700/60 rounded border border-slate-300 dark:border-slate-600">
              <Command className="w-2.5 h-2.5" /> K
            </kbd>
          )}
        </div>
      </div>

      {/* Results Dropdown */}
      {isOpen && query.trim().length > 0 && (
        <div className="absolute left-0 right-0 mt-2 max-h-96 overflow-y-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl z-50 p-2 divide-y divide-slate-100 dark:divide-slate-800/60 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center justify-between">
            <span>Search Results ({results.length})</span>
            <span className="font-normal text-[10px]">Press Esc to close</span>
          </div>

          {results.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                No matching government records found
              </p>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                Try searching for scheme code (e.g. &quot;PM-AJAY&quot;), state, project name, or Grievance ID.
              </p>
            </div>
          ) : (
            <div className="py-1 space-y-1">
              {results.map((item) => (
                <button
                  key={`${item.category}-${item.id}`}
                  onClick={() => handleSelectResult(item)}
                  className="w-full text-left p-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-start gap-2.5 min-w-0">
                    <div className="p-1.5 rounded-md bg-slate-100 dark:bg-slate-800 shrink-0 mt-0.5">
                      {getCategoryIcon(item.category)}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-[#0B5ED7] dark:group-hover:text-blue-400">
                        {item.title}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {item.subtitle}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      {item.badge}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
