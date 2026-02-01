import { useState } from 'react';
import { ChevronDown, ChevronRight, Folder, FolderOpen } from 'lucide-react';

const Sidebar = () => {
    const [openMenus, setOpenMenus] = useState(['structured']); // Default open

    const toggleMenu = (id) => {
        setOpenMenus(prev =>
            prev.includes(id)
                ? prev.filter(item => item !== id)
                : [...prev, id]
        );
    };

    const MenuItem = ({ label, active = false }) => (
        <div className={`px-4 py-2.5 text-sm cursor-pointer transition-colors ${active
                ? 'bg-blue-50 text-primary font-bold border-r-2 border-primary'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}>
            {label}
        </div>
    );

    return (
        <aside className="w-[250px] bg-white border-r border-slate-200 min-h-[calc(100vh-64px)] fixed left-0 top-[64px] pb-20 overflow-y-auto">
            {/* Tabs */}
            <div className="flex border-b border-slate-200">
                <button className="flex-1 py-3 text-sm font-bold text-primary border-b-2 border-primary bg-slate-50/50">
                    정형통계
                </button>
                <button className="flex-1 py-3 text-sm font-medium text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors">
                    비정형통계
                </button>
            </div>

            {/* Content */}
            <div className="p-4">
                <div className="text-xs font-bold text-slate-400 mb-4 flex items-center gap-2">
                    <FolderOpen size={14} />
                    통계정보
                </div>

                {/* Accordion Menu: 정형통계 */}
                <div className="mb-2">
                    <button
                        onClick={() => toggleMenu('structured')}
                        className="w-full flex items-center justify-between text-sm font-medium text-slate-700 py-2 hover:text-primary transition-colors"
                    >
                        <span className="flex items-center gap-2">
                            <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                            정형통계
                        </span>
                        {openMenus.includes('structured') ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </button>

                    {openMenus.includes('structured') && (
                        <div className="ml-2 pl-2 border-l border-slate-100 mt-1 space-y-1">
                            <MenuItem label="기초생활보장" active />
                            <MenuItem label="장애인복지" />
                            <MenuItem label="긴급복지" />
                            <MenuItem label="아동청소년" />
                            <MenuItem label="노인복지" />
                        </div>
                    )}
                </div>

                {/* Accordion Menu: 비정형통계 */}
                <div className="mb-2">
                    <button
                        onClick={() => toggleMenu('unstructured')}
                        className="w-full flex items-center justify-between text-sm font-medium text-slate-700 py-2 hover:text-primary transition-colors"
                    >
                        <span className="flex items-center gap-2">
                            <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                            비정형통계
                        </span>
                        {openMenus.includes('unstructured') ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </button>

                    {openMenus.includes('unstructured') && (
                        <div className="ml-2 pl-2 border-l border-slate-100 mt-1 space-y-1">
                            <MenuItem label="인기보고서(전체)" />
                            <MenuItem label="자주찾는보고서(개인)" />
                        </div>
                    )}
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
