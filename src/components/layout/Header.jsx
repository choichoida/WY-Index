import { Search, Map, LayoutDashboard } from 'lucide-react';

const Header = () => {
    return (
        <header className="h-[64px] bg-white border-b border-slate-200 sticky top-0 z-20 flex items-center justify-between px-6 shadow-sm">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-primary text-white flex items-center justify-center font-bold text-lg">
                    8
                </div>
                <div className="flex flex-col">
                    <span className="text-[10px] text-slate-500 font-medium leading-none mb-0.5">에잇 프로젝트</span>
                    <h1 className="text-xl font-bold text-primary tracking-tight leading-none">통계 정보 포털</h1>
                </div>
            </div>

            <nav className="flex items-center gap-2">
                {/* Main Menu */}
                <div className="flex items-center mr-6">
                    <button className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-primary transition-colors">
                        <LayoutDashboard size={18} />
                        <span className="font-bold text-sm">대시보드</span>
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 text-slate-500 hover:text-primary transition-colors">
                        <div className="w-[3px] h-4 bg-slate-200 mx-2"></div>
                        <span className="font-medium text-sm">통계정보</span>
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 text-slate-500 hover:text-primary transition-colors">
                        <Search size={18} />
                        <span className="font-medium text-sm">조건검색</span>
                    </button>
                </div>

                {/* Utilities */}
                <div className="flex items-center gap-4 text-xs text-slate-400 font-medium border-l border-slate-200 pl-6">
                    <button className="hover:text-slate-600">로그인</button>
                    <span className="text-slate-200">|</span>
                    <button className="hover:text-slate-600">홈</button>
                    <span className="text-slate-200">|</span>
                    <button className="hover:text-slate-600">사이트맵</button>
                    <span className="text-slate-200">|</span>
                    <button className="hover:text-slate-600">매뉴얼</button>
                </div>
            </nav>
        </header>
    );
};

export default Header;
